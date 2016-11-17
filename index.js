'use strict';

//require('./index.html');
var Elm = require('./src/Main');


var storedState = localStorage.getItem('wrs');
//var startingState = storedState ? JSON.parse(storedState) : null;
var startingState = null;

var elm = Elm.Main.embed(document.getElementById('main'));//, startingState);

$.elm = elm;

/*
elm.ports.setStorage.subscribe(function(state) {
  localStorage.setItem('wrs', state ? JSON.stringify(state) : null);
});

elm.ports.resetState.subscribe(function () {
  localStorage.setItem('wrs', null);
});
*/

elm.ports.updateMaterialize.subscribe(function () {
  setTimeout(function () {
      console.log('updateMaterialize');
      Materialize.updateTextFields();
    }, 
    100 // fixes prefilled form data of MaterialzeCSS issue, with overlapping text
  );
});

elm.ports.autocomplete.subscribe(function (riders) {
  setTimeout(function () {
    console.log('autcomplete is called', riders);
    var ridersObj = riders.reduce(function(result, rider) { 
      result[rider] = null;
      return result 
    }, {});

    var autocomplete = $('input.autocomplete').autocomplete({
      data: ridersObj
    });
  }, 100);
});

elm.ports.saveState.subscribe(function() {
  //elm.ports.log.send('Alert called: ' + message);

  /*
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
  */
});

//$('.datepicker').pickadate({
   //selectMonths: true, // Creates a dropdown to control month
   //selectYears: 1 // Creates a dropdown of 15 years to control year
//});
