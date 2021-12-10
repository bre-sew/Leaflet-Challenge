// create map object
var myMap = L.map("map", {
    center: [38.260, -113.955],
    zoom: 5
});

// add the tile layer
baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 10,
})
baseLayer.addTo(myMap);


function getRadius(magnitude) {
    if (magnitude > 7) {
        return 5;
    }
    else if (magnitude > 6) {
        return 4;
    }
    else if (magnitude > 5) {
        return 3;
    }
    else if (magnitude > 4) {
        return 2;
    }
    else {
        return 1;
    }
}


function getColor(depth) {
    if (depth > 400) {
        return "#ea822c";
    }
    else if (depth > 300) {
        return "#ee9c00";
    }
    else if (depth > 200) {
        return "#eecc00";
    }
    else if (depth > 100) {
        return "#d4ee00";
    }
    else {
        return "#98ee00";
    }
}


// load the GeoJSON data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"


//get the data with d3
d3.json(geoData).then(function (quakes) {

    console.log(quakes);

    var quakeLayer = new L.LayerGroup()
    
    quakes.features.forEach(quake => {
        quakeMarker = L.circle(
            [quake.geometry.coordinates[1],quake.geometry.coordinates[0]], {
            fillColor: getColor(quake.geometry.coordinates[2]),
            color: getColor(quake.geometry.coordinates[2]),
            fillOpacity: .5,
            opacity: 1,
            radius: getRadius(quake.properties.mag)*10000
            // radius: 1000
        })

        quakeMarker.addTo(quakeLayer)
    });
    

    var overlays = {
        "Earthquakes": quakeLayer
    }

    L
        .control
        .layers({"OpenStreetMap": baseLayer}, overlays, {
            collapsed: false
        })
        .addTo(myMap)
        
    quakeLayer.addTo(myMap)

});


    
    
L.geoJson(data, {
    pointToLayer: function(feature, coordinates) {
        return L.circleMarker(coordinates)
    },
    style: style,
    onEachFeature: function(feature, layer) {
        layer.bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag);
    }
}).addTo(myMap);


var legend = L.control({
    position: "bottomright"
})


legend.onAdd = function(){
    var div = L.DomUtil.create('div','info legend');
    const magnitudes = [3,4,5,6,7]
    const colors = [
        "#ea822c",
        "#ee9c00",
        "#eecc00",
        "#d4ee00",
        "#98ee00"
    ]

    for(var i = 0; i < magnitudes.length; i++){
        console.log(colors[i])
        div.innerHTML += `<i style='background:${colors[i]}'></i>` + magnitudes[i] + (magnitudes[i+1] ? "&ndash;" + magnitudes[i + 1] + "<br>": "+")
    }

    return div;
}

legend.addTo(map)