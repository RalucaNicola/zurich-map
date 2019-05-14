import WebScene = require("esri/WebScene");
import SceneView = require("esri/views/SceneView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import { SimpleRenderer } from "esri/renderers";
import { PointSymbol3D, IconSymbol3DLayer } from "esri/symbols";
import LineCallout3D = require("esri/symbols/callouts/LineCallout3D");
import Color = require("esri/Color");
import QueryTask = require("esri/tasks/QueryTask");
import Query = require("esri/tasks/support/Query");
import watchUtils = require("esri/core/watchUtils");

const map = new WebScene({
  portalItem: {
    id: "161de2184c8244999710b5e12b20bc7d"
  }
});

const pointLayer = new FeatureLayer({
  url:
    "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/Zurich_Images_gdb/FeatureServer/0",
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
  }
});

map.add(pointLayer);


const view = new SceneView({
  map: map,
  container: "view",
  alphaCompositingEnabled: true,
  ui: {
    components: []
  },
  padding: {
    right: 500
  }
});

(window as any).view = view;

let sliderIsOpen = false;

let marker = document.getElementById("marker");
let indicator = document.getElementById("indicator");

const queryTask = new QueryTask({
  url:
    "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/Zurich_Images_gdb/FeatureServer/1"
});

view.on("click", event => {
  view.hitTest(event).then(response => {
    const result = response.results[0];
    if (
      result.graphic &&
      result.graphic.layer.title === "Zurich Images gdb - ZurichPictures"
    ) {
      hideMarkers();
      const graphic = result.graphic;
      const id = graphic.attributes.id;

      const matchTableQuery = new Query({
        where: "feature_id = " + id.toString(),
        outFields: ["*"]
      });

      queryTask
        .execute(matchTableQuery)
        .then(response => {
          view.goTo(graphic)
            .then(_ => {
              const screenPoint = view.toScreen(result.mapPoint);
              addMarker(screenPoint);
              openSlider(response.features, function() {
                const swiperWidth = swiper.el.clientWidth + 23;
                addIndicator(screenPoint, swiperWidth);
              });

              watchUtils.whenTrueOnce(view, "interacting", _ => {
                closeSlider();
                hideMarkers();
              });
            });
        })
        .catch(console.error);
    }
  });
});

function addMarker(screenPoint: any) {
  marker.style.display = "inherit";
  const top = screenPoint.y - 32;
  const left = screenPoint.x - 32;
  marker.style.top = top.toString() + "px";
  marker.style.left = left.toString() + "px";
}

function addIndicator(screenPoint: any, swiperWidth: number) {
  const left = screenPoint.x + 32;
  const top = screenPoint.y;
  indicator.style.display = "inherit";
  indicator.style.top = top.toString() + "px";
  indicator.style.left = left.toString() + "px";
  const width = window.innerWidth - swiperWidth - left;
  indicator.style.width = width.toString() + "px";
}

// @ts-ignore
function openSlider(images, callback) {
  sliderIsOpen = true;
  swiper.removeAllSlides();
  swiper.el.style.display = "inherit";

  // @ts-ignore
  const slides = images.map(image => {
    return `<div class="swiper-slide"><img src="${image.attributes.url}">
        <div class="subtitle">${image.attributes.title} - ${image.attributes.year}</div></div>`;
  });
  swiper.appendSlide(slides);
  swiper.slideTo(0);
  window.setTimeout(callback, 500);
}

function closeSlider() {
  sliderIsOpen = false;
  swiper.removeAllSlides();
  swiper.el.style.display = "none";
}

function hideMarkers() {
  marker.style.display = "none";
  indicator.style.display = "none";
}

const menuElement = document.getElementsByClassName("menu")[0] as HTMLElement;
const introElement = document.getElementsByClassName("intro")[0] as HTMLElement;
const titleElement = document.getElementById("title") as HTMLElement;

const exploreBtn = document.getElementById("explore-btn");

function switchToMap() {
  menuElement.style.width = "0";

  introElement.style.opacity = "0";
  introElement.style.display = "none";

  titleElement.style.display = "inherit";
  window.setTimeout(() => {
    titleElement.style.opacity = "1";
  });
}

function switchToIntro() {

  if (sliderIsOpen) {
    closeSlider();
    hideMarkers();
  }
  menuElement.style.width = "100%";

  titleElement.style.display = "none";
  titleElement.style.opacity = "0";

  introElement.style.display = "inherit";
  window.setTimeout(() => {
    introElement.style.opacity = "1";
  });
}

titleElement.addEventListener("click", switchToIntro);
exploreBtn.addEventListener("click", switchToMap);

// @ts-ignore
const swiper = new Swiper(".swiper-container", {
  centeredSlides: true,
  spaceBetween: 50,
  nested: true,
  direction: "vertical",
  slidesPerView: 2,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  mousewheel: true,
  observer: true,
  observeSlideChildren: true
});
