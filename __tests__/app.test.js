const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const connection = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  connection.end();
});

describe("/api/notARoute", () => {
  test("GET 404", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});

describe("/api", () => {
  test("GET 200: Responds with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const allEndpoints = body.endpoints
        for(key in allEndpoints) {
          expect(allEndpoints[key]).toMatchObject({
            "description": expect.any(String),
            "queries": expect.any(Array),
            "reqBodyFormat": expect.any(Object),
            "exampleResponse": expect.any(Object)
          })
        }
      });
  });
});

describe("/api/topics", () => {
  test("GET 200: Responds with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String)
          });
        });
      });
  });
});