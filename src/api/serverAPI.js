import { json } from "express";

export const addCategoryDetail = (client, data, link, movieId) => {
  data.map(async (item) => {
    await client
      .post(link)
      .send({ categoryId: item, movieId })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
};

export const addSCreenDetail = async (client, data, link, movieId) => {
  data.map(async (item) => {
    await client
      .post(link)
      .send({ screenId: item, movieId })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
};

export const addTicker = async (client, link, body) => {
  await client
    .post(link, body)
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200);
};

export const postAPI = async (
  client,
  link,
  body,
  token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlVXNlciI6MCwiaWQiOiI2MTNkYTJkODczNmFhODI2ODQxNDgxYjMiLCJlbWFpbCI6ImxuaHYuMjYxMTIwMDBAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwOTgzNzgyOTQyIiwiaWF0IjoxNjM2OTgyODE5LCJleHAiOjE2MzgxOTI0MTl9.f9DVjp2bQSoHhLF1mSwDcSvPeR2hSweLEfhT_Vih_Bc"
) => {
  await client
    .post(link)
    .send(body)
    .set("Accept", "application/json")
    .set("Authorization", token)
    .expect("Content-Type", /json/)
    .expect(400);
};
