const { getTopics } = require("./controllers/topics.controller")
const express = require("express")
const app = express()

app.use(express.json())


app.get("/api/topics", getTopics)


app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
})

app.all("*", (req, res) => {
    res.status(404).send({msg: "404: Not Found"})
})

module.exports = app