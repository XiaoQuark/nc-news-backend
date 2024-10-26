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
	test("status 200: should respond with an array of articles filtered by topic", () => {
		return request(app)
			.get("/api/articles?topic=mitch")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toHaveLength(12);
				body.articles.forEach((article) => {
					expect(article.topic).toBe("mitch");
				});
			});
	});
	test("status 404: should respond with a 404 error when passed a non-existent topic", () => {
		return request(app)
			.get("/api/articles?topic=nonexistent")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("404: Topic Not Found");
			});
	});
	test("status 200: should respond with an empty array when passed an existent topic that does not contain articles", () => {
		return request(app)
			.get("/api/articles?topic=paper")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toEqual([]);
			});
	});
	test("status 200: should respond with an array of articles sorted by votes descending", () => {
		return request(app)
			.get("/api/articles?sort_by=votes")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("votes", {
					descending: true,
				});
			});
	});
	test("status 200: should respond with an array of articles sorted by comment_count ascending", () => {
		return request(app)
			.get("/api/articles?sort_by=comment_count&order=asc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("comment_count", {
					descending: false,
				});
			});
	});
	test("status 200: should respond with an array of articles sorted by created_at ascending", () => {
		return request(app)
			.get("/api/articles?sort_by=created_at&order=asc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("created_at", {
					descending: false,
				});
			});
	});
	test("status 400: should respond with a 400 error when passed an invalid sort_by column", () => {
		return request(app)
			.get("/api/articles?sort_by=invalid_column")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
			});
	});
	test("status 400: should respond with a 400 error when passed an invalid order", () => {
		return request(app)
			.get("/api/articles?order=invalid_order")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
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
					created_at: expect.any(String),
					votes: 100,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
					comment_count: expect.any(Number),
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
				expect(body.msg).toBe("404: Article Not Found");
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

describe("POST /api/articles/:article_id/comments", () => {
	test("should respond with the newly posted comment object", () => {
		const requestBody = {
			username: "icellusedkars",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(requestBody)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					votes: 0,
					author: "icellusedkars",
					body: "This is a test comment",
					article_id: 1,
				});
				expect(typeof body.comment.comment_id).toBe("number");
				expect(typeof body.comment.created_at).toBe("string");
			});
	});
	test("should respond with a 404 error when the username is not valid", () => {
		const requestBody = {
			username: "imnotauser",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(requestBody)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("404: User Not Found");
			});
	});
	test("should respond with a 400 error when the comment has no body", () => {
		const requestBody = {
			username: "icellusedkars",
			body: "",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(requestBody)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Required Key Missing");
			});
	});
	test("should respond with a 404 error when passed a valid but non-existent article_id", () => {
		const requestBody = {
			username: "icellusedkars",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/999/comments")
			.send(requestBody)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("404: Article Not Found");
			});
	});
	test("should respond with a 400 error when passed a non valid id", () => {
		const requestBody = {
			username: "icellusedkars",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/not-an-id/comments")
			.send(requestBody)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
			});
	});
});

describe("PATCH /api/articles/:article_id", () => {
	test("should respond with the updated article object when the newVote amount is positive", () => {
		const newVote = 100;
		const requestBody = { inc_votes: newVote };
		return request(app)
			.patch("/api/articles/1")
			.send(requestBody)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					author: "butter_bridge",
					title: "Living in the shadow of a great man",
					article_id: 1,
					body: "I find this existence challenging",
					topic: "mitch",
					created_at: expect.any(String),
					votes: 200,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});
	test("should respond with the updated article object when the newVote amount is negative", () => {
		const newVote = -200;
		const requestBody = { inc_votes: newVote };
		return request(app)
			.patch("/api/articles/1")
			.send(requestBody)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					author: "butter_bridge",
					title: "Living in the shadow of a great man",
					article_id: 1,
					body: "I find this existence challenging",
					topic: "mitch",
					created_at: expect.any(String),
					votes: -100,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});
	test("should respond with a 400 error when passed a non valid request", () => {
		const newVote = "word";
		const requestBody = { inc_votes: newVote };
		return request(app)
			.patch("/api/articles/1")
			.send(requestBody)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
			});
	});
	test("should respond with a 404 error when passed a valid but non-existent article_id", () => {
		return request(app)
			.patch("/api/articles/999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("404: Not Found");
			});
	});
	test("should respond with a 400 error when passed a non valid id", () => {
		return request(app)
			.patch("/api/articles/not-an-id")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
			});
	});
	test("should ignore extra properties in the request body", () => {
		const newVote = 100;
		const requestBody = {
			inc_votes: newVote,
			comments: "NC Help is amazing",
			extraProperties: "should be ignored",
		};
		return request(app)
			.patch("/api/articles/1")
			.send(requestBody)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					author: "butter_bridge",
					title: "Living in the shadow of a great man",
					article_id: 1,
					body: "I find this existence challenging",
					topic: "mitch",
					created_at: expect.any(String),
					votes: 200,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
				expect(body.article).not.toHaveProperty("comments");
				expect(body.article).not.toHaveProperty("extraProperties");
			});
	});
	test("should respond with a 400 error when the required key is missing", () => {
		const requestBody = { not_inc_votes: 100 };
		return request(app)
			.patch("/api/articles/1")
			.send(requestBody)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Required Key Missing");
			});
	});
});

