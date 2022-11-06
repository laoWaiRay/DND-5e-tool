import Image from 'next/image'
import React from 'react'

export default function Header() {
  return (
    <div className='px-6 py-4 md:py-3 md:px-8 bg-gray-900 w-full'>
      <div className='flex items-center'>
        <div className='relative h-6 w-6 mr-2'>
          <Image src='/images/d20-holo.png' alt='d20' fill />
        </div>
        <div className='relative h-8 w-64 hidden md:block'>
          <Image src='/images/logo-light.png' alt='logo' fill />
        </div>
      </div>
    </div>
  )
}
