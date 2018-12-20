// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const interact = require('interactjs')
const L = require('leaflet')
const fs = require('fs')

const map = L.map('map', {
    center:[-31.9505, 115.8605],
    zoom: 8,
    attributionControl: false,
    zoomControl: false,
    dragging: false
})

//L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
//L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png').addTo(map)
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png').addTo(map)

// Contacts
L.TrackMarker = L.Marker.extend({

    options: {
        rotation: 0
    },

    _setPos: function(pos) {
        L.Marker.prototype._setPos.call(this, pos);
        if(L.DomUtil.TRANSFORM) {
            this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
        }
    }

});

fs.readFile('aishub-oz.json', 'utf8', (err, fileContents) => {
  if (err) {
    console.error(err)
    return
  }
  try {
    const tracks = JSON.parse(fileContents)
    console.log(tracks)
    for (var i = tracks.length - 1; i >= 0; i--) {
        var track = tracks[i];
       
        var getColour = function(type) {
            var index = Number(String(type).charAt(0));
            return ['yellow', 'yellow', 'yellow', 'green', 'cyan', 'yellow', 'blue', 'green', 'red', 'purple'][index];
        };

        var marker = new L.TrackMarker([track.LATITUDE, track.LONGITUDE]);
        if(track.SOG > 0) {
            marker.options.icon = L.divIcon({ className: 'marker-icon ship-medium ' + getColour(track.TYPE)});
            marker.options.rotation = track.COG;
        } else {
            marker.options.icon = L.divIcon({ className: 'marker-icon ship-medium ' + getColour(track.TYPE) + ' stationary'});
        }

           marker.addTo(map);
    }
  } catch(err) {
    console.error(err)
  }
})

// TODO: Make it possible to rotate items

interact('.draggable')
    .draggable({
        inertia: true,
        restrict: {
            restriction: 'parent',
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        autoScroll: true,
        onmove: dragMoveListener
    })

function dragMoveListener(event) {
    const target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px`
    target.setAttribute('data-x', x)
    target.setAttribute('data-y',y)
}