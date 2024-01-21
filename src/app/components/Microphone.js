"use client";

import React, { useState, useEffect } from "react";
import { useRecordVoice } from "@/hooks/useRecordVoice";
import { IconMicrophone } from "@/app/components/IconMicrophone";
import { Spinner } from "@/app/components/Spinner";
import { testText } from "./constants";

const SVGComponent = ({ svgString }) => (
  <div dangerouslySetInnerHTML={{ __html: svgString }} />
);

const Microphone = () => {
  const { startRecording, stopRecording, text } = useRecordVoice();
  const [oldWordCloudImage, setOldWordCloudImage] = useState("");
  const [svgString, setSvgString] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isRecording, setIsRecording] = useState(false); // Loading state

  useEffect(() => {
    console.log("send started");
    if (text) {
      setIsLoading(true); // Start loading
      fetch("/api/processTranscript/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: testText }),
        // body: JSON.stringify({ input: text }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSvgString(data.loopOutput);
          setIsLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false); // Stop loading on error
        });
    }
    const requestData = {
      format: "png",
      width: 1000,
      height: 1000,
      fontFamily: "sans-serif",
      fontScale: 15,
      scale: "linear",
      text: testText,
      // text: text,
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
        setOldWordCloudImage(imageUrl);
      })
      .catch((error) => console.error("Error:", error));
  }, [text]);

  return (
    <div className="flex flex-col justify-center items-center">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {!isRecording ? (
            <button
              onClick={() => {
                setIsRecording(true);
                startRecording();
              }}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <p className="text-white">Start Recording</p>
              {/* <IconMicrophone /> */}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsRecording(false);
                stopRecording();
              }}
              className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 animate-pulse"
            >
              <p className="text-white"> Stop</p>
              {/* <IconStop /> */}
            </button>
          )}
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
          <p>{text}</p>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* LLM Processed Word Cloud */}
            <div className="flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 p-8">
              <p>LLM processed word Cloud</p>
              {svgString && <SVGComponent svgString={svgString} />}
            </div>

            {/* Pure Word Cloud */}
            <div className="flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 p-8">
              <p>Pure Word Cloud</p>
              {oldWordCloudImage && (
                <img
                  src={oldWordCloudImage}
                  alt="Word Cloud"
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex flex-row justify-center items-center space-x-4">
            {/* <div className="w-48 h-48 flex items-center justify-center overflow-hidden"> */}{" "}
            {/* Container for SVG */}
            <p>LLM processed word Cloud</p>
            {svgString && (
              <div>
                <SVGComponent svgString={svgString} />
              </div>
            )}
            {/* </div> */}
            {/* <div className="w-48 h-48"> */} {/* Container for Image */}
            <p>Pure Word Cloud</p>
            {oldWordCloudImage && (
              <img
                src={oldWordCloudImage}
                alt="Word Cloud"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/* </div> */}
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

export { Microphone };

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
