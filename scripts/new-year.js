#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const vm = require("vm");

const repoRoot = path.join(__dirname, "..");
const prodDir = path.join(repoRoot, "prod");

async function main() {
  const targetYear = resolveTargetYear();
  const sourceYear = targetYear - 1;

  console.log(`Preparing archive for ${targetYear} (copying from ${sourceYear})`);
  ensureYearFolderExists(sourceYear);
  ensureYearFolderMissing(targetYear);

  copyYearFolder(sourceYear, targetYear);
  updateYearIndexTitle(targetYear);
  await refreshWrs(targetYear);
  syncRootConfigWithProd();
  updatePackageBuildScript(targetYear);
  updateSidebarLinks(targetYear);

  console.log(
    `Finished setting up prod/${targetYear}. Run ` +
      "`node scripts/export-year-data.js --year " +
      targetYear +
      "` once the Firebase data is ready."
  );
}

function resolveTargetYear() {
  const args = process.argv.slice(2);
  for (const arg of args) {
    if (arg.startsWith("--year=")) {
      return parseYear(arg.split("=")[1]);
    }
    if (/^\d{4}$/.test(arg)) {
      return parseYear(arg);
    }
  }

  const years = getProdYears();
  if (!years.length) {
    throw new Error("No prod year folders found, cannot determine target year");
  }
  return years[years.length - 1] + 1;
}

function parseYear(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid year: ${value}`);
  }
  return parsed;
}

function getProdYears() {
  return fs
    .readdirSync(prodDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
    .map((entry) => Number.parseInt(entry.name, 10))
    .sort((a, b) => a - b);
}

function ensureYearFolderExists(year) {
  const yearPath = path.join(prodDir, String(year));
  if (!fs.existsSync(yearPath)) {
    throw new Error(`Folder prod/${year} does not exist`);
  }
}

function ensureYearFolderMissing(year) {
  const yearPath = path.join(prodDir, String(year));
  if (fs.existsSync(yearPath)) {
    throw new Error(`Folder prod/${year} already exists`);
  }
}

function copyYearFolder(sourceYear, targetYear) {
  const sourcePath = path.join(prodDir, String(sourceYear));
  const targetPath = path.join(prodDir, String(targetYear));

  fs.cpSync(sourcePath, targetPath, { recursive: true, errorOnExist: true });
  console.log(`• Copied prod/${sourceYear} → prod/${targetYear}`);
}

function updateYearIndexTitle(targetYear) {
  const indexPath = path.join(prodDir, String(targetYear), "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn(`! Skipping title update; ${indexPath} missing`);
    return;
  }

  const contents = fs.readFileSync(indexPath, "utf8");
  const updated = contents.replace(
    /(<title>WTOS Uitslagen )\d{4}(<\/title>)/,
    `$1${targetYear}$2`
  );

  if (contents === updated) {
    console.warn(`! Title pattern not found in ${indexPath}, no change made`);
    return;
  }

  fs.writeFileSync(indexPath, updated);
  console.log(`• Updated title in prod/${targetYear}/index.html`);
}

async function refreshWrs(targetYear) {
  const destination = path.join(prodDir, String(targetYear), "wrs.js");
  await downloadFile("https://uitslagen.wtos.nl/wrs.js", destination);
  console.log(`• Downloaded latest wrs.js for ${targetYear}`);
}

function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          file.close(() => {
            fs.rmSync(destination, { force: true });
            reject(new Error(`Failed to download ${url} (${response.statusCode})`));
          });
          response.resume();
          return;
        }

        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (error) => {
        file.close(() => fs.rmSync(destination, { force: true }));
        reject(error);
      });
  });
}

function syncRootConfigWithProd() {
  const prodConfigPath = path.join(prodDir, "config.js");
  const rootConfigPath = path.join(repoRoot, "config.js");
  const backupPath = path.join(repoRoot, ".config.dev.backup.js");

  const prodConfig = extractProdConfig(prodConfigPath);
  const currentConfig = fs.readFileSync(rootConfigPath, "utf8");
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, currentConfig);
    console.log("• Backed up existing config.js to .config.dev.backup.js");
  }

  const newContents =
    "module.exports = " + JSON.stringify(prodConfig, null, 2) + ";\n";
  fs.writeFileSync(rootConfigPath, newContents);
  console.log("• Updated config.js to use production credentials");
}

function extractProdConfig(prodConfigPath) {
  const contents = fs.readFileSync(prodConfigPath, "utf8");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(contents + "\nglobalThis.__CONFIG__ = config;", sandbox);
  if (!sandbox.__CONFIG__) {
    throw new Error(`Unable to read config from ${prodConfigPath}`);
  }
  return sandbox.__CONFIG__;
}

function updatePackageBuildScript(targetYear) {
  const packageJsonPath = path.join(repoRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const build = pkg?.scripts?.build;
  if (!build) {
    throw new Error("package.json scripts.build not found");
  }

  const copySnippet = `cp -r prod/${targetYear} dist`;
  if (build.includes(copySnippet)) {
    console.log(`• package.json already copies prod/${targetYear}`);
    return;
  }

  pkg.scripts.build = `${build} && ${copySnippet}`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`• Added prod/${targetYear} to package.json build script`);
}

function updateSidebarLinks(targetYear) {
  const viewPath = path.join(repoRoot, "src", "App", "View.elm");
  const contents = fs.readFileSync(viewPath, "utf8");
  if (contents.includes(`Uitslagen ${targetYear}`)) {
    console.log("• Sidebar already references the new year");
    return;
  }

  const yearLinkPattern =
    /\n(\s*, p \[ class "menu-label" \] \[ a \[ href "https:\/\/uitslagen\.wtos\.nl\/\d{4}\/", target "_blank", onClick App\.Msg\.CloseMobileMenu \] \[ text "Uitslagen \d{4}" \] \])\n/;
  const match = contents.match(yearLinkPattern);
  if (!match || typeof match.index !== "number") {
    throw new Error("Unable to locate existing year links in App/View.elm");
  }

  const indentWithComma = match[1].match(/^\s*,/);
  const indent = indentWithComma ? indentWithComma[0] : "        ,";
  const link =
    `\n${indent} p [ class "menu-label" ] [ a [ href "https://uitslagen.wtos.nl/${targetYear}/", target "_blank", onClick App.Msg.CloseMobileMenu ] [ text "Uitslagen ${targetYear}" ] ]\n`;
  const updated = contents.slice(0, match.index) + link + contents.slice(match.index + 1);
  fs.writeFileSync(viewPath, updated);
  console.log("• Inserted sidebar link for the new year");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
