const mongoose = require("mongoose");

//product schema
const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  icone: {
    type: String,
  },
  colour: {
    type: String,
  },
});

// id for use all the project without_
CategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
CategorySchema.set("toJSON", {
  virtuals: true,
});

// shema need to model
exports.Category = mongoose.model("Category", CategorySchema);
