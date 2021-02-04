const { analysePhoto, post } = require("./__mocks__/upload");

const imageFile = {
  fieldname: "file",
  originalname: "old.jpg",
  encoding: "7bit",
  mimetype: "image/jpeg",
  buffer: "buffer bytes",
  size: 85810,
};

test("should return uploaded photo details", async () => {
  await expect(post(imageFile)).toEqual(["Truck image!"]);
});

test("should get image analysis", () => {
  expect(analysePhoto()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        Labels: expect.arrayContaining([
          expect.objectContaining({
            Name: "Truck",
          }),
        ]),
      }),
    ])
  );
});
