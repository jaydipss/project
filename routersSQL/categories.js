const express = require("express");
const routers = express.Router();

//----get category
routers.get(`/`, (req, res) => {
  connection.query("SELECT * FROM `eshop-db`.Category", (err, rows, fields) => {
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
    "SELECT * FROM `eshop-db`.Category WHERE category_id = ?",
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
    "DELETE FROM `eshop-db`.Category WHERE category_id = ?",
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
  let icone = req.query.icone;
  let color = req.query.color;
  let sql =
    "INSERT INTO `eshop-db`.`Category` (`name`, `icone`, `color`) VALUES (? , ? , ?)";

  connection.query(sql, [name, icone, color], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.write("inserted...");
    res.end();
  });
});

//----update  category data
routers.put(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  let name = req.query.name;
  let icone = req.query.icone;
  let color = req.query.color;
  let category_id = req.query.category_id;
  let sql =
    "UPDATE `eshop-db`.`Category` set name = ?, icone = ? , color = ? where (category_id = ?)";
  connection.query(sql, [name, icone, color, category_id], (err, result) => {
    if (err) throw err;
    res.write("Updated...");
    res.end();
  });
});

module.exports = routers;
