const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const {
    getArticles,
    getArticleById,
} = require("./controllers/articles.controller");
const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "400: Bad Request" });
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

app.all("*", (req, res) => {
    res.status(404).send({ msg: "404: Not Found" });
});

module.exports = app;
