const express = require("express");
const routers = express.Router();

//----get product
routers.get(`/`, (req, res) => {
  connection.query("SELECT * FROM `eshop-db`.product", (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      return err;
    }
  });
});

//----get single product
routers.get(`/:id`, (req, res) => {
  connection.query(
    "SELECT * FROM `eshop-db`.product WHERE product_id = ?",
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
    "DELETE FROM `eshop-db`.product WHERE product_id = ?",
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

//----post  product data
routers.post(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  //let id = req.params.id;
  let name = req.body.name;
  let discription = req.body.discription;
  let richDiscription = req.body.richDiscription;
  let image = req.body.image;
  let brand = req.body.brand;
  let price = req.body.price;
  let category_id = req.body.category_id;
  let countInStock = req.body.countInStock;
  let isFetured = req.body.isFetured;
  let dateCreated = req.body.dateCreated;
  let sql =
    "INSERT INTO `eshop-db`.`product` (`name`, `discription`, `richDiscription` ,`image`\
    ,`brand`,`price`,`category_id`,`countInStock`,`isFetured`,`dateCreated`)\
     VALUES (? , ? , ? ,? , ? , ? ,? , ? , ? , ?)";

  connection.query(
    sql,
    [
      name,
      discription,
      richDiscription,
      image,
      brand,
      price,
      category_id,
      countInStock,
      isFetured,
      dateCreated,
    ],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.write("inserted...");
      res.end();
    }
  );
});

//----update  product data
routers.put(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  let name = req.body.name;
  let discription = req.body.discription;
  let richDiscription = req.body.richDiscription;
  let image = req.body.image;
  let brand = req.body.brand;
  let price = req.body.price;
  let category_id = req.body.category_id;
  let countInStock = req.body.countInStock;
  let isFetured = req.body.isFetured;
  let dateCreated = req.body.dateCreated;
  let product_id = req.body.product_id;
  let sql =
    "UPDATE `eshop-db`.`product` set name = ?, discription = ?, richDiscription = ?\
    ,image = ? ,brand = ?, price = ?, countInStock = ?, isFetured = ?, dateCreated = ?\
    where (product_id = ?) and (category_id = ?)";

  connection.query(
    sql,
    [
      name,
      discription,
      richDiscription,
      image,
      brand,
      price,
      countInStock,
      isFetured,
      dateCreated,
      product_id,
      category_id,
    ],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.write("Updated...");
      res.end();
    }
  );
});

module.exports = routers; //export module
