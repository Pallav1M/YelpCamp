mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    // center: [-74.5, 40], // starting position [lng, lat]
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});

// Add zoom and rotation controls to the map (https://docs.mapbox.com/mapbox-gl-js/example/navigation/)
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

// https://docs.mapbox.com/mapbox-gl-js/api/markers/
new mapboxgl.Marker()
    // .setLngLat([-74.5, 40])
    .setLngLat(campgrounds.geometry.coordinates)
    // https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML
            (
                `<h6>${campgrounds.title}</h6><p>${campgrounds.location}<p>`
            )
    )
    .addTo(map);