const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { schemaValidater } = require("../utils/schemaValidater");

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

// creating new user
userRouter.post("/register", async (req, res) => {
  const payload = req.body;
  const { email, password, ...rest } = payload;

  try {
    let userExists = await UserModel.find({ email: email });

    if (userExists.length > 0) {
      return res.send({ msg: "User already exists!" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.send({ error: err.message });
      }

      const newUser = new UserModel(payload);

      // Validate the payload against the schema
      const validationError = newUser.validateSync();
      if (validationError) {
        const errorMessage = schemaValidater(validationError);
        return res.send(errorMessage);
      }

      await newUser.save();
      res.send({ msg: "User registered successfully." });
    });
  } catch (err) {
    res.send({ error: err.message });
  }
});

// user login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let userExists = await UserModel.find({ email: email });

    if (userExists.length > 0) {
      bcrypt.compare(password, userExists[0].password, async (err, result) => {
        if (result) {
          const token = "this is a token.";
          res.send({ msg: "User login successfully.", token: token });
        } else {
          return res.send({ msg: "Wrong Credentials!" });
        }
      });
    } else {
      res.send({ msg: "User not exists!" });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = {
  userRouter,
};
