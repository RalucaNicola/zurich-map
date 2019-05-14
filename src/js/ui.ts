import { State, ScreenPoint } from "./types";



const menuElement = document.getElementsByClassName("menu")[0] as HTMLElement;
const introElement = document.getElementsByClassName("intro")[0] as HTMLElement;
const titleElement = document.getElementById("title") as HTMLElement;
const exploreBtn = document.getElementById("explore-btn");
const marker = document.getElementById("marker");
const callout = document.getElementById("callout");

let swiper: any = null;

function initializeUI(state: State) {
  titleElement.addEventListener("click", switchToIntro);
  exploreBtn.addEventListener("click", switchToMap);

  initializeSwiper();

  state.watch("sliderIsOpen", (value) => {
    if (!value) {
      closeSlider();
      removeMarker();
      removeCallout();
    }
  });

  state.watch("currentId", function(value) {
    if (value) {
      addMarker(state.currentPoi);
      openSlider(state);
    }
  });
}

function openSlider(state: State) {
  swiper.removeAllSlides();
  swiper.el.style.display = "inherit";
  const slides = state.images.map(image => {
    return `<div class="swiper-slide"><img src="${image.attributes.url}">
        <div class="title">${image.attributes.title} - ${image.attributes.year}</div></div>`;
  });
  swiper.appendSlide(slides);
  swiper.slideTo(0);
  window.setTimeout(function() {
    const swiperWidth = swiper.el.clientWidth + 23;
    addCallout(state.currentPoi, swiperWidth);
  }, 500);
}

function closeSlider() {
  swiper.removeAllSlides();
  swiper.el.style.display = "none";
};

function addMarker(screenPoint: ScreenPoint) {
  marker.style.display = "inherit";
  const top = screenPoint.y - 32;
  const left = screenPoint.x - 32;
  marker.style.top = top.toString() + "px";
  marker.style.left = left.toString() + "px";
}

function removeMarker() {
  marker.style.display = "none";
};

function addCallout(screenPoint: ScreenPoint, swiperWidth: number) {
  const left = screenPoint.x + 32;
  const top = screenPoint.y;
  callout.style.display = "inherit";
  callout.style.top = top.toString() + "px";
  callout.style.left = left.toString() + "px";
  const width = window.innerWidth - swiperWidth - left;
  callout.style.width = width.toString() + "px";
}

function removeCallout() {
  callout.style.display = "none";
}

function switchToMap() {
  menuElement.style.width = "0";

  introElement.style.opacity = "0";
  introElement.style.display = "none";

  titleElement.style.opacity = "1";
}

function switchToIntro() {
  menuElement.style.width = "100%";
  titleElement.style.opacity = "0";

  window.setTimeout(() => {
    introElement.style.display = "inherit";
    introElement.style.opacity = "1";
  }, 2000);
}

function initializeSwiper() {
  //@ts-ignore
  swiper = new Swiper(".swiper-container", {
    centeredSlides: true,
    spaceBetween: 50,
    nested: true,
    direction: "vertical",
    slidesPerView: 2,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    mousewheel: true
  });
}

export default initializeUI;
