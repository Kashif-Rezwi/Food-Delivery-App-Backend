const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const { userRouter } = require("./routes/user.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Wellcome to the Food Api Database.");
});

app.use("/user", userRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`connected to database port: ${process.env.PORT}`);
  } catch (err) {
    console.log({ error: err });
  }
});
