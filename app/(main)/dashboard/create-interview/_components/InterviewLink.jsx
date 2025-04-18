import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

function InterviewLink({ interviewId, formData }) {

    const GetInterviewUrl=async()=>{
        const url=process.env.NEXT_PUBLIC_URL+'/'+interviewId;
        return url;


    }

  return (
    <div className="flex flex-col items-center w-full justify-center mt-10">
      <Image
        src="/tick.gif"
        alt="check"
        width={200}
        height={200}
        className="w-[50px] h-[50px]"
      />
      <h2 className="font-bold text-lg mt-4">Your AI Interview is Ready!!!</h2>
      <p className="mt-3">Share this link with the candidate to start the interview process</p>
      <div className="w-full p-7 mt-6 rounded-xl bg-blue-50">
        <div className="flex justify-between items-center">
          <h2 className='font-bold'>Interview Link</h2>
          <h2 className="p-1 px-2 text-blue-600 bg-blue-100 rounded-xl">Valid for 30 days</h2>
          
          <div className='mt-3 flex gap-3'>
            <Input defaultValue={GetInterviewUrl()} disabled={true} />
            <Button> <Copy/> Copy Link </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InterviewLink;
