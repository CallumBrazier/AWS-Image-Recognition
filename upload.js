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

app.post("/", (req, res) => {
  //save image from desktop to local disk and send it to AWS Rekognition to analyse.
  if (req.files) {
    let file = req.files.filename;
    let filename = file.name;
    console.log(filename);

    file.mv("./uploads/" + filename, (err) => {
      if (err) {
        console.log("error:", err);
      } else {
        let bitmap = req.files.filename.data;
        AnalysePhoto(bitmap);
        // res.send({ message: "file uploaded!" });
        // res.send("Local File Uploaded and analysed!");
        res.redirect("/");
      }
    });
  }

  //save image from URL to local disk and send it to AWS Rekognition to analyse.
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
        // res.send({ message: "File uploaded" });
        // res.send("URL File uploaded and analysed!");
        res.redirect("/");
        // res.json(req.body);
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
    }
  });
};

app.listen(port, (err) => {
  err
    ? console.log(`ERROR ${console.log(err)}`)
    : console.log(`running server on port ${port}`);
});

module.exports = { AnalysePhoto, app };
