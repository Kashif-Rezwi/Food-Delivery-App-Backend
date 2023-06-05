const mongoose = require("mongoose");
const { menuSchema } = require("./menu.schema");

const ordersSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  items: { type: [menuSchema], required: true },
  totalPrice: { type: Number, required: true },
  deliveryAddress: { type: addressSchema, required: true },
  status: {
    type: String,
    enum: ["placed", "preparing", "on the way", "delivered"],
    default: "placed",
  },
});

const OrdersModel = mongoose.model("Order", ordersSchema);

module.exports = { OrdersModel };
