const stadiums = L.layerGroup();

var stadiumsIcon = L.icon({
  iconUrl: "./images/stadium.png",
  iconSize: [40, 40], // Adjust the size of the icon according to your PNG image
  iconAnchor: [20, 40], // Adjust the anchor point if needed
});

var parksIcon = L.icon({
  iconUrl: "./images/park.png",
  iconSize: [40, 40], // Adjust the size of the icon according to your PNG image
  iconAnchor: [20, 40], // Adjust the anchor point if needed
});

var redIcon = L.icon({
  iconUrl: "./images/red_marker.png",
  iconSize: [40, 40], // Adjust the size of the icon according to your PNG image
  iconAnchor: [20, 40], // Adjust the anchor point if needed
});

const mLittleton = L.marker([41.4007650636, -8.52251802052], {
  icon: stadiumsIcon,
})
  .bindPopup("Estádio Municipal 22 de Junho")
  .addTo(stadiums);

const mbAttr =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const mbUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

const map = L.map("map", {
  center: [41.40797, -8.51978],
  zoom: 14,
  layers: [osm, stadiums],
});

const baseLayers = {
  OpenStreetMap: osm,
};

const overlays = {
  Estadios: stadiums,
};

const layerControl = L.control.layers(baseLayers, overlays).addTo(map);
const devesa = L.marker([41.410202, -8.507951], {
  icon: parksIcon,
}).bindPopup("Parque da Devesa");
const sincaes = L.marker([41.41249, -8.5169], {
  icon: parksIcon,
}).bindPopup("Parque de Sinçães");

const parks = L.layerGroup([devesa, sincaes]);

layerControl.addOverlay(parks, "Parques");

// a layer group, used here like a container for markers
var markersGroup = L.layerGroup();
map.addLayer(markersGroup);

function markerClick() {
  // Remove the existing click event listener
  map.off("click");
  map.on("click", function (e) {
    // get the count of currently displayed markers
    var markersCount = markersGroup.getLayers().length;
    var x = document.getElementById("saveButton");
    if (x.style.display == "block") {
      if (objectColorMarker == 1)
        var marker = L.marker(e.latlng)
          .addTo(lastLayer)
          .bindPopup(lastLayerName);

      if (objectColorMarker == 2)
        var marker = L.marker(e.latlng, {
          icon: redIcon,
        })
          .addTo(lastLayer)
          .bindPopup(lastLayerName);
    }
  });
}
// Initialize the array to store polygon coordinates
var polygonCoords = [];

function areaClick() {
  // Remove the existing click event listener
  map.off("click");
  map.on("click", function (e) {
    // Retrieve the clicked latlng value
    var latlng = e.latlng;

    // Push the latlng value into the polygonCoords array
    polygonCoords.push(latlng);

    var x = document.getElementById("saveButton");
    if (x.style.display == "block")
      var polygon = L.polyline(polygonCoords, {
        color: objectColor,
        // fillOpacity: 1,
      }).addTo(lastLayer);
  });
}

// Initialize the array to store polygon coordinates
var pathCoords = [];

function pathClick() {
  // Remove the existing click event listener
  map.off("click");
  map.on("click", function (e) {
    // Retrieve the clicked latlng value
    var latlng = e.latlng;

    // Push the latlng value into the polygonCoords array
    pathCoords.push(latlng);

    var x = document.getElementById("saveButton");
    if (x.style.display == "block")
      var path = L.polyline(pathCoords, { color: objectColor })
        .addTo(lastLayer)
        .bindPopup(lastLayerName);
  });
}

//Newlayers
const layers = [];

//Add Default Layers to the array
layers.push({
  name: "Estádios",
  layer: stadiums,
});
layers.push({
  name: "Parques",
  layer: parks,
});

// Variable to store the last layer created
let lastLayer;

//Last Layer name
let lastLayerName = "";

//Color variable
let objectColor = "blue";

//Marker control
let objectColorMarker = 1;

