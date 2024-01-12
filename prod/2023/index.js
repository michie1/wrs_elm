"use strict";

function hasParam(name) {
  var regex = new RegExp("[\\?&]" + name);
  var results = regex.exec(location.search);
  return results !== null;
}

var url = new URL(window.location.href);
var token = url.searchParams.get("token");

if (token !== null) {
  window.history.replaceState(null, null, window.location.href.split("?")[0]);
}

const { wtosLoginUrl } = config;

const app = Elm.Main.init({
  node: document.getElementById("main"),
  flags: {
    wtosLoginUrl
  }
});

loadRiders();
loadRaces();
loadResults();

function loadRiders() {
  const data = Object.keys(data).map(function(key) {
    return Object.assign(
      {
        key: key
      },
      data[key]
    );
  });

  app.ports.infoForElm.send({
    tag: "RidersLoaded",
    data: data
  });
}

function loadRaces() {
  const data = Object.keys(data)
    .map(function(key) {
      return Object.assign(
        {
          key: key
        },
        data[key]
      );
    })
    .map(race => {
      race.date = new Date(race.date.split(" ")[0]).toISOString();
      return race;
    });

  app.ports.infoForElm.send({
    tag: "RacesLoaded",
    data: data
  });
}

function loadResults() {
  const data = Object.keys(data).map(function(key) {
    return Object.assign(
      {
        key: key
      },
      data[key]
    );
  });
  app.ports.infoForElm.send({
    tag: "ResultsLoaded",
    data: data
  });
}

function addRace() {}

function addRider() {}

function addResult() {}

function editResult() {}

function userSignedIn() {}

function userSignOut() {}

app.ports.infoForOutside.subscribe(function(msg) {
  if (msg.tag === "RiderAdd") {
    addRider(msg.data);
  } else if (msg.tag === "RaceAdd") {
    addRace(msg.data);
  } else if (msg.tag === "ResultAdd") {
    addResult(msg.data);
  } else if (msg.tag === "ResultEdit") {
    editResult(msg.data);
  } else if (msg.tag === "UserSignOut") {
    userSignOut();
  } else {
    console.log("msg", msg);
    document.getElementsByTagName("body")[0].innerHTML =
      "Something went wrong. Please try again in Chrome or see console for detailed error message.";
  }
});
