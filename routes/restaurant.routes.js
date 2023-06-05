const express = require("express");
const { RestaurantModel } = require("../models/restaurant.model");
const { schemaValidater } = require("../utils/schemaValidater");

const restaurantRouter = express.Router();

// getting all restaurants
restaurantRouter.get("/", async (req, res) => {
  try {
    let restaurants = await RestaurantModel.find();

    if (restaurants.length > 0) {
      res.send(restaurants);
    } else {
      res.send({ msg: "No restaurant is defined yet." });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});

// getting restaurant by its _id
restaurantRouter.get("/:id", async (req, res) => {
  const restaurantId = req.params.id;

  try {
    let restaurant = await RestaurantModel.findById(restaurantId);

    if (restaurant) {
      return res.send(restaurant);
    }
  } catch (err) {
    res.send({ msg: `No restaurant found by this _id ${restaurantId}!` });
  }
});

// creating a restaurant
restaurantRouter.post("/createRestaurant", async (req, res) => {
  const payload = req.body;
  const { name, ...rest } = payload;

  try {
    const restaurantExists = await RestaurantModel.find({ name: name });

    if (restaurantExists.length > 0) {
      return res.send({ msg: "Restaurant already exists!" });
    }

    const newRestaurant = new RestaurantModel(payload);

    // Validate the payload againt schema
    const validationError = newRestaurant.validateSync();
    if (validationError) {
      const errorMessage = schemaValidater(validationError);
      return res.send(errorMessage);
    }

    await newRestaurant.save();
    res.send({
      msg: "New Restaurant created successfully.",
      restaurant: newRestaurant,
    });
  } catch (err) {
    res.send({ error: err.message });
  }
});

// getting menu of a specific restaurant
restaurantRouter.get("/:id/menu", async (req, res) => {
  const restaurantId = req.params.id;

  try {
    const restaurantExists = await RestaurantModel.findById(restaurantId);
    if (restaurantExists && restaurantExists.menu.length > 0) {
      return res.send({ menu: restaurantExists.menu });
    } else {
      return res.send({ msg: "Menu is empty!", menu: restaurantExists.menu });
    }
  } catch (err) {
    res.send({ msg: `No restaurant found by this _id ${restaurantId}!` });
  }
});

restaurantRouter.get("/:restId/menu/:menuId", async (req, res) => {
  const { restId, menuId } = req.params;

  try {
    const restaurantExists = await RestaurantModel.findById(restId);
    if (restaurantExists) {
      // const menuExists = await restaurantExists.menu.find({ _id: menuId });
      // res.send(restaurantExists);
    }
  } catch (err) {
    res.send({ msg: `No restaurant found by this _id ${restId}!` });
  }
});

module.exports = { restaurantRouter };
