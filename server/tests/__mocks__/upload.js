const fakeData = [
  {
    Labels: [
      {
        Name: "Car",
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

const params = {
  Image: {
    Bytes: convertedImage,
  },
  MaxLabels: 10,
  MinConfidence: 80,
};

export default async(params, function (err, res) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(res);
    return fakeData;
  }
});

// export default function request(url) {
//   return new Promise((resolve, reject) => {
//     const userID = parseInt(url.substr("/users/".length), 10);
//     process.nextTick(() =>
//       users[userID]
//         ? resolve(users[userID])
//         : reject({
//             error: "User with " + userID + " not found.",
//           })
//     );
//   });
// }

// await client.detectLabels(params, function (err, res) {
//   if (err) {
//     console.log(err, err.stack);
//   } else {
//     console.log(res);
//   }
// });
