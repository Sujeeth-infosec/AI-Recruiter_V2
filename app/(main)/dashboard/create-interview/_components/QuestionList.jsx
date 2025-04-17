import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function QuestionList({ formData }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState(null);

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

      console.log("API Response:", result.data);

      const rawContent = result.data.content || result.data.Content;

      if (!rawContent) {
        toast('Invalid response format');
        console.error('Missing "content" or "Content" field in response');
        return;
      }

      // Extract JSON block between ```json and ```
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

      {questionList && questionList.interviewQuestions && (
        <div className="mt-10 space-y-4">
          {questionList.interviewQuestions.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="font-medium">{index + 1}. {item.question}</p>
              <p className="text-sm text-gray-500">Type: {item.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionList;
