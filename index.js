require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const fileupload = require('express-fileupload')
const router = require("./router/indexRouter");
const { sequelize, openConnection } = require("./db/db");
const {userModel, tokenModel} = require("./models/models");

const PORT = 5000;
const app = express();

app.use(express.json());
// app.use(fileupload({}))
app.use(cookieParser());
app.use(cors());
app.use("/api", router);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log("server success start on port:", PORT);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
