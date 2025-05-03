import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

function CandidateFeedbackDialog({ candidate }) {
  // Safely extract and normalize feedback data
  const feedback = candidate?.feedback?.feedback || {};
  const rating = feedback?.rating || {
    TechnicalSkills: 0,
    Communication: 0,
    ProblemSolving: 0,
    Experience: 0,
    Behavioral: 0,
    Thinking: 0
  };

  // Handle all possible cases for recommendation message
  const recommendationMessage = 
    feedback?.RecommendationMessage || 
    feedback?.recommendationMessage || 
    feedback?.["Recommendation Message"] || 
    "No recommendation message provided";

  // Handle summary data
  const summaryText = feedback?.summery || feedback?.summary || "";
  const summaryArray = Array.isArray(summaryText) 
    ? summaryText 
    : typeof summaryText === 'string' 
      ? summaryText.split('\n').filter(line => line.trim())
      : [];

  // Calculate overall score
  const ratings = Object.values(rating).filter(val => typeof val === 'number');
  const overallScore = ratings.length > 0 
    ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
    : 0;

  // Determine recommendation status
  const isRecommended = !feedback?.Recommendation?.toLowerCase().includes('not');

  const handleSendMessage = () => {
    if (!candidate?.userEmail) {
      toast.error("No email address available for this candidate");
      return;
    }

    const subject = isRecommended 
      ? "Congratulations! You've been selected for the next round" 
      : "Update on Your Application Status";

    const body = isRecommended
      ? `Dear ${candidate.userName},\n\nWe're pleased to inform you that you've been selected to proceed to the next round of interviews for the position. Our team will contact you shortly to schedule the next steps.\n\nBest regards,\nThe Hiring Team`
      : `Dear ${candidate.userName},\n\nThank you for your time and effort in the interview process. After careful consideration, we've decided to move forward with other candidates at this time. We appreciate your interest in our company and wish you the best in your job search.\n\nBest regards,\nThe Hiring Team`;

    const mailtoLink = `mailto:${candidate.userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    toast.success(`Email draft opened for ${candidate.userEmail}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary hover:bg-primary/10">
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Feedback Report</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5 space-y-4">
              {/* Candidate Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <h2 className="text-white font-bold">
                      {candidate?.userName?.[0]?.toUpperCase() || '?'}
                    </h2>
                  </div>
                  <div>
                    <h2 className="font-bold">{candidate?.userName || 'No Name'}</h2>
                    <h2 className="text-gray-500 text-sm">
                      {candidate?.userEmail || 'No Email'}
                    </h2>
                  </div>
                </div>
                <h2 className="text-primary text-2xl font-bold">
                  {overallScore}/10
                </h2>
              </div>

              {/* Skills Assessment */}
              <div>
                <h2 className="font-bold">Skills Assessment</h2>
                <div className="mt-2 grid grid-cols-2 gap-x-10 gap-y-4">
                  {Object.entries(rating).map(([skill, score]) => (
                    <div key={skill}>
                      <div className="flex justify-between text-sm mb-1">
                        {skill.replace(/([A-Z])/g, ' $1').trim()} 
                        <span>{score}/10</span>
                      </div>
                      <Progress 
                        value={score * 10} 
                        className="h-2 mt-1 [&>div]:bg-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Summary */}
              <div className="mt-5">
                <h2 className="font-bold">Performance Summary</h2>
                <div className="p-5 bg-secondary my-3 rounded-md">
                  {summaryArray.length > 0 ? (
                    summaryArray.map((line, index) => (
                      <p key={index} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No summary available</p>
                  )}
                </div>
              </div>

              {/* Recommendation Section */}
              <div className={`p-5 rounded-md ${
                isRecommended ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={`font-medium text-lg ${
                      isRecommended ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isRecommended ? 'Recommended for Next Round' : 'Not Selected'}
                    </h2>
                    <p className="mt-2 whitespace-pre-wrap text-gray-700">
                      {recommendationMessage}
                    </p>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    variant={isRecommended ? "default" : "destructive"} 
                    className={`ml-4 ${isRecommended ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;