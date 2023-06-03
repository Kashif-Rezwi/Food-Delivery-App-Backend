const express = require("express");
const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

// getting all users
userRouter.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
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
    const user = await userModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      res.send({ msg: "User not found!" });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});

// creating new user
userRouter.post("/register", async (req, res) => {
  const { _id, name, email, password, address } = req.body;

  let userExists = await userModel.find({ email: email });

  if (userExists.length > 0) {
    return res.send({ msg: "User already exists!" });
  }

  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.send({ error: err.message });
      }

      const newUser = userModel({
        _id,
        name,
        email,
        password: hash,
        address,
      });
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
    let userExists = await userModel.find({ email: email });

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
