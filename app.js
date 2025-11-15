const mongoose = require("mongoose");

const express = require("express");

const app = express();

const cors = require("cors");

const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => {
    console.log("Conneted to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);
app.use(cors());

app.listen(PORT, () => {
  console.log("Listening on port 3001");
});
