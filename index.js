'use strict';

var Elm = require('./src/Main');
Elm.Main.embed(document.getElementById('main'), {
	//wsUrl: "ws://phx.fastfox.nl/socket/websocket"
	wsUrl: "ws://localhost:4000/socket/websocket"
});

