'use client';
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { Clock, Info, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';  // Use useRouter directly from 'next/navigation'
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { InterviewDataContext } from '@/context/InterviewDataContext';

function Interview() {
  const params = useParams();
  const interview_id = params?.interview_id;
    console.log(interview_id)
  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState([]);
  const [UserEmail,setUserEmail] = useState();
  const [loading, setLoading] = useState(false);
  const context = useContext(InterviewDataContext);
  const [interviewInfo, setInterviewInfo] = useState(context);

  // Directly use useRouter inside the component, no need for dynamic import
  const router = useRouter();

  useEffect(() => {
    if (interview_id) {
      GetInterviewDetails();
    }
  }, [interview_id]);

  useEffect(() => {
    console.log(userName)
    }, [userName]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      console.log(userName)
      console.log("Fetching interview details for interview_id:", interview_id);
      await supabase.from('Interviews').update({ candidate_name: userName[0] }).eq('interview_id', interview_id).select()
      const { data: Interviews, error } = await supabase
        .from('Interviews')
        .select('jobPosition, jobDescription, duration, type')
        .eq('interview_id', interview_id);

      if (error) {
        console.error('Supabase Error:', error);
        toast('Failed to fetch interview details');
      } else if (!Interviews || Interviews.length === 0) {
        console.log('No interview data found for interview_id:', interview_id);
        toast('Incorrect Interview Link');
      } else {
        setInterviewData(Interviews[0]);
        console.log("Fetched Interview Data:", Interviews[0]);
      }
    } catch (e) {
      console.error('Unexpected Error:', e);
      toast('Unexpected error occurred');
    }
    setLoading(false);
  };

  const onJoinInterview = async () => {
    if (!userName) {
      toast('Please enter your name');
      return;
    }

    await supabase.from('Interviews').update({ candidate_name: userName}).eq('interview_id', interview_id).select()
    const { data: Interviews, error } = await supabase
      .from('Interviews')
      .select('*')
      .eq('interview_id', interview_id);

    if (error) {
      console.error('Supabase Error during Join:', error);
      toast('Failed to join interview');
    } else if (Interviews && Interviews.length > 0) {
      console.log("Joining interview:", Interviews[0]);
      setInterviewInfo(Interviews[0]);
      router.push('/interview/' + interview_id + '/start');
      toast('Joining interview...');
    } else {
      toast('Interview not found');
    }
  };

  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-80 mt-7">
      <div className="flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-33 xl:px-52 mb-20">
        <Image src="/logo.jpeg" alt="Logo" width={100} height={100} className="mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 text-center">AI-Powered Interview Platform</h2>
        <Image src="/interview.jpeg" alt="Interview" width={250} height={250} className="my-6" />

        <h3 className="text-2xl font-bold text-gray-900 text-center">
          {interviewData?.jobPosition || 'Loading...'}
        </h3>

        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <Clock className="h-4 w-4" />
          <span>{interviewData?.duration || '...'}</span>
        </div>

        <div className="w-full mt-6">
          <label className="block text-gray-700 font-medium mb-2">Enter your Full Name</label>
          <Input
            placeholder="e.g. Sujeeth Kumar"
            value={userName}
            onChange={(event) => setUserName([event.target.value])}
          />
        </div>

        <div className="w-full mt-6">
          <label className="block text-gray-700 font-medium mb-2">Enter your Email</label>
          <Input
            placeholder="e.g. SujeethKumararjun@gmail.com"
            value={userName}
            onChange={(event) => setUseremail([event.target.value])}
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

        <Button
          className="mt-6 w-full font-bold flex items-center justify-center gap-2"
          disabled={loading || !userName}
          onClick={onJoinInterview}
        >
          <Video className="w-4 h-4" /> Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;