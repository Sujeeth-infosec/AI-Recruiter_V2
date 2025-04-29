'use client'
import React from 'react'
import { supabase } from '@/services/supabaseClient'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'

export default function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) console.error('Login Error:', error.message)
  }

  return (
    <div className="min-h-screen bg-[#f6f9ff] flex items-center justify-center px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left Section - Hero Text */}
        <div className="w-1/2 flex flex-col justify-center px-12 py-16 bg-gradient-to-b from-white to-blue-50">
          <div className="mb-8">
            <Image src="/logo.jpeg" alt="Logo" width={300} height={300} />
          </div>
          <h1 className="text-4xl font-extrabold text-blue-700 leading-snug">
            AI-Powered <br /> Hiring Begins Here
          </h1>
          <p className="text-gray-600 mt-4">
            Start your recruitment journey with smart screening, matching, and deep AI analytics.
          </p>
        </div>

        {/* Right Section - Auth Card */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Sign in to Continue</h2>
          <p className="text-gray-500 mb-8">Use your Google account to access the dashboard.</p>

          <Button
            onClick={signInWithGoogle}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-4 rounded-xl text-md font-semibold transition-all flex items-center justify-center gap-2"
          >
            Sign in with Google
            <MoveRight size={20} />
          </Button>

          <p className="text-xs text-gray-400 mt-6 text-center">
            By continuing, you agree to our{' '}
            <a href="#" className="underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
