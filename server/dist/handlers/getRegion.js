"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegion = void 0;
const utils_1 = require("../utils");
const getRegion = async (request, response) => {
    console.log(request.params.id);
    if (!request.params.id)
        throw console.error("No region id provided");
    return await (0, utils_1.getRegionShpFile)(request.params.id);
};
exports.getRegion = getRegion;
