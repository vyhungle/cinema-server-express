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
