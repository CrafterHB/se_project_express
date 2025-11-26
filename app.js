require("dotenv").config();

const mongoose = require("mongoose");

const express = require("express");

const app = express();

const cors = require("cors");

const mainRouter = require("./routes/index");

const errorHandler = require("./middleware/error-handler");

const { requestLogger, errorLogger } = require("./middleware/logger");

const { errors } = require("celebrate");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => {
    console.log("Conneted to DB");
  })
  .catch(console.error);

app.use(
  cors({
    origin: "http://localhost:3000", // Vite's default port for React app
    credentials: true, // Allow Authorization header with JWT token
  })
);

app.use(express.json());
app.use(requestLogger);
app.use("/", mainRouter);
app.use(cors());

app.use(errorLogger);

app.use(errors());

app.listen(PORT, () => {
  console.log("Listening on port 3001");
});
