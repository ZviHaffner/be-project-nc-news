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
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("/api", () => {
  test("GET 200: Responds with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const allEndpoints = body.endpoints;
        for (key in allEndpoints) {
          expect(allEndpoints[key]).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            reqBodyFormat: expect.any(Object),
            exampleResponse: expect.any(Object),
          });
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
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: Responds with all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("GET 200: Adds comment_count to articles response", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET 200: Response is sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 200: Does not include body column in response", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Responds with correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET 404: Responds with error when passed a non-existent ID", () => {
    return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No article found for article_id: 99999999");
      });
  });
  test("GET 400: Responds with error when passed an ID that is not a number", () => {
    return request(app)
      .get("/api/articles/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("PATCH 201: Responds with updated votes added for correct article", () => {
    const newVotes = { inc_votes: 25 };
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 25,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 201: Responds with updated votes subtracted for correct article", () => {
    const newVotes = { inc_votes: -25 };
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: -25,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const newVotes = { inc_votes: "Twenty five" };
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("PATCH 400: Responds with error when an empty object is posted", () => {
    const newVotes = {};
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("PATCH 404: Responds with error when passed a non-existent ID", () => {
    const newVotes = { inc_votes: 25 };
    return request(app)
      .patch("/api/articles/99999999")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No article found for article_id: 99999999");
      });
  });
  test("PATCH 400: Responds with error when passed an ID that is not a number", () => {
    const newVotes = { inc_votes: -25 };
    return request(app)
      .patch("/api/articles/NaN")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: Responds with comments for correct article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("GET 200: Response is sorted with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 404: Responds with error when passed a non-existent ID", () => {
    return request(app)
      .get("/api/articles/99999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No comments found for article_id: 99999999");
      });
  });
  test("GET 400: Responds with error when passed an ID that is not a number", () => {
    return request(app)
      .get("/api/articles/NaN/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("POST 201: Adds the comment to the correct article and responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello World! This is a test comment.",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "Hello World! This is a test comment.",
          article_id: 2,
        });
      });
  });
  test("POST 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("POST 404: Responds with error when passed a non-existent ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello World! This is a test comment.",
    };
    return request(app)
      .post("/api/articles/99999999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("POST 400: Responds with error when passed an ID that is not a number", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello World! This is a test comment.",
    };
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});
