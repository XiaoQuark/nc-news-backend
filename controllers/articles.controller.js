const {
    selectArticles,
    selectArticleById,
    editArticleById,
} = require("../models/articles.model");
const { checkTopicExists } = require("../models/topics.model");

exports.getArticles = (req, res, next) => {
    const { topic } = req.query;

    const promises = [selectArticles(topic)];

    if (topic) {
        promises.push(checkTopicExists(topic));
    }

    Promise.all(promises)
        .then(([articles]) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    editArticleById(article_id, inc_votes)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};
