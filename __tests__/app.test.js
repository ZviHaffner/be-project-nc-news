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

describe("/api/users", () => {
  test("GET 200: Responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const allUsers = body.users;
        expect(allUsers.length).toBe(4);
        for (key in allUsers) {
          expect(allUsers[key]).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        }
      });
  });
});

describe("/api/users/:username", () => {
  test("GET 200: Responds with specified user", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toEqual({
          username: "rogersop",
          name: "paul",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        });
      });
  });
  test("GET 404: Responds with error when passed a non-existent username", () => {
    return request(app)
      .get("/api/users/notaname")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No user found for username: notaname");
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
  test("GET 200: Response is by default sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 200: accepts optional query to sort by a column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("GET 400: Responds with error when passed a non valid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=sqlInjection")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid Sort Query");
      });
  });
  test("GET 200: Accepts optional query to filter by topic", () => {
    return request(app)
      .get("/api/articles?filter_by=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("GET 400: Responds with error when passed a non valid filter query", () => {
    return request(app)
      .get("/api/articles?filter_by=sqlInjection")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid Filter Query");
      });
  });
  test("GET 200: accepts optional query to order by ASC", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at");
      });
  });
  test("GET 400: Responds with error when passed a non valid order query", () => {
    return request(app)
      .get("/api/articles?order=sqlInjection")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid Order Query");
      });
  });
  test("GET 200: accepts optional queries to filter, sort and order", () => {
    return request(app)
      .get("/api/articles?filter_by=mitch&sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author");
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles", () => {
  test("POST 201: Adds the article and responds with the posted article", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "New Article",
      body: "Hi! This is a brand new article that I have just added to the website. I am very excited to share it with you!",
      topic: "mitch",
      article_img_url:
        "https://www.thoughtco.com/thmb/Us-4-juC71kAdEiDiPa4FMj2bzI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-539884551-57faea2f5f9b586c357f6424.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          author: "icellusedkars",
          title: "New Article",
          body: "Hi! This is a brand new article that I have just added to the website. I am very excited to share it with you!",
          topic: "mitch",
          article_img_url:
            "https://www.thoughtco.com/thmb/Us-4-juC71kAdEiDiPa4FMj2bzI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-539884551-57faea2f5f9b586c357f6424.jpg",
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("POST 201: Adds the article and responds with the posted article with the default article_img_url", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "New Article",
      body: "Hi! This is a brand new article that I have just added to the website. I am very excited to share it with you!",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          author: "icellusedkars",
          title: "New Article",
          body: "Hi! This is a brand new article that I have just added to the website. I am very excited to share it with you!",
          topic: "mitch",
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("POST 404: Responds with error when a non existent username is posted", () => {
    const newArticle = {
      author: "fake_username",
      title: "New Article",
      body: "Hi! This is a brand new article that I have just added to the website. I am very excited to share it with you!",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("POST 404: Responds with error when a non existent topic is posted", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "New Article",
      body: "Hi! This is a brand new article that I have just added to the website. I am very excited to share it with you!",
      topic: "fake_topic",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("POST 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const newArticle = {
      author: "icellusedkars",
      topic: "mitch",
      body: null
    };
    return request(app)
      .post("/api/articles/")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Responds with correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
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
  test("GET 200: Responds with correct article and comment count", () => {
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
          comment_count: "11",
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
  test("POST 404: Responds with error when a non existent username is posted", () => {
    const newComment = {
      username: "fake_username",
      body: "Hello World! This is a test comment.",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
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

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: Deletes comment specified by ID", () => {
    return request(app).delete("/api/comments/10").expect(204);
  });
  test("DELETE 404: Responds with error when passed a non-existent ID", () => {
    return request(app)
      .delete("/api/comments/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No comment found for comment_id: 99999999");
      });
  });
  test("DELETE 400: Responds with error when passed an ID that is not a number", () => {
    return request(app)
      .delete("/api/comments/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("PATCH 201: Responds with updated votes added for correct comment", () => {
    const newVotes = { inc_votes: 25 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment).toEqual({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 41,
          author: "butter_bridge",
          article_id: 9,
          comment_id: 1,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("PATCH 200: Responds with updated votes subtracted for correct comment", () => {
    const newVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment).toEqual({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 6,
          author: "butter_bridge",
          article_id: 9,
          comment_id: 1,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("PATCH 400: Responds with error when a bad object is posted e.g. a malformed body / missing required fields", () => {
    const newVotes = { inc_votes: "Twenty five" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("PATCH 400: Responds with error when an empty object is posted", () => {
    const newVotes = {};
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("PATCH 404: Responds with error when passed a non-existent ID", () => {
    const newVotes = { inc_votes: 25 };
    return request(app)
      .patch("/api/comments/9999999")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No comment found for comment_id: 9999999");
      });
  });
  test("PATCH 400: Responds with error when passed an ID that is not a number", () => {
    const newVotes = { inc_votes: -25 };
    return request(app)
      .patch("/api/comments/NaN")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});
