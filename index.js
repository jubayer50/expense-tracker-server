const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Expense tracker server is running on port ${port}`);
});
