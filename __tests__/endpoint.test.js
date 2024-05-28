const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")

beforeEach(() => {
    return seed(data)
})

afterAll (() => db.end())

describe.only('GET /api/topics', () => {
    test('should respond with an array of topic objects with slug and description properties', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach((topic) => {
                expect(typeof topic.slug).toBe("string")
                expect(typeof topic.description).toBe("string")
            })
        })
    });
    test('should respond with a 404 error message when passed a nonexistent endpoint', () => {
        return request(app)
        .get("/api/dinosaurs")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("404: Not Found")
        })
    });
});
