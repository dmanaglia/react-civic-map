"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateShpFile = exports.getRegionShpFile = void 0;
const shpjs_1 = __importDefault(require("shpjs"));
const regionshp = 'https://www2.census.gov/geo/tiger/GENZ2024/shp/';
// const stateshp = 'https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_${state?.id}_sldl_500k.zip';
const getRegionShpFile = async (id) => {
    console.log("fetching shape file...");
    const censusShpFile = await loadShapefile(`https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_${id}_sldl_500k.zip`);
    const districts = censusShpFile.features;
    return districts;
};
exports.getRegionShpFile = getRegionShpFile;
const getStateShpFile = async (id) => {
};
exports.getStateShpFile = getStateShpFile;
async function loadShapefile(zipUrl) {
    // console.log("parsing shape file...");
    console.log("fetching shape file...");
    const response = await fetch(zipUrl);
    if (!response.ok)
        throw new Error(`Failed to download shapefile: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    // console.log("parsing shape file...");
    const geojson = await shpjs_1.default.parseZip(arrayBuffer);
    return geojson;
}
