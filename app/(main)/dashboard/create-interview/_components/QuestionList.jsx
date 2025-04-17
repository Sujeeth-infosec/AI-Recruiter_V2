import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function QuestionList({ formData }) {
  const [loading, setLoading] = useState(true);
  const [questionList,setQuestionList]=useState();

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
      console.log(result.data.Content);
      const Content=JSON.parse(result.data.Content);
      
      setQuestionList(Content);
      setLoading(false);
    } catch (e) {
      toast('Server Error, Try Again');
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
    </div>
  );
}

export default QuestionList;
