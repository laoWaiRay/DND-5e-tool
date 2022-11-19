import { Transition } from '@headlessui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import { aboutState } from '../atoms/aboutAtom'
import ReturnButton from './ReturnButton'

export default function About() {
  return (
    <div className='w-full h-full relative max-w-3xl'>
      <div className='text-white border p-4'>
        About
      </div>
      <div className='absolute right-3 top-0.5 z-50 text-gray-300 cursor-pointer hover:text-purple-600 transition-all duration-150 ease'>
        <ReturnButton />
      </div>
    </div>
  )
}
