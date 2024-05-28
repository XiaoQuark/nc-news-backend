const { selectTopics } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topicsList) => {
        res.status(200).send({ topics : topicsList })
    })
    .catch(next)
    
}