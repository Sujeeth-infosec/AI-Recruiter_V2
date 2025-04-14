'use client';
import { Video } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

function LatestInterviewsList() {
  const [InterviewList, setInterviewList] = useState([]);

  return (
    <div className='my-5'>
      <h2 className='font-bold text-2xl mb-4'>Previously Created Interviews</h2>

      {InterviewList?.length === 0 && (
        <div className='p-5 flex flex-col items-center gap-3 text-center text-gray-500 bg-white border rounded-xl shadow-sm'>
          <Video className='text-primary h-10 w-10' />
          <h2 className='text-base'>You don't have any interview created</h2>
          <Button>+ Create New Interview</Button>
        </div>
      )}
    </div>
  );
}

export default LatestInterviewsList;
