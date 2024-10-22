const cors = require("cors");
const express = require("express");
const apiRouter = require("./routes/api-router");

const app = express();
const endpoints = require("./endpoints.json");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
	res.status(404).send({ msg: "404: Not Found" });
});

app.use((err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ msg: "400: Bad Request" });
	}
	if (err.code === "23502") {
		res.status(400).send({ msg: "400: Required Key Missing" });
	}
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
