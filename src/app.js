/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');


var splash = new UI.Window();
//TODO:
//logo
//text loading
//developer
//version

splash.show();

var locationOptions = {
    enableHighAccuracy: true, 
    maximumAge: 10000, 
    timeout: 10000
};

function locationSuccess(pos) {
    var card = new UI.Card({
        title: 'Current Location',
        subtitle: 'lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude
    });
    card.show();
    splash.hide();
    
    //card.on('select', function(e) {
        var origin = pos.coords.latitude + ',' + pos.coords.longitude;
        var destination = pos.coords.latitude + 0.001 + ',' + pos.coords.longitude;
    
        ajax(
            {
                url: 'https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&mode=walking',
                type: 'json',
            },
            function(data) {
                var directions = [];
                for(var i = 0; i < data.routes[0].legs[0].steps.length; i++) {
                    directions.push({title: '', subtitle: data.routes[0].legs[0].steps[i].html_instructions});
                }
                
               var errCard = new UI.Card({
                    body: JSON.stringify(data),//directions[0].title,
                    scrollable: true
               });
                //errCard.show();
                var directionsMenu = new UI.Menu({
                    sections: [{
                        title: 'Directions',
                        items: directions 
                    }]
                });
                directionsMenu.show();
            },
            function(error) {
                var errCard = new UI.Card({
                    body: JSON.stringify(error),
                    scrollable: true
                });
                errCard.show();
                card.hide();
            }
        );
   // });
}

function locationError(err) {
    console.log('location error (' + err.code + '): ' + err.message);
}

// Make an asynchronous request
navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);