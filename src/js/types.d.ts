import Accessor = require("esri/core/Accessor");
import Point = require("esri/geometry/Point");

export type Device = ("mobilePortrait" | "desktop");

export interface ScreenPoint {
  x: number,
  y: number
}
export interface ImageMetadata {
  title: string,
  year: string,
  url: string
}

export interface Image {
  attributes: ImageMetadata
}

export type Images = Array<Image>;

export interface State extends Accessor {
  sliderIsOpen: boolean;
  currentPoi: ScreenPoint;
  device: Device;
  images: Images;
  imagesChanged: boolean;
  cleanUp: boolean;
}
