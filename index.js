// Load the SDK and UUID
var AWS = require("aws-sdk");
var uuid = require("node-uuid");

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const client = new AWS.Rekognition();

const params = {
  Image: {
    /* required */
    Bytes:
      Buffer.from("...") ||
      "STRING_VALUE" /* Strings will be Base-64 encoded on your behalf */,
  },
  MaxLabels: 5,
  MinConfidence: 80,
};

client.detectLabels(params, function (err, response) {
  if (err) {
    console.log(err, err.stack); // an error occurred
  } else {
    console.log(`Detected labels for: ${photo}`);
    response.Labels.forEach((label) => {
      console.log(`Label:      ${label.Name}`);
      console.log(`Confidence: ${label.Confidence}`);
      console.log("Instances:");
      label.Instances.forEach((instance) => {
        let box = instance.BoundingBox;
        console.log("  Bounding box:");
        console.log(`    Top:        ${box.Top}`);
        console.log(`    Left:       ${box.Left}`);
        console.log(`    Width:      ${box.Width}`);
        console.log(`    Height:     ${box.Height}`);
        console.log(`  Confidence: ${instance.Confidence}`);
      });
      console.log("Parents:");
      label.Parents.forEach((parent) => {
        console.log(`  ${parent.Name}`);
      });
      console.log("------------");
      console.log("");
    }); // for response.labels
  } // if
});
