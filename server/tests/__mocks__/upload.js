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

convertedImage = [];

const analysePhoto = (convertedImage) => {
  let params = {
    Image: {
      Bytes: convertedImage,
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
      }
    });
  fakeAWSCall();

  return result;
};

module.exports.analysePhoto = analysePhoto;
