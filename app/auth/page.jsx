'use client' // This is a client component, so we can use hooks and other client-side features
import React from 'react'
import { supabase } from '@/services/supabaseClient'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function Login() {

  // Function to handle Google sign-in
  // This function is called when the user clicks the "Login with Google" button
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.log('Error:', error.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='flex flex-col items-center border rounded-2xl p-8'>
        <Image src={"/logo.jpeg"} alt="Logo" 
          width={100}
          height={100} 
          className="w-[180px]"
        />

        <div className="flex flex-col items-center">
          <Image src={"/login.jpg"} alt="login"
            width={600} height={400}
            className="w-[400px] h-[250px] rounded-2xl"
          />
          <h2 className='text-2xl font-bold text-center mt-5'> Welcome to AI Recruiter </h2>
          <p className='text-gray-500 text-center'> Sign in With Google Authentication </p>
          <Button className='mt-5 w-full'
            onClick={signInWithGoogle}> Login with Google </Button>
        </div>
      </div>
    </div>
  )
}

export default Login