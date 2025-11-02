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
    const censusShpFile = await loadShapefile(`https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_${id}_sldl_500k.zip`);
    const districts = censusShpFile.features;
    return districts;
};
exports.getRegionShpFile = getRegionShpFile;
const getStateShpFile = async (id) => {
};
exports.getStateShpFile = getStateShpFile;
async function loadShapefile(zipUrl) {
    const geojson = await (0, shpjs_1.default)(zipUrl); // URL to .zip of shapefiles
    return geojson;
}
//# sourceMappingURL=utils.js.map