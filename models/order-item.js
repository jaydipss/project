const mongoose = require("mongoose");

//product schema
const OrderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    require: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

// shema need to model///
exports.OrderItem = mongoose.model("OrderItem", OrderItemSchema);
