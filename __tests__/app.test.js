const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
    return seed(data);
});

afterAll(() => db.end());

describe("ALL *", () => {
    test("should respond with a 404 error message when passed a nonexistent endpoint", () => {
        return request(app)
            .get("/api/dinosaurs")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("404: Not Found");
            });
    });
});

describe("GET /api", () => {
    test("should respond with an object describing all available endpoints", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body.api).toEqual(endpoints);
            });
    });
});

describe("GET /api/topics", () => {
    test("should respond with an array of topic objects with slug and description properties", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(body.topics.length).toBe(3);
                body.topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe("string");
                    expect(typeof topic.description).toBe("string");
                });
            });
    });
});

describe("GET /api/articles", () => {
    test("status 200: should respond with an array of articles objects with defined properties", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13);
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true,
                });
                body.articles.forEach((article) => {
                    expect(typeof article.author).toBe("string");
                    expect(typeof article.title).toBe("string");
                    expect(typeof article.article_id).toBe("number");
                    expect(typeof article.topic).toBe("string");
                    expect(typeof article.created_at).toBe("string");
                    expect(typeof article.votes).toBe("number");
                    expect(typeof article.article_img_url).toBe("string");
                    expect(typeof article.comment_count).toBe("number");
                });
            });
    });
});

describe("GET /api/articles/:article_id", () => {
    test("should respond with an article object with specific properties", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T19:11:00.000Z",
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });
    test("should respond with a 404 error when passed a valid but non-existent article_id", () => {
        return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("404: Not Found");
            });
    });
    test("should respond with a 400 error when passed a non valid id", () => {
        return request(app)
            .get("/api/articles/not-an-id")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("400: Bad Request");
            });
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("should respond with an array of comment objects for the given article_id with specific properties", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(11);
                expect(body.comments).toBeSortedBy("created_at", {
                    descending: true,
                });
                body.comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe("number");
                    expect(typeof comment.votes).toBe("number");
                    expect(typeof comment.created_at).toBe("string");
                    expect(typeof comment.author).toBe("string");
                    expect(typeof comment.body).toBe("string");
                    expect(typeof comment.article_id).toBe("number");
                });
            });
    });
    test("should respond with a 404 error when passed a valid but non-existent article_id", () => {
        return request(app)
            .get("/api/articles/999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("404: Not Found");
            });
    });
    test("should respond with a 400 error when passed a non valid id", () => {
        return request(app)
            .get("/api/articles/not-an-id/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("400: Bad Request");
            });
    });
});
