const express = require("express");
const upload = require("express-fileupload");
const port = 5000;
const fs = require("fs");
const https = require("https");
const request = require("request");
require("dotenv").config();
var AWS = require("aws-sdk");

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// AWS.config.update({ region: "ap-southeast-2" });

const client = new AWS.Rekognition();

const app = express();

app.use(upload());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//save image from desktop to local disk and send it to AWS Rekognition to analyse.
app.post("/", (req, res) => {
  if (req.files) {
    console.log("files", req.files);
    console.log("filename", req.files.filename);

    let file = req.files.filename;
    let filename = file.name;
    console.log(filename);
    console.log("data", file.data);

    file.mv("./uploads/" + filename, (err) => {
      if (err) {
        console.log("error:", err);
      } else {
        let bitmap = req.files.filename.data;
        AnalysePhoto(bitmap);
        res.send("File Uploaded and analysed!");
      }
    });
  }
});

//save image from URL to local disk and send it to AWS Rekognition to analyse.
app.post("/url", (req, res) => {
  if (req.body.url) {
    let url = req.body.url;
    console.log(url);

    let options = {
      url: url,
      method: "get",
      encoding: null,
    };

    const saveImage = (url, path) => {
      let localPath = fs.createWriteStream(path);
      let request = https.get(url, function (response) {
        response.pipe(localPath);
        console.log("File uploaded!");
        res.send("File uploaded and analysed!");
      });
    };

    request(options, function (err, res, body) {
      if (err) {
        console.error("error: ", err);
      } else {
        AnalysePhoto(body);
      }
    });
    saveImage(url, "./uploads/" + Date.now() + ".jpg");
  }
});

AnalysePhoto = (x) => {
  const params = {
    Image: {
      Bytes: x,
    },
    MaxLabels: 5,
    MinConfidence: 80,
  };

  client.detectLabels(params, function (err, response) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(response);
    }
  });
};

app.listen(port, (err) => {
  err
    ? console.log(`ERROR ${console.log(err)}`)
    : console.log(`running server on port ${port}`);
});
