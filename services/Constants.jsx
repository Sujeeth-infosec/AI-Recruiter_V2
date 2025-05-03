import { BriefcaseBusinessIcon, Code2Icon, User2Icon, Component, Puzzle, Calendar, LayoutDashboard, List, Settings, WalletCards } from "lucide-react";

export const SideBarOptions=[
    {
        name:'Dashboard',
        icon:LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:'Scheduled Interview',
        icon:Calendar,
        path:'/scheduled-interview'
    },
    {
        name:'All Interview',
        icon:List,
        path:'/all-interview'
    },
    {
        name:'Billing',
        icon:WalletCards,
        path:'/billing'
    },
    {
        name:'Settings',
        icon:Settings,
        path:'/settings'
    },
]

export const InterviewType=[
    {
        name:'Technical',
        icon:Code2Icon,
    },
    {
        name:'Behavioral',
        icon:User2Icon,
    },
    {
        name:'Experience',
        icon:BriefcaseBusinessIcon,
    },
    {
        name:'Problem Solving',
        icon:Puzzle,
    },
    {
        name:'Leadership',
        icon:Component,
    },
]

export const QUESTIONS_PROMPT=`You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions including candidate introduction, salary negotiation, and closing questions.

Job Title: {{jobTitle}}

Job Description:{{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration

Adjust the number and depth of questions to match the interview duration or more.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
 question:'',
 type:'Candidate selfIntroduction about education background, work experience/Candidate home and working locations/worked previous and current working company/Why Should we hire you/Present salary negotiation/Technical/Behavioral/Experience/Problem Solving/Leadership'
},{
...
}]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`

export const FEEDBACK_PROMPT = `{{conversation}}

Based on this interview conversation between the assistant and the user,

Provide detailed feedback for the user interview. Rate out of 10 for the following categories: 
Technical Skills, Communication, Problem Solving, Experience, Behavioral, and Analysis.

Summarize the interview in exactly 3 lines. 
Also, provide a one-line recommendation clearly stating whether the user is recommended for hire or not. 
The recommendation message should be direct and professional.

Respond strictly in the following JSON format:
{
  feedback: {
    rating: {
      TechnicalSkills: 0,
      Communication: 0,
      ProblemSolving: 0,
      Experience: 0,
      Behavioral: 0,
      Analysis: 0
    }
  },
  summary: "<3-line summary>",
  Recommendation: "<Yes/No>",
  RecommendationMessage: "<Short clear message>"
}
`;