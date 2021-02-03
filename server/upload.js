const express = require("express");
const multer = require("multer");
const port = 3001;
const fs = require("fs");
const https = require("https");
const request = require("request");
const cors = require("cors");
require("dotenv").config();
var AWS = require("aws-sdk");

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const client = new AWS.Rekognition();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer();

let result = "";

app.post("/upload", upload.single("file"), async (req, res) => {
  //save local file and upload to AWS for analysis
  if (req.file != null) {
    let file = req.file;
    let filename = file.originalname;
    let buffer = file.buffer;
    try {
      fs.createWriteStream(`${__dirname}/uploads/${filename}`).write(buffer),
        res.status(200).send("File uploaded!"),
        AnalysePhoto(buffer);
    } catch (err) {
      res.status(400).send("Error uploading image");
    }
  }

  //save file from url and upload to AWS for analysis
  if (req.body.file) {
    let url = req.body.file;

    let options = {
      url: url,
      method: "get",
      encoding: null,
    };

    const saveImage = (url, path) => {
      let localPath = fs.createWriteStream(path);
      let request = https.get(url, function (response) {
        response.pipe(localPath);
        res.send("File uploaded!");
      });
    };
    saveImage(url, "./uploads/" + Date.now() + ".jpg");
    request(options, function (err, res, body) {
      if (err) {
        console.error("error: ", err);
      } else {
        AnalysePhoto(body);
      }
    });
  }
});

AnalysePhoto = (convertedImage) => {
  const params = {
    Image: {
      Bytes: convertedImage,
    },
    MaxLabels: 10,
    MinConfidence: 80,
  };

  client.detectLabels(params, function (err, res) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(res);
      result = res;
    }
  });
};

app.get("/analyse", async (req, res) => {
  await res.status(200).send(result);
});

app.listen(port, (err) => {
  err
    ? console.log(`ERROR ${console.log(err)}`)
    : console.log(`running server on port ${port}`);
});
