const { mongoose } = require("mongoose");
const { menuSchema } = require("./menu.schema");

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
    },
    menu: { type: [menuSchema], default: [] },
  },
  {
    versionKey: false,
  }
);

const RestaurantModel = mongoose.model("restaurant", restaurantSchema);

module.exports = { RestaurantModel };
