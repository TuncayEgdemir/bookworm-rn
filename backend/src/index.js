import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';

const app = express();

app.use(express.json({ limit: '10mb' }));

app.use(cors());

const PORT = process.env.PORT || 3000;


app.use("/api/auth" , authRoutes)
app.use("/api/books" , bookRoutes)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
