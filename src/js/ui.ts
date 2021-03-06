import { State, ScreenPoint, Images } from "./types";

const menuElement = document.getElementsByClassName("menu")[0] as HTMLElement;
const introElement = document.getElementsByClassName("intro")[0] as HTMLElement;
const titleElement = document.getElementById("title") as HTMLElement;
const exploreBtn = document.getElementById("explore-btn");
const marker = document.getElementById("marker");
const callout = document.getElementById("callout");

let swiper: any = null;

function initializeUI(state: State) {
  titleElement.addEventListener("click", _ => {
    switchToIntro(state);
  });
  exploreBtn.addEventListener("click", switchToMap);

  initializeSwiper(state.smallViewport);

  state.watch("cleanUp", value => {
    if (value) {
      removeMarker();
      if (state.smallViewport) {
        removeCalloutSmallViewport();
      } else {
        removeCallout();
      }
      swiper.removeAllSlides();
      state.imagesChanged = false;
      state.cleanUp = false;
    }
  });

  state.watch("sliderIsOpen", value => {
    if (value) {
      swiper.el.style.display = "inherit";
    } else {
      swiper.el.style.display = "none";
    }
  });

  state.watch("currentPoi", value => {
    if (value) {
      addMarker(value);
      if (state.smallViewport) {
        addCalloutSmallViewport(value);
      } else {
        addCallout(value);
      }
    }
  });

  state.watch("imagesChanged", value => {
    if (value) {
      addImages(state.images);
    }
  });
}

function addImages(images: Images) {
  const slides = images.map(image => {
    return `<div class="swiper-slide"><img src="${image.attributes.url}">
        <div class="title">${image.attributes.title} (${image.attributes.year}) - <a href="${image.attributes.source}" target="_blank">Source</a></div>
        </div>`;
  });
  swiper.appendSlide(slides);
  swiper.slideTo(0);
}

function addMarker(screenPoint: ScreenPoint) {
  marker.style.display = "inherit";
  const top = screenPoint.y - 22;
  const left = screenPoint.x - 22;
  marker.style.top = top.toString() + "px";
  marker.style.left = left.toString() + "px";
}

function removeMarker() {
  marker.style.display = "none";
}

function addCallout(screenPoint: ScreenPoint) {
  callout.style.visibility = "visible";
  callout.classList.add("width-transition");
  const left = screenPoint.x + 22;
  const top = screenPoint.y;
  callout.style.top = top.toString() + "px";
  callout.style.left = left.toString() + "px";
  const width = window.innerWidth - left - 23;
  callout.style.width = width.toString() + "px";
}

function removeCallout() {
  callout.style.visibility = "hidden";
  callout.classList.remove("width-transition");
  callout.style.width = "0";
}

function addCalloutSmallViewport(screenPoint: ScreenPoint) {
  callout.style.visibility = "visible";
  callout.classList.add("height-transition");
  const left = screenPoint.x;
  const top = screenPoint.y + 22;
  callout.style.top = top.toString() + "px";
  callout.style.left = left.toString() + "px";
  const height = window.innerHeight - 300 - top;
  callout.style.height = height.toString() + "px";
}

function removeCalloutSmallViewport() {
  callout.style.visibility = "hidden";
  callout.classList.remove("height-transition");
  callout.style.height = "0";
}

function switchToMap() {
  menuElement.style.width = "0";

  introElement.style.opacity = "0";
  introElement.style.display = "none";

  titleElement.style.opacity = "1";
}

function switchToIntro(state: State) {
  menuElement.style.width = "100%";
  titleElement.style.opacity = "0";
  if (state.sliderIsOpen) {
    state.cleanUp = true;
    state.sliderIsOpen = false;
  }

  window.setTimeout(() => {
    introElement.style.display = "flex";
    introElement.style.opacity = "1";
  }, 2000);
}

function initializeSwiper(smallViewport: boolean) {
  const options = {
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
    keyboard: true
  };

  if (smallViewport) {
    options.slidesPerView = 1;
    options.direction = "horizontal";
  }
  //@ts-ignore
  swiper = new Swiper(".swiper-container", options);
}

export default initializeUI;
