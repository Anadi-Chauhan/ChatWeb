'use client'

import { useRef, useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { toast } from "sonner";

export default function VoiceMessage({setMessage}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };
  
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
  
        // Convert Blob to Base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64Audio = reader.result.split(",")[1]; // Remove the 'data:audio/webm;base64,' part
  
          // Set the message with Base64 audio
          setMessage((prevs) => {
            return {
              ...prevs,
              audioUrl: base64Audio,
            };
          });
        };
  
        reader.readAsDataURL(blob);
  
        // For preview purposes (optional)
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
  
        chunks.current = [];
      };
  
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast.error("Unable to access microphone!");
    }
  };
  

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    console.log(audioBlob)
  };
//   const handlePreview = () => {
//     if (!audioUrl) return;
//     const audio = new Audio(audioUrl);
//     audio.play();
//   };


  return (
    <div className="flex relative flex-col items-center gap-4">
      <div className="flex relative z-10 items-center gap-2">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="p-2 bg-red-500 text-white rounded-full"
          >
            <FaStop />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="p-2 bg-green-500 text-white rounded-full"
          >
            <FaMicrophone />
          </button>
        )}
      </div>
    </div>
  );
}
