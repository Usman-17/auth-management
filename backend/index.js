import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

//* PORT Assign
const PORT = process.env.PORT || 9000;

//* Running App
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
