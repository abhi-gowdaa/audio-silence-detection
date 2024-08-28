import React, { useState } from "react";
import axios from "axios";
import "./AudioUpload.css";
import TimeDipGraph from "./TimeDipGraph";

const AudioUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [timeRanges, setTimeRanges] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading,setLoading]=useState(false)
  
  //response
  const resFunction = (response) => {
    const [totalTime, stamp] = response;
    setTotalTime(totalTime);
    setTimeRanges(stamp);
  };

  //
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select an audio file first.");
      return;
    }

    const formData = new FormData();
    setTotalTime(0);
    setLoading(true);
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "https://audio-backendd.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
       setLoading(false);
      resFunction(response.data);
      console.log(uploadStatus);
    } catch (error) {
      setLoading(false);
      setUploadStatus("Error uploading file.");
    }
  };

  return (
    <>
      <div style={{ marginLeft: "15px" }}>
        <TimeDipGraph timeRanges={timeRanges} totalTime={totalTime} />
      </div>
      <div className="upload-container">
       <h2 className="upload-heading">{loading?"Loading...":"Upload an Audio File"}</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={onFileChange}
          className="file-input"
        />
        <button onClick={onFileUpload} className="upload-button">
          Upload
        </button>
        {totalTime > 0 && (
          <div class="table-container">
            <table style={{ width: "80%" }}>
              <tr>
                <td>From</td>
                <td>To(in sec)</td>
              </tr>

              {totalTime > 0 &&
                timeRanges.map((time) => (
                  <>
                    <tr>
                      <td>{time[0]}</td>
                      <td>{time[1]}</td>
                    </tr>
                  </>
                ))}
            <p>Audio Length : {totalTime}sec</p>
            </table>
          </div>
        )}

      </div>
    </>
  );
};

export default AudioUpload;
