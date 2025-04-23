import React from 'react'
import Image from 'next/image'

function InterviewHeader() {
    return (
        <div className='p-4 shadow-sm' >
            <Image src={'/logo.jpeg'} alt='Logo' width={200} height={200} 
            className='mb-6 mt-8 w-[140px]'
            />
        </div>
    )
}

export default InterviewHeader