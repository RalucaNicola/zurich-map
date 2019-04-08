import Map = require("esri/Map");
import SceneView = require("esri/views/SceneView");

const map = new Map({
  basemap: "hybrid"
});

new SceneView({
  map: map,
  container: "viewDiv"
});
