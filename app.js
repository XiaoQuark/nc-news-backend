const cors = require("cors");

const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const {
    getArticles,
    getArticleById,
    patchArticleById,
} = require("./controllers/articles.controller");
const {
    getCommentsByArticleId,
    postCommentByArticleId,
    deleteCommentById,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "404: Not Found" });
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "400: Bad Request" });
    }
    if (err.code === "23502") {
        res.status(400).send({ msg: "400: Required Key Missing" });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
