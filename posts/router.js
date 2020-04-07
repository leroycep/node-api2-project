const express = require("express");
const db = require("../data/db.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json([]);
});

module.exports = router;
