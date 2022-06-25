const mongoose = require("mongoose");

//product schema
const OrderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      require: true,
    },
  ],
  shippingAddress: {
    type: String,
    require: true,
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    require: true,
  },
  zip: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrder: {
    type: Date,
    default: Date.now,
  },
});

// id for use all the project without_
OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
OrderSchema.set("toJSON", {
  virtuals: true,
});

// shema need to model
exports.Order = mongoose.model("Order", OrderSchema);
