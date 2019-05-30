define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var menuElement = document.getElementsByClassName("menu")[0];
    var introElement = document.getElementsByClassName("intro")[0];
    var titleElement = document.getElementById("title");
    var exploreBtn = document.getElementById("explore-btn");
    var marker = document.getElementById("marker");
    var callout = document.getElementById("callout");
    var swiper = null;
    function initializeUI(state) {
        titleElement.addEventListener("click", function (_) {
            switchToIntro(state);
        });
        exploreBtn.addEventListener("click", switchToMap);
        initializeSwiper(state.smallViewport);
        state.watch("cleanUp", function (value) {
            if (value) {
                removeMarker();
                if (state.smallViewport) {
                    removeCalloutSmallViewport();
                }
                else {
                    removeCallout();
                }
                swiper.removeAllSlides();
                state.imagesChanged = false;
                state.cleanUp = false;
            }
        });
        state.watch("sliderIsOpen", function (value) {
            if (value) {
                swiper.el.style.display = "inherit";
            }
            else {
                swiper.el.style.display = "none";
            }
        });
        state.watch("currentPoi", function (value) {
            if (value) {
                addMarker(value);
                if (state.smallViewport) {
                    addCalloutSmallViewport(value);
                }
                else {
                    addCallout(value);
                }
            }
        });
        state.watch("imagesChanged", function (value) {
            if (value) {
                addImages(state.images);
            }
        });
    }
    function addImages(images) {
        var slides = images.map(function (image) {
            return "<div class=\"swiper-slide\"><img src=\"" + image.attributes.url + "\">\n        <div class=\"title\">" + image.attributes.title + " - " + image.attributes.year + " (<a href=\"" + image.attributes.source + "\">Source</a>)</div>\n        </div>";
        });
        swiper.appendSlide(slides);
        swiper.slideTo(0);
    }
    function addMarker(screenPoint) {
        marker.style.display = "inherit";
        var top = screenPoint.y - 22;
        var left = screenPoint.x - 22;
        marker.style.top = top.toString() + "px";
        marker.style.left = left.toString() + "px";
    }
    function removeMarker() {
        marker.style.display = "none";
    }
    function addCallout(screenPoint) {
        callout.style.visibility = "visible";
        callout.classList.add("width-transition");
        var left = screenPoint.x + 22;
        var top = screenPoint.y;
        callout.style.top = top.toString() + "px";
        callout.style.left = left.toString() + "px";
        var width = window.innerWidth - left - 23;
        callout.style.width = width.toString() + "px";
    }
    function removeCallout() {
        callout.style.visibility = "hidden";
        callout.classList.remove("width-transition");
        callout.style.width = "0";
    }
    function addCalloutSmallViewport(screenPoint) {
        callout.style.visibility = "visible";
        callout.classList.add("height-transition");
        var left = screenPoint.x;
        var top = screenPoint.y + 22;
        callout.style.top = top.toString() + "px";
        callout.style.left = left.toString() + "px";
        var height = window.innerHeight - 300 - top;
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
    function switchToIntro(state) {
        menuElement.style.width = "100%";
        titleElement.style.opacity = "0";
        if (state.sliderIsOpen) {
            state.cleanUp = true;
            state.sliderIsOpen = false;
        }
        window.setTimeout(function () {
            introElement.style.display = "flex";
            introElement.style.opacity = "1";
        }, 2000);
    }
    function initializeSwiper(smallViewport) {
        var options = {
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
    exports.default = initializeUI;
});
