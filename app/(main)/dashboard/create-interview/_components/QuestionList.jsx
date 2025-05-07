"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user } = useUser();
  const hasCalled = useRef(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("behavioral");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  useEffect(() => {
    if (formData && !hasCalled.current) {
      GenerateQuestionList();
    }
    console.log("formData questionList", formData);
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    hasCalled.current = true;
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      const rawContent = result?.data?.content || result?.data?.Content;

      if (!rawContent) {
        toast("Invalid response format");
        console.error('Missing "content" or "Content" field in response');
        return;
      }

      const match = rawContent.match(/```json\s*([\s\S]*?)\s*```/);

      if (!match || !match[1]) {
        toast("Failed to extract question list");
        console.error("No valid JSON block found in response");
        return;
      }

      const parsedData = JSON.parse(match[1].trim());
      setQuestionList(parsedData);
    } catch (e) {
      toast("Server Error, Try Again");
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
      .from("Interviews")
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id: interview_id,
        },
      ])
      .select();

    // Update user credentials
    const userUpdate = await supabase
      .from("Users")
      .update({ credits: Number(user?.credits) - 1 })
      .eq("email", user?.email)
      .select();

    console.log(userUpdate);

    setSaveLoading(false);

    onCreateLink(interview_id);

    if (error) {
      toast("Failed to save interview");
      console.error(error);
    } else {
      toast("Interview saved successfully!");
      console.log(data);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast("Please enter a question");
      return;
    }

    const updatedQuestionList = { ...questionList };
    updatedQuestionList.interviewQuestions = [
      ...updatedQuestionList.interviewQuestions,
      {
        question: newQuestion,
        type: newQuestionType,
      },
    ];

    setQuestionList(updatedQuestionList);
    setNewQuestion("");
    setNewQuestionType("behavioral");
    setIsAddingQuestion(false);
    toast("Question added successfully");
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestionList = { ...questionList };
    updatedQuestionList.interviewQuestions = [
      ...updatedQuestionList.interviewQuestions.slice(0, index),
      ...updatedQuestionList.interviewQuestions.slice(index + 1),
    ];

    setQuestionList(updatedQuestionList);
    toast("Question deleted successfully");
  };

  return (
    <div>
      {loading && (
        <div className="flex flex-col items-center gap-4 mt-10">
          <Loader2Icon className="animate-spin w-6 h-6 text-blue-500" />
          <div className="p-5 bg-blue-50 rounded-xl border border-gray-100 flex flex-col gap-2 items-center text-center">
            <h2 className="font-semibold text-lg">
              Generating Interview Questions
            </h2>
            <p className="text-sm text-gray-600">
              Our AI is crafting personalized questions based on your job
              position
            </p>
          </div>
        </div>
      )}

      {!loading && questionList && questionList.interviewQuestions && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Generated Questions
            </h2>
            <Button
              onClick={() => setIsAddingQuestion(true)}
              variant="outline"
              className="gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          {isAddingQuestion && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">Add New Question</h3>
              <div className="flex flex-col gap-3">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter your question"
                />
                <Select
                  value={newQuestionType}
                  onValueChange={setNewQuestionType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="situational">Situational</SelectItem>
                    <SelectItem value="cultural-fit">Cultural Fit</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button onClick={handleAddQuestion}>Add Question</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingQuestion(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {questionList.interviewQuestions.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-start group"
              >
                <div>
                  <p className="font-medium">
                    {index + 1}. {item.question}
                  </p>
                  <p className="text-sm text-primary">Type: {item.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                  onClick={() => handleDeleteQuestion(index)}
                >
                  <Trash2Icon className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-10">
            <Button onClick={onFinish} disabled={saveLoading}>
              {saveLoading ? "Saving..." : "Create Interview Link & Finish"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;