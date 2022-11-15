import { Transition } from '@headlessui/react'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'
import { hiddenUserInputState } from '../atoms/hiddenUserInputAtom'
import DisplayCardCreature from './DisplayCardCreature'

export default function Display() {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState);
  const [isHidden, setIsHidden] = useRecoilState(hiddenUserInputState);
  const [windowSize, setWindowSize] = useState([0, 0]);

  const scrollToTop = () => {
    const top = document.getElementById('topOfTheRound');
    if (!top)
      return
    top.scrollIntoView({ block: 'start' })
  }

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  return (
    <div className={`w-full flex flex-col text-gray-500 max-w-2xl m-4 px-4 relative ${isHidden && 'pb-10'}`}>
      {activeCreatures.length != 0 &&
        <div
          id='topOfTheRound'
          className='text-gray-300 font-semibold text-center py-1.5 text-sm tracking-wide'>TOP OF THE ROUND
        </div>
      }
      {activeCreatures.length 
        === 0
        ? (
            <div 
              className='flex justify-center py-3 px-4 border border-gray-700 bg-gray-800 text-stone-300
              rounded-md shadow-md relative'>
              Add something below to get started
            </div>
          )
        : (
            activeCreatures.map((creature) => (
              <DisplayCardCreature 
                key={creature.id}
                creatureData={creature} 
                windowSize={windowSize}
              />
            ))
          )
      }
      <Transition
        show={activeCreatures.length >= 14 && isHidden}
        enter="transition-all duration-300 delay-[500ms]"
        enterFrom="opacity-0 translate-y-10"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-500"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-10"
      >
        <div 
          className='absolute right-4 -bottom-11 border-[1px] border-gray-400 rounded-full p-1 
          bg-transparent transition-all duration-150 ease-out hover:-translate-y-0.5 btn-shadow'
          onClick={scrollToTop}
        >
          <ChevronDoubleUpIcon className='w-6 h-6 text-gray-400 bg-transparent' />
        </div>
      </Transition>
      
    </div>
  )
}
