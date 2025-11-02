"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const region_1 = __importDefault(require("./routes/region"));
const app = (0, express_1.default)();
const PORT = 3001;
const allowedOrigins = [
    "http://localhost:3000" // React dev server
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use('/api/region', region_1.default);
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