// Get a reference to the form element
const form = document.getElementById("addLayer");

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  // Get the values from the form inputs
  const addLayerName = document.getElementById("addLayerName").value;
  const addLayerType = document.getElementById("addLayerType").value;
  const addLayerColor = document.getElementById("addLayerColor").value;
  const addLayerMarker = document.getElementById("addLayerMarkerDef").value;
  // Create a new layer
  const newLayer = L.layerGroup();

  // Store the layer group in the layers array
  layers.push({
    name: addLayerName,
    layer: newLayer,
  });

  lastLayerName = addLayerName;
  // Store the last layer created
  lastLayer = newLayer;

  layerControl.addOverlay(newLayer, addLayerName);
  updateSelectOptions();

  //Color
  if (addLayerColor == "Vermelho") objectColor = "red";
  if (addLayerColor == "Verde") objectColor = "green";
  if (addLayerColor == "Azul") objectColor = "blue";

  //Color
  if (addLayerMarker == "Mvermelho") objectColorMarker = 2;
  if (addLayerMarker == "Mazul") objectColorMarker = 1;

  //Empty arrays
  polygonCoords = [];
  pathCoords = [];

  //Type
  if (addLayerType == "Ponto") {
    var x = document.getElementById("saveButton");
    x.style.display = "block";
    markerClick();
  } else if (addLayerType == "Area") {
    var x = document.getElementById("saveButton");
    x.style.display = "block";
    areaClick();
  } else if (addLayerType == "Linha") {
    var x = document.getElementById("saveButton");
    x.style.display = "block";
    pathClick();
  }
  // Clear the form inputs
  form.reset();
});

function guardaCategoria() {
  var x = document.getElementById("saveButton");
  x.style.display = "none";

  //if polygon
  var polygon = L.polygon(polygonCoords, {
    color: objectColor,
    // fillOpacity: 1,
  })
    .addTo(lastLayer)
    .bindPopup(lastLayerName);
  polygonCoords = [];
}

// Get the select element
const selectLayersOptions = document.getElementById("LayersListForm");

// Loop through the data array
layers.forEach((layer) => {
  // Create a new <option> element
  const newOption = document.createElement("option");

  // Set the value and text of the option
  newOption.value = layer.name;
  newOption.text = layer.name;

  // Append the new option to the select element
  selectLayersOptions.appendChild(newOption);
});

// Function to update the options in the select element
function updateSelectOptions() {
  // Clear existing options
  selectLayersOptions.innerHTML = "";

  // Loop through the layers array
  layers.forEach((layer) => {
    // Create a new <option> element
    const newOption = document.createElement("option");

    // Set the value and text of the option
    newOption.value = layer.name;
    newOption.text = layer.name;

    // Append the new option to the select element
    selectLayersOptions.appendChild(newOption);
  });
}

// Get a reference to the form element
const deleteForm = document.getElementById("deleteLayer");

// Handle form submission
deleteForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission
  // Get the selected layer ID from the form
  let selectedLayerValue = document.getElementById("LayersListForm").value;

  //alert(selectedLayerValue);
  // Find the layer in the array based on the selectedLayerValue
  let selectedLayer = layers.find((layer) => layer.name === selectedLayerValue);

  if (selectedLayer) {
    // Remove the layer from the map
    map.removeLayer(selectedLayer.layer);

    // Remove the layer from the layer control
    layerControl.removeLayer(selectedLayer.layer);

    // Remove the layer from the layers array
    let index = layers.indexOf(selectedLayer);
    layers.splice(index, 1);

    // Update the form options
    updateSelectOptions();

    // Clear the form inputs
    deleteForm.reset();

    // Display a success message
    alert("Layer deleted successfully.");
  } else {
    // Display an error message if the layer was not found
    alert("Layer not found.");
  }
});

//Form display block and none controll
const addLayerTypeSelect = document.getElementById("addLayerType");
const addLayerColorGroup = document.getElementById("addLayerColorGroup");
const addLayerMarkerDefGroup = document.getElementById(
  "addLayerMarkerDefGroup"
);

addLayerTypeSelect.addEventListener("change", function () {
  const selectedValue = addLayerTypeSelect.value;
  if (selectedValue === "Linha" || selectedValue === "Area") {
    addLayerColorGroup.style.display = "block";
  } else {
    addLayerColorGroup.style.display = "none";
  }

  if (selectedValue === "Ponto") {
    addLayerMarkerDefGroup.style.display = "block";
  } else {
    addLayerMarkerDefGroup.style.display = "none";
  }
});
