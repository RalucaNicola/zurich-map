import Accessor = require("esri/core/Accessor");
import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import {ScreenPoint, Images} from "./types";

@subclass()
export default class State extends declared(Accessor) {

  @property()
  sliderIsOpen: boolean = false;

  @property({ readOnly: true })
  smallViewport: boolean = this.hasSmallViewport();

  @property()
  currentPoi: ScreenPoint = null;

  @property()
  images: Images = null;

  @property()
  imagesChanged: boolean = false;

  @property()
  cleanUp: boolean = null;

  private hasSmallViewport() {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    if (mediaQuery.matches) {
      return true;
    }
    else {
      return false;
    }
  }
}
