# Template App

> TypeScript with the [ArcGIS API 4 for JavaScript](https://developers.arcgis.com/javascript/)

## Usage

1. Clone the repo and `npm install` dependencies
2. Remove ref to this repo: `rm -rf .git`
3. `npm run dev` to compile `src/js/*.ts` and `src/css/*.sccs` files in the same folder and watch for changes
4. launch `index.html` in your browser of choice.
5. `npm run lint` to run [TSLint](https://github.com/palantir/tslint) on TypeScript files.

## How to use latest / unreleased API version and typings?

1. Either change the path to the API file or change your dojo config to use a different folder: 
```
{ name: "esri", location: "../arcgis-js-api/esri"},
```
2. Remove `"@types/arcgis-js-api"` from your package.json and `npm install --update` (be sure it's delete)
3. Copy your custom generated typings `.d.ts` for the API in a file and add it to your `tsconfig.json` file as follow:
```
"types": [ 
      "dojo",
      "./typings/arcgis-js-api-4.11"
    ]
```
