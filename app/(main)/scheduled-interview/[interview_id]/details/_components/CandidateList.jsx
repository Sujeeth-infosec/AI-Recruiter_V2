import React from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";

function CandidateList({ candidateList }) {
  return (
    <div>
      <h2>Candidates ({candidateList?.length})</h2>
      {candidateList?.map((candidate, index) => (
        <div
          key={index}
          className="p-5 flex gap-3 items-center justify-between bg-white border rounded-lg shadow-sm mt-5"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <h2 className="bg-primary p-3 font-bold text-white rounded-full">
              {candidate?.userName[0]}
            </h2>
          </div>
          <div>
            <h2 className="font-bold">{candidate?.userName}</h2>
            <h2 className="text-gray-500 text-sm">
              Completed on:{" "}
              {moment(candidate?.created_at).format("MMM DD, yyyy")}
            </h2>
          </div>
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => alert(`Feedback: ${candidate?.feedback}`)}
          >
            View Feedback
          </Button>
        </div>
      ))}
    </div>
  );
}

export default CandidateList;