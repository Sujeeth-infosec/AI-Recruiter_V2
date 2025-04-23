import React from 'react'
import Image from 'next/image'

function InterviewHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-left">
        <Image src="/logo.jpeg" alt="Logo" width={100} height={100} />
      </div>
    </header>
  )
}

export default InterviewHeader
