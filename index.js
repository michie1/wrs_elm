'use strict';

//require('./index.html');
var Elm = require('./src/Main');

//var elm = Elm.Main.fullscreen();
var elm = Elm.Main.embed(document.getElementById('main'));

elm.ports.alert.subscribe(function(message) {
  console.log('alert: ', message);
  elm.ports.log.send('Alert called: ' + message);
});
