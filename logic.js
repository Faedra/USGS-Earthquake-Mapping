// EARTHQUAKE DATA MAPPING 

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -105.71],
  zoom: 3,
  // set default base and overlay layers
  // layers: [grayscale, earthquakes]
});

// define tile layers:
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

// use d3.json to pull in the data url
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {

  // define a function to style our markers:
  function markerStyle(feature) {
    return {
      fillColor: markerColor(feature.properties.mag),
      radius: markerRadius(feature.properties.mag),
      stroke: true,
      color: "gray",
      weight: 0.5,
      opacity: 0.7,
      fillOpacity: 0.5
  };
}

    // define a function to add colors based on magnitude
    function markerColor(magnitude) {
      switch (true) {
        case magnitude > 5:
          return "red";
        case magnitude > 4:
          return "orange";
        case magnitude > 3:
          return "yellow";
        case magnitude > 2:
          return "green";
        case magnitude > 1:
          return "blue";
        default:
          return "lightblue";
      }
    }

  // define a function to change radius size based on magnitude: 
  function markerRadius(magnitude) {
    return magnitude * 3;
  }

  // create our geoJSON layer: 
  var earthquakes = L.geoJSON(data, {
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
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><p>Location: ${feature.properties.place}</p>`);
      },
    }).addTo(myMap);

    // define our variable to hold our base layers
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellite,
      "Grayscale": grayscale,
      "Outdoors": outdoors
    };

    // define our variable to hold our overlay layers (the overlay layer we've built is our geojson layer)
    var overlayMaps = {
      "Earthquakes": earthquakes
    };

    // create a legend with layer control containing our base and overlay:
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
    var legend = L.control({position: "bottomright"});

    // use L.DomUtil to create the legend
    legend.onAdd = function () {
      
      var ourDiv = L.DomUtil.create("div", "info legend");
      var limits = [0, 1, 2, 3, 4, 5];
      var colors = [
        "lightblue",
        "blue",
        "green",
        "yellow",
        "orange",
        "red"
      ];
      var labels = [];
      var legendInfo = "<h1>Earthquake Magnitudes</h1>"
      "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[5] + "</div>" +
      "</div>";
      // loop through and update inner html with colors
      ourDiv.innerHTML = legendInfo;

      limits.forEach(function (limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      ourDiv.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return ourDiv;
    };

    legend.addTo(myMap);
  });

//   var mapLegend = L.control({position: "bottomright"});

//   // use L.DomUtil to create the legend
//   mapLegend.onAdd = function () {
    
//     var div = L.DomUtil.create("div", "info legend");
//     var magnitudes = [0, 1, 2, 3, 4, 5];
//     var colors = [
//       "lightblue",
//       "blue",
//       "green",
//       "yellow",
//       "orange",
//       "red"
//     ];
//     var legendInfo = "<h1>Earthquake Magnitudes</h1>"
//     // loop through and update inner html with colors
//     for (var i = 0; i < magnitudes.length; i++) {
//       div.innerHTML +=
//         "<i style='background: " + colors[i] + "'></i>"
//     }
//     return div;
//   };
//   mapLegend.addTo(myMap);
// });
