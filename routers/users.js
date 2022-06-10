var { User } = require("../models/user");
const express = require("express");
const routers = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//getmethord
routers.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(userList);
});

// find single record
routers.get(`/:id`, async (req, res) => {
  const users = await User.findById(req.params.id).select("-passwordHash");
  if (!users) {
    res.status(500).json({ message: "users id is not found" });
  }
  res.status(200).send(users);
});

// post user
routers.post(`/`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  any = await user.save();
  if (!user) return res.status(404).send("user is not created");
  res.send(user);
});

// register to user
routers.post(`/register`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user: any = await user.save();
  if (!user) return res.status(404).send("user is not register");
  res.send(user);
});

// login user from email password
routers.post(`/login`, async (req, res) => {
  const secret = process.env.secret;
  const user = await User.findOne({
    email: req.body.email,
    // isAdmin: req.body.isAdmin,
  });

  if (!user) {
    return res.status(400).send(`user dosen't exist`);
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
        // check the user is admin or not
      },
      secret,
      {
        expiresIn: "1w",
      }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("login failed");
  }
  //`````````````````````````````````
  x = user.isAdmin;
  console.log(x);
  //``````````````````````````````````

  //return res.status(200).send(user);
});

//user count
routers.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCounts: userCount,
  });
});

//delete user
routers.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id).then((user) => {
    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "user is deleted" });
    } else {
      return res
        .send(404)
        .json({ success: false, message: "user is not found" });
    }
  }).catch;
  (err) => {
    return res.send(400).json({ success: false, error: err });
  };
});

module.exports = routers;
