import React, { useEffect } from 'react'

function QuestionList({ formData }) {
  

  useEffect(() => {
    if (formData) {
      GenerateQuestionsList();
    }
  }, [formData])

  const GenerateQuestionsList = () => {
    // ...
  }

  return (
    <div>QuestionList</div>
  )
}

export default QuestionList