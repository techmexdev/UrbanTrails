/* eslint-disable no-undef */
/* eslint-disable max-len */
import accuratePosition from './accuratePosition'

let firstRun = true
let radius = null
let latln = null

export function setView(context, mymap) {
  if (firstRun || context.$store.state.viewLocked) {
    // pans/zooms to current location
    mymap.setView(latln, 18)
    // because set view toggles viewLocked to false
    context.$store.commit('TOGGLE_VIEW_LOCKED', true)
    firstRun = false
  }
}

export function locate(context, mymap, position, area) {
  function onLocationFound(e) {
    radius = e.accuracy / 2
    latln = { lat: e.latitude, lng: e.longitude }

    // sets marker/circle at current location
    mymap.removeLayer(position)
    mymap.removeLayer(area)
    position = L.marker([latln.lat, latln.lng])
      .bindPopup(`You are within ${radius} meters from this point`).addTo(mymap)
    area = L.circle(latln, radius).addTo(mymap)
    // pans/zooms to current location
    setView(context, mymap)
  }
  mymap.on('locationFound', onLocationFound)

  // updates location based on navigator
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      onLocationFound(position.coords)
    })
  }
  accuratePosition.findAccuratePosition.bind(this, { maxWait: 15000, desiredAccuracy: 10, enableHighAccuracy: true })
}
