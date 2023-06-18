const express = require("express");
const { RestaurantModel } = require("../models/restaurant.model");
const { schemaValidater } = require("../utils/schemaValidater");

const restaurantRouter = express.Router();

// Getting all restaurants
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

// Getting restaurant by its _id
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

// Creating a restaurant
restaurantRouter.post("/create-restaurant", async (req, res) => {
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

// Getting menu of a specific restaurant
restaurantRouter.get("/:id/menu", async (req, res) => {
  const restaurantId = req.params.id;

  try {
    RestaurantModel.findById(restaurantId)
      .then((restaurant) => {
        if (restaurant.menu.length > 0) {
          return res.send({ menu: restaurant.menu });
        } else {
          return res.send({ msg: "Menu is empty!", menu: restaurant.menu });
        }
      })
      .catch((err) => {
        res.send({ msg: `No restaurant found by this _id ${restaurantId}!` });
      });
  } catch (err) {
    res.send({ error: err.message });
  }
});

// Getting a specific menu of a specific restaurant by its restId and menuId
restaurantRouter.get("/:restId/menu/:menuId", async (req, res) => {
  const { restId, menuId } = req.params;

  try {
    RestaurantModel.findById(restId)
      .then((restaurant) => {
        const menuExists = restaurant.menu.find(
          (menu) => menu._id.toString() === menuId
        );

        if (!menuExists) {
          return res.send({ msg: `No menu found by this _id ${menuId}!` });
        }

        res.send(menuExists);
      })
      .catch((err) => {
        res.send({ msg: `No restaurant found by this _id ${restId}!` });
      });
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = { restaurantRouter };
