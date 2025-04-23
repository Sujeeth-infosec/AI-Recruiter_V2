import React from 'react'
import Image from 'next/image'
import InterviewHeader from '../_components/InterviewHeader'

function Interview() {
    return (
        <div className='px-10 md:px-28 lg:px-48 xl:px-64 mt-16' >
            <div className='flex justify-center border rounded -xl'>
                <Image src={'/logo.jpeg'} alt='Logo' width={200} height={200} 
                className='mb-6 mt-8 w-[140px]' />
            </div>
        </div>
    )
}

export default Interview