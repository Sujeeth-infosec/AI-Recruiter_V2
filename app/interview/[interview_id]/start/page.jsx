'use client';

import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import Vapi from "@vapi-ai/web";
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  const [activeUser, setActiveUser] = useState(false);
  

  useEffect(() => {
    interviewInfo && startCall();
  }, [interviewInfo]);

  useEffect(() => {
    console.log(Vapi)
    if (!vapi && !interviewInfo) {
      return;
    }
    // const stopInterview = async () => {
    //     vapi.stop();
    //   };
    console.log('error')
      vapi.on("call-start", () => {
        console.log("Call has started.");
        toast('Call Connected...');
      });
    
      vapi.on("speech-start", () => {
        console.log("Assistant speech has started.");
        setActiveUser(false);
      });
    
      vapi.on("speech-end", () => {
        console.log("Assistant speech has ended.");
        setActiveUser(true);
      });
    
      vapi.on("call-end", () => {
        console.log("Call has ended.");
        toast('Interview Ended');
      });
  }, [vapi]);

  const startCall = async () => {
    let questionList = "";

    interviewInfo?.questionList.forEach((item) => {
      questionList += item?.question + ", ";
    });

    await vapi.start('4097bae4-c54a-4cae-92a1-08e7b2722e5b');
  };



  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI Interview Session
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
              {interviewInfo?.userName?.[0]}
            </h2>
            <h2>{interviewInfo?.userName}</h2>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-5 mt-7 items-center justify-center">
        <Phone className="h-10 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
        <Mic className="h-10 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
      </div>

      <h2 className="text-center text-sm text-gray-400 mt-5">
        Interview in progress...
      </h2>
    </div>
  );
}

export default StartInterview;
