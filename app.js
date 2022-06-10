const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const morgan = require("morgan"); // whats happennd in the background servers
const mongoose = require("mongoose"); //data base odm
const cors = require("cors");
const authJWT = require("./helpers/jwt");
//const errorHandler = require("./helpers/error-handler");

// env veriable
require("dotenv/config");
const api = process.env.API_URL;

//midelwere
app.use(cors());
app.options("*", cors());
app.use(bodyparser.json());
app.use(morgan("tiny")); // which loscation data come and which methord
app.use(authJWT());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//app.use(errorHandler);

const ProductRouter = require("./routers/products");
const OrderRouter = require("./routers/orders");
const CategoryRouter = require("./routers/categories");
const UserRouter = require("./routers/users");

// req.res fom url routers
app.use(`${api}/products`, ProductRouter);
app.use(`${api}/orders`, OrderRouter);
app.use(`${api}/categories`, CategoryRouter);
app.use(`${api}/users`, UserRouter);

//mongoose connectivity///
mongoose
  .connect(process.env.CONNECTION_STRING) // use env
  .then(() => {
    console.log("mongo db is connected");
  })
  .catch((err) => {
    console.log(err);
  });

//server connectivity
app.listen(9999, () => {
  console.log(`it's listening`);
});
