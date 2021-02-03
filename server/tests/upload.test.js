const { AnalysePhoto } = require("../upload.js");

test("should return image analysis", () => {
  const image = AnalysePhoto(".uploads/bugatti.jpg");
  expect(image).toContain("Coupe");
});
