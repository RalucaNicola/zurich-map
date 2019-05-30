# Old Zurich in Photos

[![oldzueri.PNG](./src/assets/oldzurich.png)](https://ralucanicola.github.io/zurich-map/)

Old Zurich in Photos is a 3D interactive map where people can explore old photographs Zurich. The target audience is basically anybody who is interested in this topic and who wants to see what Zurich looked like in the past.

The images are subject to the conditions of use of the source platforms
where the digital copies are accessible. See the source of each image for more information.
The buildings are released under [CC0](https://creativecommons.org/publicdomain/zero/1.0/)
by the city of Zurich. Water and street data: © OpenStreetMap contributors under the [Open Database License](http://opendatacommons.org/licenses/odbl/1.0/). The data was processed and published with
[ArcGIS Pro](https://pro.arcgis.com/en/pro-app/). The map was built with [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/).

## Usage

1. Clone the repo and `npm install` dependencies
2. Remove ref to this repo: `rm -rf .git`
3. `npm run dev` to compile `src/js/*.ts` and `src/css/*.sccs` files in the same folder and watch for changes
4. launch `index.html` in your browser of choice.
5. `npm run lint` to run [TSLint](https://github.com/palantir/tslint) on TypeScript files.
