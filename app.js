const express = require("express");
const app = express();
const mainRouter = require("./routes/index");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env; //If there is a port property in process.env use it, if not use 3001

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Conneted to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log("Listening on port 3001");
});
