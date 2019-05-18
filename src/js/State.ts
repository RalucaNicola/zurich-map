import Accessor = require("esri/core/Accessor");
import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import {Device, ScreenPoint, Images} from "./types";

@subclass()
export default class State extends declared(Accessor) {

  @property()
  sliderIsOpen: boolean = false;

  @property()
  device: Device = null;

  @property()
  currentPoi: ScreenPoint = null;

  @property()
  images: Images = null;

  @property()
  imagesChanged: boolean = false;

  @property()
  cleanUp: boolean = null;
}
