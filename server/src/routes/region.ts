import express from 'express';
import { getRegion } from '../handlers/getRegion';

const app = express.Router();

app.get('/:id', getRegion);

export default app;