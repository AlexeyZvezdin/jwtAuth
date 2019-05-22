const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");

dotenv.config();

//  Connect to db
console.time("dbConnect");
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("connect to db!");
  console.timeEnd("dbConnect");
});

// Middleware
app.use(express.json());

// Route middleware
app.use("/api/user", authRoute);

app.listen(3000, () => {
  console.log("Up and running");
});
