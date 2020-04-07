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

router.post("/", (req, res) => {
  const newPost = req.body;
  if (newPost.title === undefined || newPost.contents === undefined) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
    return;
  }
  db.insert(newPost)
    .then(({ id }) => {
      db.findById(id)
        .then((post) => {
          res.status(201).json(post[0]);
        })
        .catch(() => {
          res.status(500).json({ error: "Couldn't find new post in database" });
        });
    })
    .catch(() => {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((posts) => {
      if (posts.length !== 0) {
        res.status(200).json(posts[0]);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

module.exports = router;
