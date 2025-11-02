"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getRegion_1 = require("../handlers/getRegion");
const app = express_1.default.Router();
app.get('/:id', getRegion_1.getRegion);
exports.default = app;
