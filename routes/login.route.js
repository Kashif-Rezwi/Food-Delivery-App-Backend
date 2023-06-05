const express = require("express");
const { UserModel } = require("../models/user.model");
const loginRouter = express.Router();
const bcrypt = require("bcrypt");

// user login
loginRouter.post("/", async (req, res) => {
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

module.exports = { loginRouter };
