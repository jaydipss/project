const express = require("express");
const routers = express.Router();

//----get category
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

//----get single category
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

//----delete single category
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

//----post  category data
routers.post(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  //let id = req.params.id;
  let name = req.query.name;
  let discription = req.query.discription;
  let richDiscription = req.query.richDiscription;
  let image = req.query.image;
  let brand = req.query.brand;
  let price = req.query.price;
  let category_id = req.query.category_id;
  let countInStock = req.query.countInStock;
  let isFetured = req.query.isFetured;
  let dateCreated = req.query.dateCreated;
  let sql =
    "INSERT INTO `eshop-db`.`product` (`name`, `discription`, `richDiscription` ,`image` ,`brand`,`price`,`category_id`,`countInStock`,`isFetured`,`dateCreated`)\
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

//----update  category data
routers.put(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  let name = req.query.name;
  let discription = req.query.discription;
  let richDiscription = req.query.richDiscription;
  let image = req.query.image;
  let brand = req.query.brand;
  let price = req.query.price;
  let category_id = req.query.category_id;
  let countInStock = req.query.countInStock;
  let isFetured = req.query.isFetured;
  let dateCreated = req.query.dateCreated;
  let product_id = req.query.product_id;
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

module.exports = routers;
