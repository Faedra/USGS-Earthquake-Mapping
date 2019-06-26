// QUERY URL WITH EARTHQUAKE DATA
// Start with a queryUrl from API and save as a variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -110.71],
  zoom: 4,
  // set default base and overlay layers
  // layers: [grayscale, earthquakes]
});

// define base layers:
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
}).addTo(myMap);

var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
}).addTo(myMap);

// use d3.json and L.geoJSON to pull in the data
d3.json(queryUrl, function (data) {

  // define a function to style our markers:
  function markerStyle(feature) {
    return {
      fillColor: markerColor(feature.properties.mag),
      radius: markerRadius(feature.properties.mag),
      stroke: true,
      weight: 0.1
    };

  // define a function to add colors based on magnitude
  function markerColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "blue";
      case magnitude > 4:
        return "green";
      case magnitude > 3:
        return "yellow";
      case magnitude > 2:
        return "orange";
      case magnitude > 1:
        return "red";
      default:
        return "light blue";
    }
  };

  // define a function to change radius size based on magnitude: 
  function markerRadius(magnitude) {
    return magnitude * 5;
  });
    
  L.geoJSON(data.features, {
      style: markerStyle,
      // ad pointToLayer to convert markers to circles:
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      // use onEachFeature function with standard geoJSON feature/layer arguments:
      onEachFeature: function (feature, layer) {
        // select a property from the json we want to display as popup; 
        // here we choose property "place" which is written "feature.properties.place"
        // and then wrapped in layer.bindPopup to make it the popup
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3>
        <p>Location: ${feature.properties.place}</p>`);
      },
    }).addTo(myMap);

// define our variable to hold our base layers
// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Satellite": satellite,
  "Grayscale": grayscale,
  "Outdoors": outdoors
};

// // define our variable to hold our overlay layers (the overlay layer we've built is our geojson layer)
// var overlayMaps = {
//   "Earthquakes": earthquakes
// };

// create a layer control containing our base and overlay:
L.control.layers(baseMaps, overlayMaps)
  .addTo(myMap);

var mapLegend = L.control({
  position: "bottomright"
});

// use L.DomUtil to create the legend
mapLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "map legend");
  var magnitudes = [0, 1, 2, 3, 4, 5];
  var colors = [
    "light blue",
    "red",
    "orange",
    "yellow",
    "green",
    "blue"
  ];
  // loop through and update inner html with colors
  for (var i = 0; i < magnitudes.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> "
  }
  return div;
};
mapLegend.addTo(myMap);