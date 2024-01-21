"use client";

import React, { useState, useEffect } from "react";
import { useRecordVoice } from "@/hooks/useRecordVoice";
import { IconMicrophone } from "@/app/components/IconMicrophone";
import { Spinner } from "@/app/components/Spinner";
import Mermaid from "../components/Mermaid";
// import { testText } from "./constants";
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

const SVGComponent = ({ svgString }) => (
  <div dangerouslySetInnerHTML={{ __html: svgString }} />
);

function createWordCloud(
  testText,
  callback,
  width = 1000,
  height = 1000,
  fontScale = 15
) {
  const requestData = {
    format: "png",
    width: width,
    height: height,
    fontFamily: "sans-serif",
    fontScale: fontScale,
    scale: "sqrt",
    // scale: "log",
    // scale: "linear",
    text: testText,
    removeStopwords: true,
    // useWordList: true,
  };

  fetch("https://quickchart.io/wordcloud", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      callback(imageUrl);
    })
    .catch((error) => console.error("Error:", error));
}

const KeyGen = () => {
  const { startRecording, stopRecording, text } = useRecordVoice();
  const [oldWordCloudImage, setOldWordCloudImage] = useState("");
  const [newWordCloudImage, setNewWordCloudImage] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [svgString, setSvgString] = useState("");
  const [mermaidString, setMermaidString] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isRecording, setIsRecording] = useState(false); // Loading state
  const [componentDidMount, setComponentDidMount] = useState(false); //

  function replaceSemicolonWithNewline(inputString) {
    return inputString.replace(/;/g, "\n");
  }

  function processTranscript(
    textToProcess,
    setNewWordCloudImage,
    setOldWordCloudImage,
    setIsLoading,
    createWordCloud
  ) {
    if (textToProcess) {
      setIsLoading(true); // Start loading

      fetch("/api/processTranscript/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: textToProcess }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          // Set the payload to the mermaid here!
          console.log(replaceSemicolonWithNewline(data.loopOutput.mermaid));
          // setMermaidString(
          //   replaceSemicolonWithNewline(data.loopOutput.mermaid)
          // );
          setMermaidString(tempChartDefinition);
          setSummaryText(data.loopOutput.summary);
          createWordCloud(data.loopOutput, (imageUrl) => {
            setNewWordCloudImage(imageUrl); // Handle the new image URL
          });
          setIsLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false); // Stop loading on error
        });

      // Usage example
      createWordCloud(textToProcess, (imageUrl) => {
        setOldWordCloudImage(imageUrl); // Handle the old image URL
      });
    }
  }

  useEffect(() => {
    setComponentDidMount(true);
  }, []);

  // useEffect(() => {
  //   console.log("send started");
  //   processTranscript(
  //     text,
  //     setNewWordCloudImage,
  //     setOldWordCloudImage,
  //     setIsLoading,
  //     createWordCloud
  //   );
  // }, [text]);

  const chartDefinition = `
    sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: I am good thanks!
   `;
  const tempChartDefinition = `
  erDiagram
    Communication ||--o{ StudentSuccess : "vital_for"
    StudentSuccess ||--o{ SpeakingAbility : "determined_by"
    StudentSuccess ||--o{ WritingAbility : "determined_by"
    StudentSuccess ||--o{ QualityOfIdeas : "determined_by"
    SpeakingAbility ||--o{ Knowledge : "contributes_to"
    SpeakingAbility ||--o{ Practice : "contributes_to"
    SpeakingAbility ||--o{ Talent : "contributes_to"
    WritingAbility ||--o{ Knowledge : "contributes_to"
    WritingAbility ||--o{ Practice : "contributes_to"
    WritingAbility ||--o{ Talent : "contributes_to"
    QualityOfIdeas ||--o{ SpeakingTechniques : "supported_by"
    SpeakingTechniques ||--o{ Technique : "includes"
    Technique ||--o{ Heuristic : "example_of"
    Technique ||--o{ JobOpportunity : "leads_to"
    JobOpportunity ||--o{ NonLinearProcess : "involves"
    Communication ||--o{ RuleOfEngagement : "requires"
    RuleOfEngagement ||--o{ NoLaptops : "includes"
    RuleOfEngagement ||--o{ NoCellPhones : "includes"

`;
  return (
    <div className="flex flex-col justify-center items-center min-w-full">
      <h1 class="text-4xl font-bold text-gray-800 my-16">Key Concept Gen</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {/* Transcript */}
          <div className="flex items-start space-x-4 mb-4 ">
            <div className="flex justify-center items-center w-screen">
              {" "}
              {/* Outer wrapper with half screen width */}
              {/* Added bottom margin to space out from the button */}
              <div className="w-1/2">
                <form action="#" className="relative mb-6 min-w-full">
                  <div className="rounded-lg overflow-hidden shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label htmlFor="comment" className="sr-only">
                      Add your comment
                    </label>
                    <textarea
                      rows={3}
                      name="comment"
                      id="comment"
                      className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Add your comment..."
                      defaultValue={""}
                      onChange={(e) => setTranscriptText(e.target.value)}
                    />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 flex justify-between py-2 pl-3 pr-2">
                    <div className="flex items-center space-x-5">
                      <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 -m-2.5 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <PaperClipIcon className="w-5 h-5" aria-hidden="true" />
                        <span className="sr-only">Attach a file</span>
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        processTranscript(
                          transcriptText,
                          setNewWordCloudImage,
                          setOldWordCloudImage,
                          setIsLoading,
                          createWordCloud
                        )
                      }
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Generate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {!isRecording ? (
            <button
              onClick={() => {
                setIsRecording(true);
                startRecording();
              }}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <p className="text-white">Start Recording</p>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsRecording(false);
                stopRecording();
              }}
              className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 animate-pulse"
            >
              <p className="text-white">Stop</p>
            </button>
          )}
          <p className="px-48 py-8 text-xl">{text}</p>
          <div className="flex justify-center items-center p-8 w-96 h-96">
            {/* <div className="flex justify-center items-center p-8 w-screen min-w-full min-h-full"> */}
            {componentDidMount && (
              <Mermaid chart={mermaidString || chartDefinition} />
            )}
          </div>
          <p className="px-48 py-8 text-xl">{summaryText}</p>
          {/* <button
            onMouseDown={() => {
              console.log("onMouseDown");
              startRecording();
            }}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className="border-none bg-transparent w-10 h-10"
            >
            <IconMicrophone />
          </button> */}
        </>
      )}
    </div>
  );
  // useEffect(() => {
  //   console.log("Sent text", testText);
  //   if (text) {
  //     // First, send the recorded text to the Magic Loops API
  //     console.log("Sent text", testText);

  //     fetch("/api/processTranscript/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ input: testText }),
  //     })
  //       .then((response) => response.text()) // Assuming the response is text (SVG string)
  //       .then((svgString) => {
  //         // Convert SVG string to Blob
  //         const blob = new Blob([svgString], { type: "image/svg+xml" });
  //         // Create URL from Blob
  //         const imageUrl = URL.createObjectURL(blob);
  //         console.log(imageUrl);
  //         // Set the URL to state
  //         setWordCloudImage(imageUrl);
  //       })
  //       .catch((error) => console.error("Error:", error));
  //   }
  // }, [text]);

  // return (
  //   <div className="flex flex-col justify-center items-center">
  //     <button
  //       onMouseDown={startRecording}
  //       onMouseUp={stopRecording}
  //       onTouchStart={startRecording}
  //       onTouchEnd={stopRecording}
  //       className="border-none bg-transparent w-10"
  //     >
  //       <IconMicrophone />
  //     </button>
  //     <p>{text}</p>
  //     {wordCloudImage && <img src={wordCloudImage} alt="Word Cloud" />}
  //   </div>
  // );
};

