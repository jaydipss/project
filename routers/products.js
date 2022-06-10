var { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

// image uplodaing
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalide type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//getmethord
router.get(`/`, async (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter); //.select("name brand price");
  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

//get single record
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category"); // populate use to make inner join from other table
  if (!product) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(product);
});

//POST_ data pass from body
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid category");

  //check file is pass in req or not
  const file = req.file;
  if (!file) return res.status(400).send("no image in the request");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
  const product = new Product({
    name: req.body.name,
    discription: req.body.discription,
    richDiscription: req.body.richDiscription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    reating: req.body.reating,
    numReviews: req.body.numReviews,
    isFetured: req.body.isFetured,
  });
  product: any = await product.save();
  if (!product) return res.status(500).send("product is not found");
  res.send(product);
  //res.send(newproduct);
});

// update product-----
router.put("/:id", async (req, res) => {
  // check valid id
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("invalid product id");
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      discription: req.body.discription,
      richDiscription: req.body.richDiscription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      reating: req.body.reating,
      numReviews: req.body.numReviews,
      isFetured: req.body.isFetured,
    },
    { new: true }
  );
  if (!product) return res.status(404).send("product is not update");
  return res.send(product);
});

//delete category
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id).then((product) => {
    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "product is deleted" });
    } else {
      return res
        .send(404)
        .json({ success: false, message: "product is not found" });
    }
  }).catch;
  (err) => {
    return res.send(400).json({ success: false, error: err });
  };
});

//product count
router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

//featured product
router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0; // for home page get limited items
  const products = await Product.find({ isFetured: true }).limit(count);
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

//*-------- add multipal image-----//update-----*
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    // check valid id
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("invalid product id");
    }
    let imagePaths = [];
    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    if (files) {
      files.map((file1) => {
        imagePaths.push(`${basePath}${file1.filename}`);
      });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagePaths,
      },
      { new: true }
    );

    if (!product) return res.status(404).send("product is not update");
    res.send(product);
  }
);

module.exports = router;
