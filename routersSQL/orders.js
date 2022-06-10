var { Order } = require("../models/order");
const express = require("express");
const { OrderItem } = require("../models/order-item");
const routers = express.Router();

//----get oders
routers.get(`/`, (req, res) => {
  connection.query("SELECT * FROM `eshop-db`.order", (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      return err;
    }
  });
});

//----get single oders
routers.get(`/:id`, (req, res) => {
  connection.query(
    "SELECT * FROM `eshop-db`.order WHERE order_id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        return err;
      }
    }
  );
});

//----delete single product
routers.delete(`/:id`, (req, res) => {
  connection.query(
    "DELETE FROM `eshop-db`.order WHERE order_id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send("deleted category successfully");
      } else {
        return err;
      }
    }
  );
});
//INSERT INTO `eshop-db`.`order` (`orderItems`, `shippingAddress`, `city`, `zip`, `country`, `phone`, `status`, `totalPrice`, `user`, `dateOrder`)
//VALUES ('2', 'vedant', 'surat', '394101', 'india', '7878851400', 'pending', '888', '10', '2022-02-26');
//----post  order data
routers.post(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  //let id = req.params.id;
  let orderItems = req.body.orderItems;
  let shippingAddress = req.body.shippingAddress;
  let city = req.body.city;
  let zip = req.body.zip;
  let country = req.body.country;
  let phone = req.body.phone;
  let status = req.body.status;
  let totalPrice = req.body.totalPrice;
  let user = req.body.user;
  let dateOrder = req.body.dateOrder;
  let sql =
    "INSERT INTO `eshop-db`.`order` (`orderItems`, `shippingAddress`, `city`, `zip`, `country`, `phone`, `status`, `totalPrice`, `user`, `dateOrder`)\
     VALUES (? , ? , ? ,? , ? , ? ,? , ? , ? , ?)";

  connection.query(
    sql,
    [
      orderItems,
      shippingAddress,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice,
      user,
      dateOrder,
    ],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.write("inserted...");
      res.end();
    }
  );
});

//----update  order data
routers.put(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  let orderItems = req.body.orderItems;
  let shippingAddress = req.body.shippingAddress;
  let city = req.body.city;
  let zip = req.body.zip;
  let country = req.body.country;
  let phone = req.body.phone;
  let status = req.body.status;
  let totalPrice = req.body.totalPrice;
  let user = req.body.user;
  let dateOrder = req.body.dateOrder;
  let order_id = req.body.order_id;
  let sql =
    "UPDATE `eshop-db`.`order` set orderItems = ?, shippingAddress = ?, city = ?\
    ,zip = ? ,country = ?, phone = ?, status = ?, totalPrice = ?, user = ?, dateOrder = ?\
    where (`order_id` = ?)";

  connection.query(
    sql,
    [
      orderItems,
      shippingAddress,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice,
      user,
      dateOrder,
      order_id,
    ],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.write("order Updated...");
      res.end();
    }
  );
});

module.exports = routers;
