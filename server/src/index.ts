import express from 'express';
import cors from 'cors';
import region from './routes/region';

const app = express();

const PORT = 3001;

const allowedOrigins = [
  "http://localhost:3000" // React dev server
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use('/api/region', region);

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});