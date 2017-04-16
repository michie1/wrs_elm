'use strict';

var Elm = require('./src/Main');
var app = Elm.Main.embed(document.getElementById('main'), {
	//wsUrl: "ws://phx.fastfox.nl/socket/websocket"
	wsUrl: "ws://localhost:4000/socket/websocket"
});

app.ports.getLocalStorage.subscribe(function (key) {
  return localStorage.getItem(key);
});

app.ports.setLocalStorage.subscribe(function (tuple) {
  return localStorage.setItem(tuple[0], tuple[1]);
});
