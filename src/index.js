(function() {
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

  function setup(firebase) {
    loadRiders();
    loadRaces();
    loadResults();

    firebase.auth().onAuthStateChanged(function(user) {
      if (user !== null) {
        if (user.isAnonymous === false) {
          userSignedIn(user);
        }
      } else {
        firebase.auth().signInAnonymously();
      }
    });

    if (token !== null) {
      firebase.auth().signInWithCustomToken(token);
    }
  }

  const config = require("../config");
  firebase.initializeApp(config);

  const { Elm } = require("./Main");
  const app = Elm.Main.init({
    node: document.getElementById("main"),
    flags: {
      wtosLoginUrl: config.wtosLoginUrl
    }
  });

  setup(firebase, app);

  function loadRiders() {
    firebase
      .database()
      .ref("/riders/")
      .orderByChild("id")
      .on("value", function(snapshot) {
        const val = snapshot.val();
        const arr = val
          ? Object.keys(val).map(function(key) {
              return Object.assign(
                {
                  key: key
                },
                val[key]
              );
            })
          : [];
        app.ports.infoForElm.send({
          tag: "RidersLoaded",
          data: arr
        });
      });
  }

  function loadRaces() {
    firebase
      .database()
      .ref("/races/")
      .on("value", function(snapshot) {
        const val = snapshot.val();
        const races = (val
          ? Object.keys(val).map(function(key) {
              return Object.assign(
                {
                  key: key
                },
                val[key]
              );
            })
          : []
        ).map(race => {
          race.date = new Date(race.date.split(" ")[0]).toISOString();
          return race;
        });

        app.ports.infoForElm.send({
          tag: "RacesLoaded",
          data: races
        });
      });
  }

  function loadResults() {
    firebase
      .database()
      .ref("/results/")
      .on("value", function(snapshot) {
        const val = snapshot.val();
        const arr = val
          ? Object.keys(val).map(function(key) {
              return Object.assign(
                {
                  key: key
                },
                val[key]
              );
            })
          : [];
        app.ports.infoForElm.send({
          tag: "ResultsLoaded",
          data: arr
        });
      });
  }

  function addRace(race) {
    const pushedRace = firebase
      .database()
      .ref("/races/")
      .push();
    pushedRace.set(race).then(function() {
      app.ports.infoForElm.send({
        tag: "RaceAdded",
        data: pushedRace.key
      });
    });
  }

  function addRider(rider) {
    const pushedRider = firebase
      .database()
      .ref("/riders/")
      .push();
    pushedRider.set(rider).then(function() {
      app.ports.infoForElm.send({
        tag: "RiderAdded",
        data: pushedRider.key
      });
    });
  }

  function addResult(result) {
    const pushedResult = firebase
      .database()
      .ref("/results/")
      .push();
    pushedResult.set(result).then(function() {
      app.ports.infoForElm.send({
        tag: "ResultAdded",
        data: {
          key: pushedResult.key,
          riderKey: result.riderKey,
          raceKey: result.raceKey,
          category: result.category,
          result: result.result,
          outfit: result.outfit
        }
      });
    });
  }

  function editResult(result) {
    firebase
      .database()
      .ref("results/" + result.key)
      .update({
        result: result.result,
        category: result.category
      })
      .then(function() {
        app.ports.infoForElm.send({
          tag: "ResultEdited",
          data: result.raceKey
        });
      });
  }

  function userSignedIn(user) {
    app.ports.infoForElm.send({
      tag: "UserLoaded",
      data: {
        email: user.uid
      }
    });
  }

  function userSignOut() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        app.ports.infoForElm.send({
          tag: "UserSignedOut",
          data: true
        });
      });
  }

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
})();
