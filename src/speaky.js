import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./App.css";
import microPhoneIcon from "./microphone.png";
import { useMediaQuery } from 'react-responsive'

const Speaky = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [note, setNote] = useState(null);
  const [textEnabled, setTextEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    console.log("handleListing");
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
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
    //json output
    const response = await fetch(
      "https://soapnotes-development-service.onrender.com/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: transcript }),
      }
    );
    const data = await response.json();
    setNote(data.text);
    setTextEnabled(true);
  };
  const handleText = async () => {
    setTextEnabled(false);

    try {
      const resp = await fetch(
        "https://soapnotes-development-service.onrender.com/text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q: note }),
        }
      );

      if (!resp.ok) {
        const resp3 = await fetch(
          "https://soapnotes-development-service.onrender.com/text",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: note }),
          }
        );
      }
    } catch (e) {
      const resp2 = await fetch(
        "https://soapnotes-development-service.onrender.com/text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q: note }),
        }
      );
    }
  };
  return (
    <div className="microphone-wrapper">
      <div className="mircophone-container">
        <div
          className="microphone-icon-container"
          ref={microphoneRef}
          onClick={handleListing}
        >
          <img src={microPhoneIcon} className="microphone-icon" />
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
            Generate Note
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
