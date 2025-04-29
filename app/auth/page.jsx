'use client'
import React from 'react'
import { supabase } from '@/services/supabaseClient'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { MoveRight } from 'lucide-react'

export default function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) console.error(error.message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-blue-50 to-white flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-6 space-y-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight">AI Recruiter</h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 leading-snug">
            Hire Smarter. Hire Faster.
          </h2>

          <p className="text-gray-600 max-w-md text-lg">
            Leverage cutting-edge AI to revolutionize your recruitment process. Automated screening, real-time insights, and smart candidate matching.
          </p>

          <ul className="text-gray-500 space-y-1 text-md list-disc list-inside">
            <li>Intelligent Resume Screening</li>
            <li>Automated Interview Scheduling</li>
            <li>Bias-Free Candidate Matching</li>
            <li>Data-Driven Hiring Decisions</li>
          </ul>

          <p className="mt-6 text-blue-600 font-semibold text-lg">
            Join the future of hiring today!
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-lg space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">AI-Powered Screening</h3>
              <p className="text-gray-600 text-sm">
                Streamline candidate evaluation by using AI to quickly analyze resumes and assess skills.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Smart Scheduling</h3>
              <p className="text-gray-600 text-sm">
                Automate interview scheduling to eliminate manual processes and reduce scheduling conflicts.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Data Insights</h3>
              <p className="text-gray-600 text-sm">
                Gain valuable insights into your recruitment process and make data-driven hiring decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-10 py-16 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-l-3xl shadow-xl">
          <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-8 rounded-lg shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-800">Sign in to AI Recruiter</h2>
              <p className="mt-2 text-sm text-gray-600">
                Use your Google account to continue
              </p>
            </div>

            <Button
              onClick={signInWithGoogle}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-lg flex items-center justify-center gap-3"
            >
              <Image src="/googleicon.png" alt="Google" width={24} height={24} />
              Sign in with Google
              <MoveRight size={22} />
            </Button>

            <p className="text-xs text-gray-600 text-center">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-blue-300">Terms</a> and{' '}
              <a href="#" className="underline hover:text-blue-300">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} AI Recruiter. All rights reserved.
      </footer>
    </div>
  )
}
