import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/ConnectMongoDB.js";

const app = express();
dotenv.config();

// PORT Assign
const PORT = process.env.PORT || 9000;



// Running App
app.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on port ${PORT}`);
});
