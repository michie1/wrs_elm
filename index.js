'use strict';

//require('./index.html');
var Elm = require('./src/Main');


var storedState = localStorage.getItem('wrs2');
var startingState = storedState ? JSON.parse(storedState) : null;
//var todomvc = Elm.Todo.fullscreen(startingState);



//var elm = Elm.Main.fullscreen();
var elm = Elm.Main.embed(document.getElementById('main'), startingState);

elm.ports.setStorage.subscribe(function(state) {
  localStorage.setItem('wrs2', JSON.stringify(state));
});

elm.ports.saveState.subscribe(function() {
  //elm.ports.log.send('Alert called: ' + message);
  
  var model = localStorage.getItem('wrs');
  var initial = {
    page: 'races',
    riders: [{
      id: 1,
      name: 'Michiel',
      licence: 'Elit!e'
    }],
    races: [{
      id: 1,
      name: 'race 1'
    }],
    comments: [{
      id: 1,
      raceId: 1,
      riderId: 1,
      text: 'hoI!'
    }],
    results: [{
      id: 1,
      riderId: 1,
      raceId: 1,
      result: '9001'
    }]
  };
  //if (model === null) {
    localStorage.setItem('wrs', JSON.stringify(initial));
  //}


  //elm.ports.setState.send('{"page":"' + localStorage.getItem('page') + '","bla":"foo"}');
  //console.log(localStorage.getItem('wrs'));
  elm.ports.setState.send(localStorage.getItem('wrs'));
});
