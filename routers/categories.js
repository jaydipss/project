var { Category } = require("../models/category");
const express = require("express");
const routers = express.Router();

//getmethord
routers.get(`/`, async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(categoryList);
});
// find single record
routers.get(`/:id`, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({ message: "category id is not found" });
  }
  res.status(200).send(category);
});

// upate record
routers.put(`/:id`, async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    icone: req.body.icone,
    colour: req.body.colour,
  });
  if (!category) return res.status(404).send("category is not created");
  res.send(category);
});

// post create a routs and send the data of categories
routers.post("/", async (req, res) => {
  let category = new Category(
    {
      name: req.body.name,
      icone: req.body.icone,
      colour: req.body.colour,
    },
  );
  category = await category.save();
  if (!category) return res.status(404).send("category is not created");
  res.send(category);
});

//delete category
routers.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id).then((category) => {
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "category is deleted" });
    } else {
      return res
        .send(404)
        .json({ success: false, message: "category is not found" });
    }
  }).catch;
  (err) => {
    return res.send(400).json({ success: false, error: err });
  };
});

module.exports = routers;
