#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const prodDir = path.join(repoRoot, "prod");

async function main() {
  if (typeof fetch !== "function") {
    throw new Error("Global fetch API is unavailable. Please use Node 18+.");
  }

  const year = resolveYear();
  const outputDir = path.join(prodDir, String(year));

  if (!fs.existsSync(outputDir)) {
    throw new Error(`Target folder prod/${year} does not exist`);
  }

  const config = loadConfig();
  const databaseUrl = normalizeDatabaseUrl(config.databaseURL);

  console.log(`Exporting Firebase data to prod/${year}`);
  const collections = [
    { name: "races", transform: normalizeRace },
    { name: "riders" },
    { name: "results" },
  ];

  for (const item of collections) {
    const data = await fetchCollection(databaseUrl, item.name);
    const list = Object.keys(data).map((key) => ({
      key,
      ...data[key],
    }));
    const transform = item.transform ?? ((value) => value);
    const normalized = list.map(transform);

    writeCollection(outputDir, item.name, normalized);
    console.log(`• Wrote ${item.name}.js (${normalized.length} records)`);
  }
}

function resolveYear() {
  const args = process.argv.slice(2);
  for (const arg of args) {
    if (arg.startsWith("--year=")) {
      return parseYear(arg.split("=")[1]);
    }
    if (/^\d{4}$/.test(arg)) {
      return parseYear(arg);
    }
  }

  const years = fs
    .readdirSync(prodDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
    .map((entry) => Number.parseInt(entry.name, 10))
    .sort((a, b) => a - b);

  if (!years.length) {
    throw new Error("Unable to detect any prod year folders");
  }

  return years[years.length - 1];
}

function parseYear(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid year: ${value}`);
  }
  return parsed;
}

function loadConfig() {
  const configPath = path.join(repoRoot, "config.js");
  delete require.cache[require.resolve(configPath)];
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const config = require(configPath);
  if (!config.databaseURL) {
    throw new Error("config.js missing databaseURL");
  }
  return config;
}

function normalizeDatabaseUrl(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function fetchCollection(databaseUrl, name) {
  const response = await fetch(`${databaseUrl}/${name}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${name}: ${response.status} ${response.statusText}`);
  }
  const body = await response.json();
  return body ?? {};
}

function normalizeRace(race) {
  if (race.date) {
    const [date] = race.date.split(" ");
    race.date = new Date(date).toISOString();
  }
  return race;
}

function writeCollection(outputDir, name, data) {
  const destination = path.join(outputDir, `${name}.js`);
  const fileContents = `const ${name} = ${JSON.stringify(data)};\n`;
  fs.writeFileSync(destination, fileContents);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
