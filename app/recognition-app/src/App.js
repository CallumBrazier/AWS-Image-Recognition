import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";

import "./App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1em",
  },
}));

function App() {
  const [disabled1, setDisabled1] = useState(false);
  const [disabled2, setDisabled2] = useState(false);
  const [disabled3, setDisabled3] = useState(true);
  const [disabled4, setDisabled4] = useState(true);
  const [disabled5, setDisabled5] = useState(false);
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState();
  const [analysis, setAnalysis] = useState([]);
  const classes = useStyles();

  let loadFile = (event) => {
    try {
      setImage(URL.createObjectURL(event.target.files[0]));
      document.getElementById("input2").value = "";
      setDisabled2(true);
      const file = event.target.files[0];
      setFile(file);
      setProgress(0);
      setStatus();
      setAnalysis([]);
    } catch (err) {
      console.log(err);
      setStatus(err);
      setImage();
    }
  };

  let loadFile2 = () => {
    let imageurl = document.getElementById("input2").value;
    document.getElementById("input1").value = "";
    setImage(imageurl);
    setFile(imageurl);
    console.log(imageurl);
    setDisabled1(true);
    setStatus();
    setAnalysis([]);
  };

  let reset = () => {
    setDisabled1(false);
    setDisabled2(false);
    setDisabled3(true);
    setDisabled4(true);
    setDisabled5(false);
    setImage();
    setStatus("Form Reset!");
    setProgress(0);
    setAnalysis([]);
    document.getElementById("input1").value = "";
    document.getElementById("input2").value = "";
  };

  useEffect(() => {
    let inputDisable = () => {
      if (disabled1 === true) {
        setDisabled2(false);
      } else if (disabled2 === true) {
        setDisabled1(false);
      }
    };

    let submitDisable = () => {
      disabled2 === true || disabled1 === true
        ? setDisabled3(false)
        : setDisabled3(true);
    };

    inputDisable();
    submitDisable();
  });

  const getAnalysis = () => {
    Axios.get("http://localhost:3001/analyse").then((resp) => {
      setAnalysis(resp);
      console.log(resp);
    });
    setDisabled4(true);
    setDisabled5(true);
    setProgress(0);
    setStatus();
  };

  const submitImage = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("file", file);
    console.log(file);

    await Axios.post("http://localhost:3001/upload", data)
      .then((res) => {
        console.log(res);
        reset();
        setStatus(res.data);
        const timer = setInterval(() => {
          setProgress((prevProgress) =>
            prevProgress >= 100 ? 100 : prevProgress + 10
          );
        }, 500);
        setTimeout(() => {
          setStatus("Analysis underway...");
        }, 2500);
        setTimeout(() => {
          setDisabled4(false);
          clearInterval(timer);
          setStatus("Analysis Complete!");
          setProgress(0);
        }, 5300);
      })
      .catch((err) => {
        console.log(err);
        setStatus(err);
      });
  };

  return (
    <div className="App">
      <div>
        {/* <div className="form-container"> */}
        <h1 className="main-title">Turners Image Recognition</h1>
        <div className="inner-container">
          <form action="#">
            <h2 className="title">Upload a local file:</h2>
            <input
              type="file"
              name="filename"
              id="input1"
              className="custom-file-input"
              accept="image/*"
              onChange={loadFile}
              disabled={disabled1}
            />
            <br />
            <h2 className="title">Upload an online image:</h2>
            <input
              type="text"
              id="input2"
              name="url"
              placeholder="http://coolcarpics.com/audi.jpg"
              onChange={loadFile2}
              disabled={disabled2}
            />
            <br />

            <button disabled={disabled3} onClick={submitImage}>
              Send Image
            </button>
            <button disabled={disabled4} onClick={getAnalysis}>
              Get Analysis
            </button>
            <input type="reset" id="reset" value="Reset form" onClick={reset} />
          </form>
          <h2 className="status">{status}</h2>
          <div className={classes.root}>
            <CircularProgress variant="determinate" value={progress} />
          </div>
          <img id="output" alt="" src={image} />
          <div className="table-div">
            <table className="status">
              {disabled5 ? (
                <thead>
                  <tr>
                    <td className="table-head">Label</td>
                    <td className="table-head">Confidence</td>
                  </tr>
                </thead>
              ) : null}
              {analysis.data &&
                analysis.data.Labels.map((data, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td>{data.Name}</td>
                        <td>
                          {Math.round(
                            (data.Confidence + Number.EPSILON) * 100
                          ) / 100}
                          %
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default App;
