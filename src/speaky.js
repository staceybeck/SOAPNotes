import React, { useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./App.css";
import ky from "ky";
import microPhoneIcon from "./microphone.png";
import { Oval } from "react-loading-icons";

const Speaky = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [note, setNote] = useState(null);
  const [textEnabled, setTextEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  const [loading, setLoading] = useState(false);
  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return (
      <div className="mircophone-container">
        Your browser does not support speech recognition. Please try this using
        Chrome or Safari.
      </div>
    );
  }
  const handleListing = () => {
    console.log("handleListing");
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    if (SpeechRecognition.browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.startListening({ continuous: false });
    }
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
    setNote(null);
  };
  const handleOutput = async () => {
    setNote(null);
    setLoading(true);
    //json output
    const data = await ky
      .post("https://soapnotes-development-service.onrender.com/analyze", {
        json: {
          q: transcript,
        },
        timeout: false,
      })
      .json();
    setNote(data.text);
    setLoading(false);
    setTextEnabled(true);
  };
  const handleText = async () => {
    setTextEnabled(false);

    await ky.post("https://soapnotes-development-service.onrender.com/text", {
      json: { q: note },
      timeout: false,
    });
  };

  return (
    <div className="microphone-wrapper">
      <div className="mircophone-container">
        <div
          className="microphone-icon-container"
          ref={microphoneRef}
          onClick={handleListing}
        >
          <img
            src={microPhoneIcon}
            className="microphone-icon"
            alt="Microphone"
          />
        </div>
        <div className="microphone-status">
          {isListening ? "Listening..." : "Press to Record"}
        </div>
        {isListening && (
          <button className="microphone-stop btn" onClick={stopHandle}>
            Pause Recording
          </button>
        )}
        {
          <button className="microphone-reset btn" onClick={handleReset}>
            Reset Note
          </button>
        }
        {
          <button className="generative-outputs btn" onClick={handleOutput}>
            {loading ? (
              <Oval stroke="#fff" strokeWidth="10" height="20px" width="20px" />
            ) : (
              "Generate Note"
            )}
          </button>
        }
        {
          <button
            className="output-text btn"
            onClick={handleText}
            disabled={!textEnabled}
          >
            Text Note
          </button>
        }
      </div>
      {transcript && (
        <div className="microphone-result-container">
          {
            <div style={{ fontWeight: "bold", marginBottom: 15 }}>
              Dictation:
            </div>
          }
          <div className="microphone-result-text">{transcript}</div>
        </div>
      )}
      {note && (
        <div className="generative-outputs-container">
          {
            <div style={{ fontWeight: "bold", marginBottom: 15 }}>
              Generated Note:
            </div>
          }
          {note.split("\n").map((line, index) => (
            <div
              key={index}
              className="generative-outputs-text"
              style={{ marginBottom: 10 }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Speaky;
