const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const morgan = require("morgan"); // whats happennd in the background servers
const mysql = require("mysql"); //data base odm
const cors = require("cors");
const { query } = require("express");
//const authJWT = require("./helpers/jwt");

// env veriable/
require("dotenv/config");
const api = process.env.API_URL;

//--------midelwere--
app.use(cors());
app.options("*", cors());
app.use(bodyparser.json());
app.use(morgan("tiny")); // which loscation data come and which methord
//app.use(authJWT());
//app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//app.use(errorHandler);

//--------routers-----------
const CategoryRouter = require("./routersSQL/categories");
const ProductRouter = require("./routersSQL/products");
const userRouter = require("./routersSQL/users");
const orderRouter = require("./routersSQL/orders");

app.use(`${api}/categorys`, CategoryRouter);
app.use(`${api}/product`, ProductRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);
//-------mysql connectivity========
connection = require("./helpsql/connection");

//--------server connectivity------------
app.listen(8888, () => {
  console.log(`it's listening 8888`);
});
