const { analysePhoto } = require("./__mocks__/upload");

test("should get image analysis", async () => {
  await expect(analysePhoto()).toEqual(
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
