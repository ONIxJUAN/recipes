const express = require("express");
const recipeRouter = require("./routes/recipeRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", recipeRouter);

app.listen(process.env.API_URL, () => {
  console.log("server draait op localhost:", process.env.API_URL);
});
