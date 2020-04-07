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

router.post("/:id/comments", async (req, res) => {
  const postExists = await db
    .findById(req.params.id)
    .then((posts) => posts.length !== 0)
    .catch((err) => {
      console.log(err);
      return false;
    });
  if (!postExists) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  }

  const newComment = req.body;
  newComment.post_id = req.params.id;
  if (newComment.text === undefined) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
    return;
  }
  db.insertComment(newComment)
    .then(({ id }) => {
      db.findCommentById(id)
        .then((comment) => {
          res.status(201).json(comment[0]);
        })
        .catch(() => {
          res.status(500).json({ error: "Couldn't find new post in database" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

router.put("/:id", async (req, res) => {
  const post = await db
    .findById(req.params.id)
    .then((posts) => posts[0])
    .catch((err) => {
      console.log(err);
      return undefined;
    });
  if (post === undefined) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
    return;
  }

  const updatedPost = req.body;
  if (updatedPost.title === undefined || updatedPost.contents === undefined) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
    return;
  }
  db.update(req.params.id, updatedPost)
    .then((_num_updated) => {
      db.findById(req.params.id)
        .then((post) => {
          res.status(200).json(post[0]);
        })
        .catch(() => {
          res
            .status(500)
            .json({ error: "Couldn't find updated post in database" });
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

router.delete("/:id", async (req, res) => {
  const post = await db
    .findById(req.params.id)
    .then((posts) => posts[0])
    .catch((err) => {
      console.log(err);
      return undefined;
    });
  if (post === undefined) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
    return;
  }

  console.log(post);

  db.remove(req.params.id)
    .then((_num_deleted) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "The post could not be removed" });
    });
});

module.exports = router;
