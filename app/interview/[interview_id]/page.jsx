'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, Info, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'

function Interview() {
  const params = useParams();
  const interview_id = params?.interview_id;

  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Params:", params);
    console.log("Interview ID:", interview_id);

    if (interview_id) {
      GetInterviewDetails();
    }
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const { data: interviews, error } = await supabase
        .from('interviews')
        .select("jobPosition, jobDescription, duration, type")
        .eq('interview_id', interview_id);

      if (error) {
        console.error("Supabase Error:", error);
        toast('Failed to fetch interview details');
        setLoading(false);
        return;
      }

      if (interviews && interviews.length > 0) {
        setInterviewData(interviews[0]);
        console.log("Interview Details:", interviews[0]);
      } else {
        toast('No interview found');
        console.warn("No interview found with ID:", interview_id);
      }
    } catch (e) {
      console.error("Unexpected Error:", e);
      toast('Incorrect Interview Link');
    }
    setLoading(false);
  };

  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-80 mt-7">
      <div className="flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-33 xl:px-52 mb-20">
        <Image
          src="/logo.jpeg"
          alt="Logo"
          width={100}
          height={100}
          className="mb-4"
        />

        <h2 className="text-xl font-semibold text-gray-800 text-center">
          AI-Powered Interview Platform
        </h2>

        <Image
          src="/interview.jpeg"
          alt="Interview"
          width={250}
          height={250}
          className="my-6"
        />

        <h3 className="text-2xl font-bold text-gray-900 text-center">
          {interviewData?.jobPosition || "Loading..."}
        </h3>

        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <Clock className="h-4 w-4" />
          <span>{interviewData?.duration || "..."}</span>
        </div>

        <div className="w-full mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Enter your Full Name
          </label>
          <Input 
            placeholder="e.g. Sujeeth Kumar" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)} 
          />
        </div>

        <div className="w-full mt-6 p-4 bg-blue-100 rounded-lg flex items-start gap-3">
          <Info className="mt-1 text-blue-500" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Before you begin:</h4>
            <ul className="list-disc ml-5 text-sm text-blue-800 space-y-1">
              <li>Test your camera and microphone</li>
              <li>Ensure you have a stable internet connection</li>
              <li>Find a quiet place for the interview</li>
            </ul>
          </div>
        </div>

        <Button className="mt-6 w-full font-bold flex items-center justify-center gap-2">
          <Video className="w-4 h-4" /> Join Interview
        </Button>
      </div>
    </div>
  )
}

export default Interview
