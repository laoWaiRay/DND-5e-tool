import { Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import CreatureSelectForm from './CreatureSelectForm'

export default function UserInput({ creatures }) {
  const [tab, setTab] = useState('player');
  const [isHidden, setIsHidden] = useState(false);

  return (
    <>
    <div className='mt-auto relative'>
      <Transition
        show={!isHidden}
        enter="transition-transform duration-150 delay-150"
        enterFrom="translate-y-80"
        enterTo="translate-y-0"
        leave="transition-transform duration-150"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-80"
      >
        <div 
          className='m-4 mb-0 mt-auto border bg-gray-800 text-gray-100 rounded-md max-w-4xl shadow-sm 
          border-gray-700 flex transy-'
        >
          <div className='grid grid-cols-3 flex-1'>
            <div 
                className={`font-semibold text-center p-0.5 cursor-pointer border-r-gray-500
                ${tab === 'player' && 'bg-gray-100 text-gray-800 rounded-md'}
                ${tab != 'creatures' && 'border-r'}`}
                onClick={(e) => setTab('player')}
              >
              Player
            </div>
            <div 
              className={`font-semibold text-center p-0.5 cursor-pointer border-r-gray-500
              ${tab === 'creatures' && 'bg-gray-100 text-gray-800 rounded-md'}
              ${tab != 'custom' && 'border-r'}`}
              onClick={(e) => setTab('creatures')}
            >
              Creatures
            </div>
            <div 
              className={`font-semibold text-center p-0.5 cursor-pointer border-r border-r-gray-600
              rounded-md
              ${tab === 'custom' && 'bg-gray-100 text-gray-800 rounded-md'}`}
              onClick={(e) => setTab('custom')}
            >
              Custom
            </div>
          </div>
          <div 
            className='flex items-center px-2 text-gray-100 cursor-pointer'
            onClick={(e) => setIsHidden(true)}
          >
            <ChevronDownIcon className='w-5 h-5'/>
          </div>
        </div>
        <div 
          className='bg-gray-800 border-gray-700 m-4 mt-2 rounded-md max-w-2xl border shadow-md'
        >
          <CreatureSelectForm 
            tab={tab}
            creatures={creatures}
          />
        </div>
      </Transition>
    </div>
    <Transition
        show={isHidden}
        enter="transition-transform duration-150 delay-150"
        enterFrom="translate-y-52"
        enterTo="translate-y-0"
        leave="transition-transform duration-150"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-52"
      >
        <div className='w-screen animate-hideScroll'>
          <div 
            className='w-10 h-8 bg-gray-900 flex items-center justify-center fixed bottom-0
            ml-auto mr-auto text-center left-0 right-0 border border-gray-400 border-b-transparent rounded-t-md
            cursor-pointer'
            onClick={(e) => setIsHidden(false)}
          >
            <ChevronUpIcon className='w-6 h-6 text-gray-100 '/>
          </div>
        </div>
      </Transition>
    </>
  )
}
