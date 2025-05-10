"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import axios from "axios";
import TimmerComponent from "./_components/TimmerComponent";
import { getVapiClient } from "@/lib/vapiconfig";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapi = getVapiClient();
  const [activeUser, setActiveUser] = useState(false);
  const [start, setStart] = useState(false);
  const [subtitles, setSubtitles] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const conversation = useRef(null);
  const { interview_id } = useParams();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({
    picture: null,
    name: "Candidate"
  });

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window !== 'undefined') {
          const googleProfile = localStorage.getItem('googleProfile');
          if (googleProfile) {
            const { picture, name } = JSON.parse(googleProfile);
            setUserProfile(prev => ({
              ...prev,
              picture,
              name: name || prev.name
            }));
          }
        }

        if (interviewInfo?.candidate_name) {
          setUserProfile(prev => ({
            ...prev,
            name: interviewInfo.candidate_name
          }));
        }

        if (!interviewInfo?.jobPosition) throw new Error("Job position missing");
        if (!vapi) throw new Error("Voice assistant unavailable");

        setIsLoading(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    };
    init();
  }, [interviewInfo, vapi]);

  useEffect(() => {
    if (!isLoading && interviewInfo?.jobPosition && vapi && !start) {
      startInterview();
    }
  }, [isLoading, interviewInfo, vapi, start]);

  const startInterview = async () => {
    try {
      setStart(true);
      const questions = interviewInfo.questionList.interviewQuestions
        .map(item => item?.question)
        .filter(Boolean)
        .join(",");

      const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: `Hi ${interviewInfo.candidate_name}, ready for your ${interviewInfo.jobPosition} interview?`,
        transcriber: { provider: "deepgram", model: "nova-3", language: "en-US" },
        voice: { provider: "vapi", voiceId: "Neha" },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [{
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey ${interviewInfo.candidate_name}! Welcome to your ${interviewInfo.jobPosition} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ${questions}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate's confidence level
✅ Ensure the interview remains focused on React
`.trim()
          }]
        }
      };

      await vapi.start(assistantOptions);
      toast.success("Interview started!");
    } catch (error) {
      toast.error("Failed to start interview");
      setStart(false);
    }
  };

  useEffect(() => {
    if (!vapi) return;

    const handleMessage = (message) => {
      if (message?.role === "assistant") setSubtitles(message.content || "");
      if (message?.conversation) {
        conversation.current = JSON.stringify(
          message.conversation.filter(msg => msg.role !== "system"), 
          null, 2
        );
      }
    };

    const callbacks = {
      "message": handleMessage,
      "call-start": () => { setStart(true); toast.success('Interview started!'); },
      "speech-start": () => { setIsSpeaking(true); setActiveUser(false); toast.info('AI is speaking...'); },
      "speech-end": () => { setIsSpeaking(false); setActiveUser(true); },
      "call-end": async () => { 
        toast.info('Generating feedback...'); 
        try {
          const { data } = await axios.post("/api/ai-feedback", {
            conversation: conversation.current,
          });
          const content = data?.content?.replace(/```json|```/g, "") || "";
          
          await supabase.from("interview-feedback").insert([{
            userName: interviewInfo.candidate_name,
            userEmail: interviewInfo.userEmail,
            interview_id,
            feedback: JSON.parse(content),
            recommended: false,
          }]);

          router.replace(`/interview/${interviewInfo.interview_id}/completed`);
          toast.success("Feedback generated!");
        } catch (error) {
          toast.error("Feedback generation failed");
        }
      }
    };

    Object.entries(callbacks).forEach(([event, callback]) => {
      vapi.on(event, callback);
    });

    return () => {
      Object.entries(callbacks).forEach(([event, callback]) => {
        vapi.off(event, callback);
      });
    };
  }, [vapi, interviewInfo, interview_id, router]);

  const stopInterview = () => {
    vapi?.stop();
    toast.info("Interview ended");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Loading interview session...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {interviewInfo.jobPosition} Interview Session
            </h1>
            <p className="text-gray-600">Powered by AI Interview Assistant</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <Timer className="text-blue-600" />
            <span className="font-mono text-lg font-semibold text-gray-700">
              <TimmerComponent start={start} />
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`bg-white rounded-xl p-6 shadow-md border transition-all duration-300 ${isSpeaking ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"}`}>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                {isSpeaking && <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75"></div>}
                <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-100">
                  <Image src="/squid.jpeg" alt="AI Recruiter" width={80} height={80} className="object-cover w-full h-full" priority />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">AI Recruiter</h2>
              <p className="text-sm text-gray-500">Interview HR</p>
            </div>
          </div>

          <div className={`bg-white rounded-xl p-6 shadow-md border transition-all duration-300 ${activeUser ? "border-purple-300 ring-2 ring-purple-100" : "border-gray-200"}`}>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                {activeUser && <div className="absolute inset-0 rounded-full bg-purple-100 animate-ping opacity-75"></div>}
                <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                  {userProfile.picture ? (
                    <Image src={userProfile.picture} alt={userProfile.name} width={80} height={80} className="object-cover" priority />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{userProfile.name}</h2>
              <p className="text-sm text-gray-500">Candidate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="min-h-16 flex items-center justify-center">
            {subtitles ? (
              <p className="text-center text-gray-700 animate-fadeIn">"{subtitles}"</p>
            ) : (
              <p className="text-center text-gray-400">
                {isSpeaking ? "AI is speaking..." : "Waiting for response..."}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="flex gap-4 mb-4">
              <AlertConfirmation stopInterview={stopInterview}>
                <button className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 shadow-sm transition-all flex items-center gap-2">
                  <Phone size={20} />
                  <span>End Interview</span>
                </button>
              </AlertConfirmation>
            </div>
            <p className="text-sm text-gray-500">
              {activeUser ? "Please respond..." : "AI is speaking..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;