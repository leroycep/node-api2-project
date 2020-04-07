const express = require("express");
const db = require("../data/db.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ error: "Unable to retrieve list of posts" });
    });
});

module.exports = router;