export default KeyGen;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useRecordVoice } from "@/hooks/useRecordVoice";
// import { IconMicrophone } from "@/app/components/IconMicrophone";
// import { testText } from "./constants";

// const Microphone = () => {
//   const { startRecording, stopRecording, text } = useRecordVoice();
//   const [wordCloudImage, setWordCloudImage] = useState("");

//   useEffect(() => {
//     if (text) {
//       const requestData = {
//         format: "png",
//         width: 1000,
//         height: 1000,
//         fontFamily: "sans-serif",
//         fontScale: 15,
//         scale: "linear",
//         text: testText,
//         // text: text,
//       };

//       fetch("https://quickchart.io/wordcloud", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       })
//         .then((response) => response.blob())
//         .then((blob) => {
//           const imageUrl = URL.createObjectURL(blob);
//           setWordCloudImage(imageUrl);
//         })
//         .catch((error) => console.error("Error:", error));
//     }
//   }, [text]);

//   return (
//     <div className="flex flex-col justify-center items-center">
//       <button
//         onMouseDown={startRecording}
//         onMouseUp={stopRecording}
//         onTouchStart={startRecording}
//         onTouchEnd={stopRecording}
//         className="border-none bg-transparent w-10"
//       >
//         <IconMicrophone />
//       </button>
//       <p>{text}</p>
//       {wordCloudImage && <img src={wordCloudImage} alt="Word Cloud" />}
//     </div>
//   );
// };

// export { Microphone };

// import { useRecordVoice } from "@/hooks/useRecordVoice";
// import { IconMicrophone } from "@/app/components/IconMicrophone";
// import { useState, useEffect } from "react";
// import { testText } from "./constants";

// const Microphone = () => {
//   const { startRecording, stopRecording, text } = useRecordVoice();
//   // const [wordCloudUrl, setWordCloudUrl] = useState("");
//   const url = `https://quickchart.io/wordcloud?format=svg&text=${encodeURIComponent(
//     testText
//   )}`;
//   const [wordCloudUrl, setWordCloudUrl] = useState(url);

//   // setWordCloudUrl(url);

//   // useEffect(() => {
//   //   if (text) {
//   //     const url = `https://quickchart.io/wordcloud?format=svg&text=${encodeURIComponent(
//   //       text
//   //     )}`;
//   //     setWordCloudUrl(url);
//   //   }
//   // }, [text]);

//   return (
//     <div className="flex flex-col justify-center items-center">
//       <button
//         onMouseDown={startRecording}
//         onMouseUp={stopRecording}
//         onTouchStart={startRecording}
//         onTouchEnd={stopRecording}
//         className="border-none bg-transparent w-10"
//       >
//         <IconMicrophone />
//       </button>
//       <p>{text}</p>
//       {wordCloudUrl && <img src={wordCloudUrl} alt="Word Cloud" />}
//     </div>
//   );
// };

// export { Microphone };
