'use client';

import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import Vapi from "@vapi-ai/web";
import QuestionList from '@/app/(main)/dashboard/create-interview/_components/QuestionList';


function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  const [activeUser, setActiveUser] = useState(false);

  useEffect(()=>{
    interviewInfo&&startCall();
  },[interviewInfo])

  const startCall=()=>{
    let questionList;
    interviewInfo?.interviewData?.questionList.forEach((item, index)=>(
      questionList=item+','+questionList
    ));
    console.log(questionList);
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
        <Phone className="h-10 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer" />
        <Mic className="h-10 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
      </div>

      <h2 className="text-center text-sm text-gray-400 mt-5">Interview in progress...</h2>
    </div>
  );
}

export default StartInterview;
