export const addScreenDetail = (client, data, link, movieId) => {
  data.map(async (item) => {
    await client
      .post(link)
      .send({ screenId: item, movieId })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
};

export const addPremiere = async (client, link, movieId, screenDetailId) => {
  await client
    .post(link)
    .send({ screenDetailId, movieId })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200);
};
