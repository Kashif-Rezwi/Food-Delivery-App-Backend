const { mongoose } = require("mongoose");
const { menuSchema } = require("./menu.schema");
const { addressSchema } = require("./address.schema");

const historySchema = mongoose.Schema({
  order_id: { type: String, required: true },
});

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: addressSchema, required: true },
    orders: { type: [menuSchema], default: [] },
    order_history: { type: [historySchema], default: [] },
  },
  { versionKey: false }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};
