const express = require("express");

const posts = require("./posts/router");

const server = express();
const port = 41847;

server.use(express.json());

server.use("/api/posts", posts);

server.listen(port, () => {
  console.log(` == server listening on port ${port} == `);
});
