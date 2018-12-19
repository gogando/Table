// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const interact = require('interactjs')
const L = require('leaflet')
const tracks = require('./tracks')

const map = L.map('map', {
    center:[-31.9505, 115.8605],
    zoom: 8,
    attributionControl: false,
    zoomControl: false,
    dragging: false
})

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

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