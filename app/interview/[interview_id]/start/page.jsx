'use client';

import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import Vapi from "@vapi-ai/web";
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';


function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  const [activeUser, setActiveUser] = useState(false);

  useEffect(()=>{
    console.log(interviewInfo);
    interviewInfo&&startCall();
  },[interviewInfo])

  const startCall=async()=>{
    const questionList = interviewInfo?.questionList?.interviewQuestions
            ?.map((item) => item?.question)
            ?.join(',');
    console.log(questionList);
    
   const assistantOptions = {
    name: "AI Recruiter",
    firstMessage: "Hi "+interviewInfo?.candidate_name+", how are you? Ready for your interview on "+interviewInfo?.jobPosition+"?",
    transcriber: {
        provider: "deepgram",
        model: "nova-3",
        language: "en-US",
    },
    voice: {
        provider: "vapi",
        voiceId: "Neha",
    },
    model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `
  You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your `+interviewInfo?.jobPosition+` interview. Let’s get started with a few questions!"
Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: `+questionList+`
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That’s a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate’s confidence level
✅ Ensure the interview remains focused on React`
.trim(),
            },
        ],
    },
};

  await vapi.start(assistantOptions);
  }

  vapi.on("call-start",()=> {
    toast.success("Call Connected...");
    
})

vapi.on("speech-start",()=> {
  toast.success("Voice connected...");
  
})
  const stopInterview=()=>{
    vapi.stop();
  }

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          00.00.00
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        {/* AI Recruiter Side */}
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>
            )}
            <Image
              src="/ai.jpg"
              alt="ai"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover relative z-10"
            />
          </div>
          <h2>AI Recruiter</h2>
        </div>

        {/* User Side */}
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>
            )}
            <h2 className="font-bold text-2xl bg-primary p-5 rounded-full">
              {interviewInfo?.userName}
            </h2>
            <h2>{interviewInfo?.userName}</h2>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-5 mt-7 items-center justify-center">
        <AlertConfirmation stopInterview={()=>stopInterview()}>
        <Phone className="h-10 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer" />
        </AlertConfirmation>
        <Mic className="h-10 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />

      </div>

      <h2 className="text-center text-sm text-gray-400 mt-5">Interview in progress...</h2>
    </div>
  );
}

export default StartInterview;
