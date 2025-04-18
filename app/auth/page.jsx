'use client'
import React from 'react'
import { supabase } from '@/services/supabaseClient'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Typewriter } from 'react-simple-typewriter'



function Login() {

  // Function to handle Google sign-in
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.log('Error:', error.message)
    }
  }

  return (
    <div className="flex h-screen bg-cover bg-center" style={{ backgroundImage: "url('/999.jpeg')" }}>
      {/* Left Section (Login Section) */}
      <div className="flex justify-center items-center w-3/4 ">
      <div className=" flex flex-col justify-center items-center w-3/4  p-10 shadow-xl bg-beige-100 rounded-2xl ">
        {/* Logo */}
        <DotLottieReact
      src="animations/ai.lottie"
      loop
      autoplay
      style={{ width: "100%", height: "200px" }}

    />
        {/* <Image src={"/8.png"} alt="Logo" width={200} height={200} className="mb-6 mt-8" /> */}

        {/* Content Section */}
        <h2 className="  text-5xl font-extrabold text-center text-gray-800 tracking-wide mt-5">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">AI Recruiter</span>
        </h2>
        <p className="text-gray-600 text-center mt-8 text-lg">
          <Typewriter
            words={["Sign in With Google Authentication"]}
            typeSpeed={60}
          />
        </p>
        <Button
          className="mt-10 mb-8 w-full bg-gradient-to-r text-lg from-green-400 to-blue-500 text-white font-semibold py-6 px-6 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-transform duration-500"
          onClick={signInWithGoogle}
        >
          Login with Google
        </Button>
      </div>
      </div>

      {/* Right Section (Great Hire Section) */}
      <div className="flex flex-col justify-center items-start w-1/2 pl-20">
        {/* <h2 className="text-8xl font-bold ">
          <span>Great</span>
          <span className="text-blue-700">Hire</span>
        </h2> */}
         <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-6 font-[Oswald]">
            <span style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}>
              <Typewriter
                words={["Great"]}
                loop={true}
                typeSpeed={200}
                deleteSpeed={100}
                cursor={false}
              />
            </span>
            <span
              className="text-blue-700"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
            >
              <Typewriter
                words={["Hire"]}
                typeSpeed={50}
                delaySpeed={500}
                cursor={false}
              />
            </span>
          </h1> 
        <p className="text-2xl text-gray-700 mt-5 ">
        <Typewriter
            words={["Welcome to the future of recruitment powered by AI."]}
            typeSpeed={60}
            cursor
          />
        </p>
      </div>
    </div>
  )
}

export default Login