'use strict';

function setup(firebase, app) {
  var database = firebase.database();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('user changed to logged in');
      app.ports.login.send(user.email);
      /*
      firebase.database().ref('/riders/').once('value').then(function(snapshot) {
        console.log('snapshot', snapshot.val());
      });
      */
    } else {
      console.log('no user signed in');
    }
  });
}

var config = {
  apiKey: "AIzaSyCCzStZqMSpKAnBaSNK1MNlaleBTR9b-dA",
  authDomain: "cycling-results.firebaseapp.com",
  databaseURL: "https://cycling-results.firebaseio.com",
  projectId: "cycling-results",
  storageBucket: "cycling-results.appspot.com",
  messagingSenderId: "939143658590"
};
firebase.initializeApp(config);

var Elm = require('./src/Main');
var app = Elm.Main.embed(document.getElementById('main'), { });

setup(firebase, app);

app.ports.getLocalStorage.subscribe(function (key) {
  return localStorage.getItem(key);
});

app.ports.setLocalStorage.subscribe(function (tuple) {
  return localStorage.setItem(tuple[0], tuple[1]);
});

app.ports.loadRiders.subscribe(function() {
  firebase.database().ref('/riders/').orderByChild('id').once('value').then(function(snapshot) {
    const arr = [];
    snapshot.val().forEach(function (value) {
      arr.push(value);
    });
    app.ports.setRiders.send(arr);
  });
});

app.ports.loadRaces.subscribe(function() {
  firebase.database().ref('/races/').on('value', function(snapshot) {
    const val = snapshot.val();
    const arr = Object.keys(val).
      map(function (key) {
        return Object.assign({
            key: key
          }, val[key]);
      });
    app.ports.setRaces.send(arr);
  });
});

app.ports.loadResults.subscribe(function() {
  firebase.database().ref('/results/').once('value').then(function(snapshot) {
    const arr = [];
    snapshot.val().forEach(function (value) {
      arr.push(value);
    });

    app.ports.setResults.send(arr);
  });
});

app.ports.addRace.subscribe(function(race) {
  const pushedRace = firebase.database().ref('/races/').push();
  pushedRace.set(race)
    .then(function () {
      app.ports.raceAdded.send({
        key: pushedRace.key
      });
    });
});
