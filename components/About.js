import Image from 'next/image'
import React from 'react'
import ReturnButton from './ReturnButton'

export default function About() {
  return (
    <div className='w-full h-full relative max-w-3xl flex justify-center items-center'>
      <div className='text-gray-100 border border-gray-400 p-4 px-8 rounded-md space-y-2 relative mm-bg'>
        <h1 className='text-2xl'>D&D 5e Combat Tracker</h1>
        <p>
          This tool solely contains monsters and spells from the SRD and is therefore covered under the 
          <span className='font-serif italic'> Wizards of the Coast </span>Open Game License.
        </p>
        <div>
          <div className='mt-8'>
            <h2 className='text-xl font-light mb-1'>Credits</h2>
            <ul>
              <li>
                <span className='font-serif'>D&D 5e API - </span>
                <a 
                  href='https://www.dnd5eapi.co' 
                  className='italic text-sm hover:text-purple-400 transition-all duration-150 ease'
                >
                  www.dnd5eapi.co
                </a>
              </li>
              <li>
                <span className='font-serif'>Open5e - </span>
                <a 
                  href='https://www.open5e.com' 
                  className='italic text-sm hover:text-purple-400 transition-all duration-150 ease'
                > 
                  www.open5e.com
                </a>
              </li>
            </ul>
          </div>

          <div className='mt-8'>
            <h2 className='text-xl font-light mb-1 flex items-center'>
              <span className='mr-2'>Follow me on Github </span>
              <Image src='/github_cat.png' alt='github cat' width={32} height={32} />
            </h2>
            <a className='font-serif italic hover:text-orange-300 transition-all duration-150 ease' href='https://github.com/laoWaiRay'>laoWaiRay</a>
          </div>
        </div>

        <div className='hidden xs:block absolute right-3 top-1.5 z-50 text-gray-300 cursor-pointer hover:text-purple-600 transition-all duration-150 ease'>
          <ReturnButton />
        </div>
      </div>
    </div>
  )
}
