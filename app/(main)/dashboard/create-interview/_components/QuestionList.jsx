'use client';
import { useUser } from '@/app/provider';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/services/supabaseClient';


function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', {
        ...formData,
      });

     /////////////

      const rawContent = result?.data?.content || result?.data?.Content;

      if (!rawContent) {
        toast('Invalid response format');
        console.error('Missing "content" or "Content" field in response');
        return;
      }

      const match = rawContent.match(/```json\s*([\s\S]*?)\s*```/);

      if (!match || !match[1]) {
        toast('Failed to extract question list');
        console.error('No valid JSON block found in response');
        return;
      }

      const parsedData = JSON.parse(match[1].trim());
      setQuestionList(parsedData);
    } catch (e) {
      toast('Server Error, Try Again');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();
    console.log(formData);

    const { data, error } = await supabase
      .from('Interviews')
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id: interview_id,
        },
      ])
      .select();

    setSaveLoading(false);

    onCreateLink(interview_id)

    if (error) {
      toast('Failed to save interview');
      console.error(error);
    } else {
      toast('Interview saved successfully!');
      console.log(data);
    }
  };

  return (
    <div>
      {loading && (
        <div className="flex flex-col items-center gap-4 mt-10">
          <Loader2Icon className="animate-spin w-6 h-6 text-blue-500" />
          <div className="p-5 bg-blue-50 rounded-xl border border-gray-100 flex flex-col gap-2 items-center text-center">
            <h2 className="font-semibold text-lg">Generating Interview Questions</h2>
            <p className="text-sm text-gray-600">
              Our AI is crafting personalized questions based on your job position
            </p>
          </div>
        </div>
      )}

      {!loading && questionList && questionList.interviewQuestions && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Generated Questions</h2>
          <div className="space-y-4">
            {questionList.interviewQuestions.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                <p className="font-medium">{index + 1}. {item.question}</p>
                <p className="text-sm text-primary">Type: {item.type}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-10">
            <Button onClick={onFinish} disabled={saveLoading}>
              {saveLoading ? 'Saving...' : 'Create Interview Link & Finish'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;