const express = require("express");
const { UserModel } = require("../models/user.model");
const registerRouter = express.Router();
const bcrypt = require("bcrypt");
const { schemaValidater } = require("../utils/schemaValidater");

// creating new user
registerRouter.post("/", async (req, res) => {
  const { email, password, ...rest } = req.body;

  try {
    let userExists = await UserModel.find({ email: email });

    if (userExists.length > 0) {
      return res.send({ msg: "User already exists!" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.send({ error: err.message });
      }

      const newUser = new UserModel({ email, password: hash, ...rest });

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

module.exports = { registerRouter };
