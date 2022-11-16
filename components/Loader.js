import React from 'react'
import Image from 'next/image'

export default function Loader() {
  return (
    <div className='fixed flex justify-center items-center bg-black bg-opacity-60 w-screen h-screen'>
      <div className='load-spinner'> 
        <Image src='/d20-holo-spinner.png' alt='d20' width={56} height={56} />
      </div>
    </div>
  )
}
