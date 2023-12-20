import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(cors());
app.use(
  bodyParser.json({
    type(req) {
      return true;
    },
  })
);
app.use(function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

let posts = [
  { id: '1', content: "lorem ipsum", created: Date.now() },
  { id: '2', content: "lorem ipsum lorem ipsum", created: Date.now() },
  {
    id: '3',
    content: "lorem ipsum lorem ipsum lorem ipsum",
    created: Date.now(),
  },
];

app.get("/posts", (req, res) => {
  res.send(JSON.stringify(posts));
});

app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const findedPost = posts.find((o) => o.id === postId);

  res.send(JSON.stringify({ post: findedPost, index: posts.indexOf(findedPost) }));
});

app.post("/posts", (req, res) => {
  posts.push({ ...req.body, id: uuidv4(), created: Date.now() });
  res.status(204);
  res.end();
});

app.put("/posts/:id", (req, res) => {
  const postId = req.params.id;
  posts = posts.map((o) => {
    if (o.id === postId) {
      return {
        ...o,
        ...req.body,
        id: o.id,
      };
    }
    return o;
  });
  res.status(204).end();
});

app.delete("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const findedPost = posts.find((o) => o.id === postId);
  if (findedPost) {
    posts = posts.filter((o) => o.id != postId)
  }
  res.status(204);
  res.end();
});

const port = process.env.PORT || 7070;
app.listen(port, () =>
  console.log(`The server is running on http://localhost:${port}`)
);
