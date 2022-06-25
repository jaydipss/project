const mongoose = require("mongoose");

//product schema
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },

  discription: {
    type: String,
    default: "this product is good",
  },

  richDiscription: {
    type: String,
    default: "this product is best for helth",
  },

  image: {
    type: String,
    default: "",
  },

  images: [
    {
      type: String,
    },
  ],

  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    require: true,
  },
  countInStock: {
    type: Number,
    require: true,
    min: 0,
    max: 200,
  },

  reating: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  isFetured: {
    type: Boolean,
    default: false,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
// id for use all the project without_
ProductSchema.virtual(`id`).get(function () {
  return this._id.toHexString();
});
ProductSchema.set("toJSON", {
  virtuals: true,
});

// shema need to model
exports.Product = mongoose.model("Product", ProductSchema);
