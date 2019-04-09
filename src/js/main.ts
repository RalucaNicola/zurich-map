import WebScene = require("esri/WebScene");
import SceneView = require("esri/views/SceneView");

const map = new WebScene({
  portalItem: {
    id: "161de2184c8244999710b5e12b20bc7d"
  }
});

new SceneView({
  map: map,
  container: "view",
  alphaCompositingEnabled: true,
  ui: {
    components: []
  }
});

