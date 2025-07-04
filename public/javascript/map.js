// public/javascript/map.js

mapboxgl.accessToken = mapToken;

if (listing.geometry && listing.geometry.coordinates) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    zoom: 10
  });

  new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`)
    )
    .addTo(map);
}
