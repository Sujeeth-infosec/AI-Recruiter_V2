import Image from 'next/image';
import React from 'react';

function InterviewLink(interviewId, formData) {
  return (
    <div className='flex flex-col items-center w-full justify-center mt-10'>
        <Image src={'/tick.gif'} alt='check'
        width={200} height={200}
        className='w-[50px] h-[50px]'/>
    <h2 className='font-bold text-lg mt-4'>Your AI Interview is Ready!!!</h2>
    <p className='mt-3'>Share this link with the candidate to start the interview process</p>
    <div>
        <div>
            <h2>Interview Link</h2>
        </div>
    </div>
    </div>
  );
}

export default InterviewLink;