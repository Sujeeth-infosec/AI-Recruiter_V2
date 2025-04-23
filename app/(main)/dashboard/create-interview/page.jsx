'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress'; // This is from ShadCN
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
import InterviewLink from './_components/InterviewLink';

function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [interviewId, setInterviewId]=useState();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
       ...prev, 
       [field]: value
      }));

    console.log("Formdata", formData);

  };

  const onGoToNext = () => {
    let missingField = '';

    if(!formData.jobPosition) missingField += 'jobPosition';
    else if(!formData.jobDescription) missingField += 'jobDescription';
    else if(!formData.duration) missingField += 'duration';
    else if(!formData.type) missingField += 'type';

    if(missingField){
      toast.error( `${missingField} is required` || "All fields are required")
      return;
    }
    setStep(step+1)
  }
  const onCreateLink=(interview_id)=>{
    setInterviewId(interview_id);
    setStep(step+1);

  }

  return (
    <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
      <div className="flex gap-5 items-center">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="font-bold text-2xl">Create New Interview</h2>
      </div>
      <Progress value={step*33.33} className="my-5 h-2 w-full" />
      {step == 1 ? <FormContainer
      onHandleInputChange={onHandleInputChange} 
      GoToNext={() => onGoToNext()} />
        : step == 2 ? <QuestionList formData={formData} onCreateLink={(interview_id)=>onCreateLink(interview_id)}/> : 
        step == 3 ? <InterviewLink interview_id={interviewId}
        formData={formData} 
        /> :null }
    </div>
  );
}

export default CreateInterview;
