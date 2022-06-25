var { Order } = require("../models/order");
const express = require("express");
const { OrderItem } = require("../models/order-item");
const routers = express.Router();

//getmethord
routers.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrder: -1 }); // -1 min order sort new to old
  if (!orderList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(orderList);
});

//get one record
routers.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(order);
});

// post order
routers.post("/", async (req, res) => {
  //post order item id
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save(); // saving order item from the data base
      return newOrderItem._id;
    })
  );
  const orderItemIdsResolve = await orderItemIds;
  // count cart velue
  const totalPrices = await Promise.all(
    orderItemIdsResolve.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  //console.log(totalPrice);
  //console.log(orderItemIds);

  let order = new Order({
    orderItems: orderItemIdsResolve,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) return res.status(404).send("order is not created");
  res.send(order);
});

// update order
routers.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!order) return res.status(404).send("order is not update");
  res.send(order);
});

// delete order
routers.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id).then(async (order) => {
    if (order) {
      await order.orderItems.map(async (orderItem) => {
        await OrderItem.findByIdAndRemove(orderItem);
      });
      return res
        .status(200)
        .json({ success: true, message: "order is deleted" });
    } else {
      return res
        .send(404)
        .json({ success: false, message: "order is not found" });
    }
  }).catch;
  (err) => {
    return res.send(400).json({ success: false, error: err });
  };
});

// total sales
routers.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    req.status(400).send("order is not generated");
  }
  res.send({ totalsales: totalSales.pop().totalsales });
});

//order count
routers.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    ordercount: orderCount,
  });
});

module.exports = routers;
