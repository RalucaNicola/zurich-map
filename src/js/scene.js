define(["require", "exports", "esri/WebScene", "esri/views/SceneView", "esri/layers/FeatureLayer", "esri/renderers", "esri/symbols", "esri/symbols/callouts/LineCallout3D", "esri/Color", "esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/core/watchUtils", "esri/layers/support/LabelClass"], function (require, exports, WebScene, SceneView, FeatureLayer, renderers_1, symbols_1, LineCallout3D, Color, QueryTask, Query, watchUtils, LabelClass) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function initializeScene(state) {
        var map = new WebScene({
            portalItem: {
                id: "161de2184c8244999710b5e12b20bc7d"
            }
        });
        var poiLayer = new FeatureLayer({
            url: "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/zurichPointsOfInterest/FeatureServer/0",
            renderer: new renderers_1.SimpleRenderer({
                symbol: new symbols_1.PointSymbol3D({
                    symbolLayers: [
                        new symbols_1.IconSymbol3DLayer({
                            size: 20,
                            resource: {
                                href: "./src/assets/camera-retro-solid.png"
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
                    labelExpressionInfo: { expression: "$feature.title" },
                    symbol: new symbols_1.LabelSymbol3D({
                        symbolLayers: [
                            new symbols_1.TextSymbol3DLayer({
                                material: {
                                    color: "white"
                                },
                                halo: {
                                    size: 1,
                                    color: "black"
                                },
                                font: {
                                    size: 11,
                                    family: "Merriweather",
                                    weight: "bold"
                                }
                            })
                        ]
                    }),
                    where: "label = 1"
                })
            ]
        });
        map.add(poiLayer);
        var mapPadding = state.smallViewport ? { bottom: 300 } : { right: 500 };
        var view = new SceneView({
            map: map,
            container: "view",
            alphaCompositingEnabled: true,
            ui: {
                components: []
            },
            qualityProfile: "high",
            constraints: {
                altitude: {
                    max: 2000,
                    min: 500
                }
            },
            padding: mapPadding
        });
        window.view = view;
        var queryTask = new QueryTask({
            url: "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/ZurichImagesTable/FeatureServer/0"
        });
        function compareYear(feature1, feature2) {
            var year1 = Number(feature1.attributes.year) || 0;
            var year2 = Number(feature2.attributes.year) || 0;
            return year1 - year2;
        }
        view.on("click", function (event) {
            view.hitTest(event, { include: [poiLayer] }).then(function (response) {
                var result = response.results[0];
                if (result && result.graphic) {
                    var graphic = result.graphic;
                    var id = graphic.attributes.id;
                    if (state.sliderIsOpen) {
                        state.cleanUp = true;
                    }
                    else {
                        state.sliderIsOpen = true;
                    }
                    view.goTo(graphic).then(function () {
                        state.currentPoi = view.toScreen(result.mapPoint);
                    });
                    var matchTableQuery = new Query({
                        where: "feature_id = " + id.toString(),
                        outFields: ["*"]
                    });
                    queryTask.execute(matchTableQuery).then(function (queryResult) {
                        var images = queryResult.features.sort(compareYear);
                        state.images = images;
                        state.imagesChanged = true;
                        watchUtils.whenTrueOnce(view, "interacting", function (_) {
                            state.sliderIsOpen = false;
                            state.cleanUp = true;
                        });
                    });
                }
                else {
                    state.sliderIsOpen = false;
                    state.cleanUp = true;
                }
            });
        });
    }
    exports.default = initializeScene;
});
