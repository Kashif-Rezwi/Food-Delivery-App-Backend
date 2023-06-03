const express = require("express");
const { connection } = require("./config/db");

const app = express();

app.use(express.json);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`connected to database port: ${process.env.PORT}`);
  } catch (err) {
    console.log({ error: err });
  }
});
