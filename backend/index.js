import express from "express";
import dbConnect from "./db/ConnectMongoDB.js";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
// imports End

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to parse from data(urlencoded)
app.use(cookieParser());

// Routes Setup
app.use("/api/auth", authRoutes);

// PORT Assign
const PORT = process.env.PORT || 9000;

// Running App
app.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on port ${PORT}`);
});
