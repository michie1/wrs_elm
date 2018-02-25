'use strict';

function hasParam(name) {
  var regex = new RegExp('[\\?&]' + name );
  var results = regex.exec(location.search);
  return results !== null;
};

var url_string = window.location.href;
var url = new URL(url_string);
var token = url.searchParams.get("token");

if (token !== null) {
  window.history.replaceState(null, null, window.location.href.split('?')[0]);
}

function setup(firebase, app) {
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

const config = require('./config');
firebase.initializeApp(config);

const Elm = require('./src/Main');
const app = Elm.Main.embed(document.getElementById('main'));

setup(firebase, app);

function loadRiders() {
  firebase.database().ref('/riders/').orderByChild('id').on('value', function(snapshot) {
    const val = snapshot.val();
    const arr = val ? Object.keys(val).
      map(function (key) {
        return Object.assign({
            key: key
          }, val[key]);
      }) : [];
    app.ports.infoForElm.send({
      tag: 'RidersLoaded',
      data: arr
    });
  });
}

function loadRaces() {
  firebase.database().ref('/races/').on('value', function(snapshot) {
    const val = snapshot.val();
    const arr = val ? Object.keys(val).
      map(function (key) {
        return Object.assign({
            key: key
          }, val[key]);
      }) : [];
    app.ports.infoForElm.send({
      tag: 'RacesLoaded',
      data: arr
    });
  });
}

function loadResults() {
  firebase.database().ref('/results/').on('value', function(snapshot) {
    const val = snapshot.val();
    const arr = val ? Object.keys(val).
      map(function (key) {
        return Object.assign({
            key: key
          }, val[key]);
      }) : [];
    app.ports.infoForElm.send({
      tag: 'ResultsLoaded',
      data: arr
    });
  });
}

function addRace(race) {
  const pushedRace = firebase.database().ref('/races/').push();
  pushedRace.set(race)
    .then(function () {
      app.ports.infoForElm.send({
        tag: 'RaceAdded',
        data: pushedRace.key
      });
    });
}

function addRider(rider) {
  const pushedRider = firebase.database().ref('/riders/').push();
  pushedRider.set(rider)
    .then(function () {
      app.ports.infoForElm.send({
        tag: 'RiderAdded',
        data: pushedRider.key
      });
    });
}

function addResult(result) {
  const pushedResult = firebase.database().ref('/results/').push();
  pushedResult.set(result)
    .then(function () {
      app.ports.infoForElm.send({
        tag: 'ResultAdded',
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

function userSignedIn(user) {
  app.ports.infoForElm.send({
    tag: 'UserLoaded',
    data: {
      email: user.uid
    }
  });
}

app.ports.infoForOutside.subscribe(function (msg) {
  if (msg.tag === 'RiderAdd') {
    addRider(msg.data);
  } else if (msg.tag === 'RaceAdd') {
    addRace(msg.data);
  } else if (msg.tag === 'ResultAdd') {
    addResult(msg.data);
  } else {
    console.log('msg', msg);
  }
});
