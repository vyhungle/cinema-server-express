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

export const addPremiere = async (client, data, link, movieId) => {
  data.map(async (item) => {
    await client
      .post(link)
      .send({ screenId: item, movieId })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
};

export const addRoomDetail = async (client, data, link, roomId) => {
  data.map(async (item) => {
    await client
      .post(link)
      .send({ timeSlotId: item, roomId })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
};

export const addTicker = async (client, link, body) => {
  await client
    .post(link)
    .send(body)
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200);
};
