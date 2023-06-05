const express = require("express");
const { UserModel } = require("../models/user.model");

const userRouter = express.Router();

// getting all users
userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    if (users.length > 0) {
      res.send(users);
    } else {
      res.send({ msg: "No user found!" });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});

// getting user by its _id
userRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById(userId);
    if (user) {
      return res.send(user);
    }
  } catch (err) {
    res.send({ msg: `User not found by this _id ${userId}!` });
  }
});

userRouter.get("/:id/orders", async (req, res) => {
  const userId = req.params.id;

  try {
    UserModel.findById(userId)
      .then((user) => {
        if (user.orders.length > 0) {
          return res.send({ orders: user.orders });
        } else {
          return res.send({ msg: "Orders is empty!", Orders: user.orders });
        }
      })
      .catch((err) => {
        res.send({ msg: `User not found by this _id ${userId}!` });
      });
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = {
  userRouter,
};
