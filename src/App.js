import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./App.css";
import Message from "./Message";

function App() {
  const videoRef = useRef(null);
  console.log(faceapi.nets);
  const MODEL_URL = process.env.PUBLIC_URL + "./models";
  const [detect, setDetect] = useState({});
  const [brk, setBrk] = useState(true);

  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);

  useEffect(() => {
    getVideo();
  }, [videoRef]);
  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play().then(() => {
          setInterval(async () => {
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();
            setDetect(detections[0].expressions);
            setBrk(!brk);
            // setBrk(
            //   (Number(detect.angry) * 0.1 +
            //     Number(detect.disgusted) * 0.2 +
            //     Number(detect.fearful) * 0.3 +
            //     Number(detect.sad) * 0.4) /
            //     4
            // );
            console.log(detections);
          }, 10);
        });
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  return (
    <>
      {brk ? (
        <div className="App">
          <h1>Video</h1>
          <video ref={videoRef} />
          <p1>Angry: {detect.angry}</p1>
          <p1>Disgusted: {detect.disgusted}</p1>
          <p1>Fearful: {detect.fearful}</p1>
          <p1>Happy: {detect.happy}</p1>
          <p1>Neutral: {detect.neutral}</p1>
          <p1>Sad: {detect.sad}</p1>
          <p1>Surprised: {detect.surprised}</p1>
        </div>
      ) : (
        <Message />
      )}
    </>
  );
}

export default App;
