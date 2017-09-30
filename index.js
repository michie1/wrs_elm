'use strict';

const password = 'nHxQh6tM4CVX';

function setup(firebase, app) {
  var database = firebase.database();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('user', user);
      app.ports.setEmail.send(user.email);
      /*
      firebase.database().ref('/riders/').once('value').then(function(snapshot) {
        console.log('snapshot', snapshot.val());
      });
      */
    } else {
      console.log('no user signed in');
      // No user is signed in.
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

app.ports.accountLogin.subscribe(function(email) {
  console.log('email', email);
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    console.log('error', error);
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
  //app.ports.suggestions.send(suggestions);
});
