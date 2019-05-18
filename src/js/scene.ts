import WebScene = require("esri/WebScene");
import SceneView = require("esri/views/SceneView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import { SimpleRenderer } from "esri/renderers";
import { PointSymbol3D, IconSymbol3DLayer, TextSymbol3DLayer, LabelSymbol3D } from "esri/symbols";
import LineCallout3D = require("esri/symbols/callouts/LineCallout3D");
import Color = require("esri/Color");
import QueryTask = require("esri/tasks/QueryTask");
import Query = require("esri/tasks/support/Query");
import watchUtils = require("esri/core/watchUtils");
import { State, Image } from "./types";
import LabelClass = require("esri/layers/support/LabelClass");

function initializeScene(state: State) {
  const map = new WebScene({
    portalItem: {
      id: "161de2184c8244999710b5e12b20bc7d"
    }
  });

  const poiLayer = new FeatureLayer({
    url:
      "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/zurichPointsOfInterest/FeatureServer/0",
    renderer: new SimpleRenderer({
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            size: 20,
            resource: {
              href: "./src/assets/camera-retro-solid.svg"
            }
          })
        ],
        verticalOffset: {
          screenLength: 30,
          maxWorldLength: 100
        },
        callout: new LineCallout3D({
          size: 1,
          color: [50, 50, 50],
          border: {
            color: new Color([255, 255, 255, 1])
          }
        })
      })
    }),
    outFields: ["id"],
    elevationInfo: {
      mode: "relative-to-scene"
    },
    featureReduction: {
      type: "selection"
    },
    labelingInfo: [
      new LabelClass({
        labelExpressionInfo: { expression: "$feature.title"},
        symbol: new LabelSymbol3D({
          symbolLayers: [new TextSymbol3DLayer ({
          material: {
            color: "white"
          },
          halo: {
            size: 1,
            color: "black"
          },
          font: {
            size: 13,
            family: "Merriweather",
            weight: "bold"
          }
        })]
      }),
      where: "label = 1"
    })
    ]
  });

  map.add(poiLayer);

  const view = new SceneView({
    map: map,
    container: "view",
    alphaCompositingEnabled: true,
    ui: {
      components: []
    },
    constraints: {
      altitude: {
        max: 4000,
        min: 300
      }
    },
    padding: {
      right: 500
    }
  });

  (window as any).view = view;

  const queryTask = new QueryTask({
    url:
      "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/Zurich_Images_gdb/FeatureServer/1"
  });

  function compareYear(feature1: Image, feature2: Image) {
    const year1 = Number(feature1.attributes.year) || 0;
    const year2 = Number(feature2.attributes.year) || 0;
    return year1 - year2;
  }

  view.on("click", event => {
    view.hitTest(event, { include: [poiLayer] }).then(response => {
      const result = response.results[0];
      if (result && result.graphic) {
        const graphic = result.graphic;
        const id = graphic.attributes.id;
        if (state.sliderIsOpen) {
          state.cleanUp = true;
        }
        else {
          state.sliderIsOpen = true;
        }
        view.goTo(graphic)
          .then(function(){
            state.currentPoi = view.toScreen(result.mapPoint);
          });

        const matchTableQuery = new Query({
          where: "feature_id = " + id.toString(),
          outFields: ["*"]
        });

        queryTask.execute(matchTableQuery)
          .then(function(queryResult) {
            const images = queryResult.features.sort(compareYear);
            state.images = images;
            state.imagesChanged = true;
            watchUtils.whenTrueOnce(view, "interacting", _ => {
              state.sliderIsOpen = false;
              state.cleanUp = true;
            });
          });
      } else {
        state.sliderIsOpen = false;
        state.cleanUp = true;
      }
    });
  });
}

export default initializeScene;
