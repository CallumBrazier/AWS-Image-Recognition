const fakeData = [
  {
    Labels: [
      {
        Name: "Truck",
        Confidence: 99.93836212158203,
        Instances: [Array],
        Parents: [Array],
      },
      {
        Name: "Vehicle",
        Confidence: 99.93836212158203,
        Instances: [],
        Parents: [],
      },
    ],
  },
];

const post = (imageFile) => {
  if (imageFile != null) {
    try {
      console.log("File uploaded!");
      let convertedImage = ["Truck image!"];
      analysePhoto(convertedImage);
      return convertedImage;
    } catch (err) {
      console.log("Error uploading image", err);
    }
  }
};

const analysePhoto = (convertedFile) => {
  let params = {
    Image: {
      Bytes: convertedFile,
    },
    MaxLabels: 10,
    MinConfidence: 80,
  };

  let result = "";

  let fakeAWSCall =
    (params,
    (err, res) => {
      if (err) {
        return err;
      } else {
        result = fakeData;
        console.log("Image analysed!");
      }
    });

  fakeAWSCall();

  return result;
};

module.exports.analysePhoto = analysePhoto;
module.exports.post = post;