describe("DELETE /api/comments/:comment_id", () => {
	test("should respond with a status 204 and no content", () => {
		return request(app).delete("/api/comments/2").expect(204);
	});
	test("should respond with a status 400 when passed an invalid comment ID", () => {
		return request(app)
			.delete("/api/comments/not-an-id")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
			});
	});
	test("should respond with a status 404 when passed a valid but non-existent comment ID", () => {
		return request(app)
			.delete("/api/comments/999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("404: Comment Not Found");
			});
	});
});

describe("PATCH /api/comments/:comment_id", () => {
	test("should respond with the updated comment object when the newVote amount is positive", () => {
		const newVote = 100;
		const requestBody = { inc_votes: newVote };
		return request(app)
			.patch("/api/comments/1")
			.send(requestBody)
			.expect(200)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
					votes: 116,
					author: "butter_bridge",
					article_id: 9,
					created_at: "2020-04-06T12:17:00.000Z",
				});
			});
	});
	test("should respond with the updated comment object when the newVote amount is negative", () => {
		const newVote = -20;
		const requestBody = { inc_votes: newVote };
		return request(app)
			.patch("/api/comments/3")
			.send(requestBody)
			.expect(200)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
					votes: 80,
					author: "icellusedkars",
					article_id: 1,
					created_at: "2020-03-01T01:13:00.000Z",
				});
			});
	});
	test("should respond with a 400 error when passed a non valid request", () => {
		const newVote = "word";
		const requestBody = { inc_votes: newVote };
		return request(app)
			.patch("/api/comments/1")
			.send(requestBody)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
			});
	});
	test("should respond with a 404 error when passed a valid but non-existent comment_id", () => {
		return request(app)
			.patch("/api/comments/999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("404: Not Found");
			});
	});
	test("should respond with a 400 error when passed a non valid comment_id", () => {
		return request(app)
			.patch("/api/comments/not-an-id")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
			});
	});
	test("should ignore extra properties in the request body", () => {
		const newVote = 100;
		const requestBody = {
			inc_votes: newVote,
			comments: "NC Help is amazing",
			extraProperties: "should be ignored",
		};
		return request(app)
			.patch("/api/comments/1")
			.send(requestBody)
			.expect(200)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
					votes: 116,
					author: "butter_bridge",
					article_id: 9,
					created_at: "2020-04-06T12:17:00.000Z",
				});
				expect(body.comment).not.toHaveProperty("comments");
				expect(body.comment).not.toHaveProperty("extraProperties");
			});
	});
	test("should respond with a 400 error when the required key is missing", () => {
		const requestBody = { not_inc_votes: 100 };
		return request(app)
			.patch("/api/comments/1")
			.send(requestBody)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Required Key Missing");
			});
	});
});

describe("GET /api/users", () => {
	test("should respond with an array of user objects with username, name and avatar_url properties", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				expect(body.users.length).toBe(4);
				body.users.forEach((user) => {
					expect(typeof user.username).toBe("string");
					expect(typeof user.name).toBe("string");
					expect(typeof user.avatar_url).toBe("string");
				});
			});
	});
});

describe("GET /api/users/:username", () => {
	test("should respond with a user object with specific properties", () => {
		return request(app)
			.get("/api/users/lurker")
			.expect(200)
			.then(({ body }) => {
				expect(body.user).toMatchObject({
					username: "lurker",
					name: "do_nothing",
					avatar_url:
						"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
				});
			});
	});
	test("should respond with a 404 error when passed a valid but non-existent username", () => {
		return request(app)
			.get("/api/users/superjunior")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("404: User Not Found");
			});
	});
	test("should respond with a 400 error when passed a non valid id", () => {
		return request(app)
			.get("/api/users/non valid username")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("400: Bad Request");
			});
	});
});
