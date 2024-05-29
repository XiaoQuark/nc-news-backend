const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controllers");
const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
});

app.all("*", (req, res) => {
    res.status(404).send({ msg: "404: Not Found" });
});

module.exports = app;
