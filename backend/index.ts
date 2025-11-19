// /backend/index.ts
import express from 'express';
import healthRouter from './routes/health';
import productsRouter from './routes/products';


const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Mount routers
app.use('/health', healthRouter);
app.use('/products', productsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// -----------------------------
// Start server
// -----------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
