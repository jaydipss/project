const express = require("express");
const routers = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../helpsql/connection");
const loginValidation = require("../helpsql/validation");
const signupValidation = require("../helpsql/validation");
//----get category
routers.get(`/`, (req, res) => {
  let allUsers = connection.query(
    "SELECT * FROM `eshop-db`.user",
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
        console.log(allUsers);
      } else {
        console.log(err);
        return err;
      }
    }
  );
});

//----get single category
routers.get(`/:id`, (req, res) => {
  connection.query(
    "SELECT * FROM `eshop-db`.user WHERE user_id = ?",
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
    "DELETE FROM `eshop-db`.user WHERE user_id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send("deleted user successfully");
      } else {
        return err;
      }
    }
  );
});

//----post  category data
routers.post(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  let name = req.body.name;
  let email = req.body.email;
  let passwordHash = bcrypt.hashSync(req.body.passwordHash, 10);
  let phone = req.body.phone;
  let isAdmin = req.body.isAdmin;
  let city = req.body.city;
  let country = req.body.country;
  let sql =
    "INSERT INTO `eshop-db`.`user` (`name`, `email`, `passwordHash` ,`phone` ,`isAdmin`,`city`,`country`)\
     VALUES (? , ? , ? ,? , ? , ? ,? )";

  connection.query(
    sql,
    [name, email, passwordHash, phone, isAdmin, city, country],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.write("user inserted...");
      res.end();
    }
  );
});

//-------------login user-------------------------------------
routers.post("/login", loginValidation, (req, res, next) => {
  connection.query(
    `SELECT * FROM user WHERE email = ${connection.escape(req.body.email)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: "Email or password is incorrect!",
        });
      }
      // check password
      bcrypt.compare(
        req.body.passwordHash,
        result[0]["passwordHash"],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            console.log(err);
            throw bErr;
            return res.status(401).send({
              msg: "Email or password is incorrect!",
            });
          }
          if (bResult) {
            const token = jwt.sign(
              { id: result[0].id },
              "the-super-strong-secrect",
              { expiresIn: "1m" }
            );
            connection.query(
              `UPDATE user SET last_login = now() WHERE user_id = '${result[0].user_id}'`
            );
            return res.status(200).send({
              msg: "Logged in!",
              token,
              user: result[0],
            });
          }
          return res.status(401).send({
            msg: "Username or password is incorrect!",
          });
        }
      );
    }
  );
});

//================================signup=============================
routers.post("/register", signupValidation, (req, res, next) => {
  connection.query(
    `SELECT * FROM user WHERE LOWER(email) = LOWER(${connection.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        // username is available
        bcrypt.hash(req.body.passwordHash, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            // has hashed pw => add to database
            let name = req.body.name;
            let email = req.body.email;
            let passwordHash = bcrypt.hashSync(req.body.passwordHash, 10);
            let phone = req.body.phone;
            let isAdmin = req.body.isAdmin;
            let city = req.body.city;
            let country = req.body.country;

            connection.query(
              "INSERT INTO `eshop-db`.`user` (`name`, `email`, `passwordHash` ,`phone` ,`isAdmin`,`city`,`country`)\
     VALUES (? , ? , ? ,? , ? , ? ,? )",
              [name, email, passwordHash, phone, isAdmin, city, country],
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err,
                  });
                }
                return res.status(201).send({
                  msg: "The user has been registerd with us!",
                });
              }
            );
          }
        });
      }
    }
  );
});

//----update  category data
routers.put(`/`, (req, res) => {
  res.writeHead(200, { "content-Type": "text/html" });
  let name = req.body.name;
  let email = req.body.email;
  let passwordHash = req.body.passwordHash;
  let phone = req.body.phone;
  let isAdmin = req.body.isAdmin;
  let city = req.body.city;
  let country = req.body.country;
  let user_id = req.body.user_id;
  let sql =
    "UPDATE `eshop-db`.`user` set name = ?, email = ?, passwordHash = ?\
    ,phone = ? ,isAdmin = ?, city = ?, country = ? where (user_id = ?) ";

  connection.query(
    sql,
    [name, email, passwordHash, phone, isAdmin, city, country, user_id],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.write("Updated...");
      res.end();
    }
  );
});

module.exports = routers;
