import Accessor = require("esri/core/Accessor");
import Point = require("esri/geometry/Point");

export interface ScreenPoint {
  x: number,
  y: number
}
export interface ImageMetadata {
  title: string,
  year: string,
  url: string,
  source: string
}

export interface Image {
  attributes: ImageMetadata
}

export type Images = Array<Image>;

export interface State extends Accessor {
  sliderIsOpen: boolean;
  currentPoi: ScreenPoint;
  smallViewport: boolean;
  images: Images;
  imagesChanged: boolean;
  cleanUp: boolean;
}
