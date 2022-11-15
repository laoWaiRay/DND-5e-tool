import { Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { hiddenUserInputState } from '../atoms/hiddenUserInputAtom'
import CreatureSelectForm from './CreatureSelectForm'

export default function UserInput({ creatures }) {
  const [tab, setTab] = useState('player');
  const [isHidden, setIsHidden] = useRecoilState(hiddenUserInputState);

  useEffect(() => {
    if (isHidden)
      return

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight })
    }, 300);
  }, [isHidden, tab])

  // const scrollToTop = () => {
  //   const top = document.getElementById('topOfTheRound');
  //   if (!top)
  //     return
  //   top.scrollIntoView({ block: 'start' })
  // }

  return (
    <>
    <div className='mt-auto relative max-w-2xl'>
      <Transition
        show={!isHidden}
        enter="transition-transform duration-150 delay-150"
        enterFrom="translate-y-80"
        enterTo="translate-y-0"
        leave="transition-transform duration-300"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-80"
      >
        <div 
          className='m-4 mb-0 mt-auto border bg-gray-800 text-gray-100 rounded-md max-w-4xl shadow-sm 
          border-gray-700 flex'
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
          className='bg-gray-800 border-gray-700 m-4 mt-2 rounded-md border shadow-md'
        >
          <CreatureSelectForm 
            tab={tab}
            creatures={creatures}
          />
        </div>
      </Transition>
    </div>
      <div className='w-screen absolute bottom-0 left-0 animate-hideScroll'>
        <Transition
          show={isHidden}
        >
          <Transition.Child
            enter="transition-transform duration-150 delay-150"
            enterFrom="translate-y-52"
            enterTo="translate-y-0"
            leave="transition-transform duration-150"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-52"
          >
            <div 
              className='w-10 h-8 bg-gray-900 flex items-center justify-center fixed bottom-0
              ml-auto mr-auto text-center right-0 left-0 border border-gray-400 border-b-transparent rounded-t-md
              cursor-pointer'
              onClick={(e) => { setIsHidden(false); }}
            >
              <ChevronUpIcon className='w-6 h-6 text-gray-100 '/>
            </div>
          </Transition.Child>
            
          {/* <Transition.Child
            enter="transition-all duration-300 delay-[500ms]"
            enterFrom="opacity-0 translate-y-10"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-10"
          >
            <div 
              className='absolute right-8 bottom-2.5 border-[1px] border-gray-400 rounded-full p-1 
              bg-transparent transition-all duration-150 ease-out hover:-translate-y-0.5 btn-shadow'
              onClick={scrollToTop}
            >
              <ChevronDoubleUpIcon className='w-6 h-6 text-gray-400 bg-transparent' />
            </div>
          </Transition.Child> */}
        </Transition>
      </div>
    </>
  )
}
