import React from 'react'
import { useRecoilState } from 'recoil'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'
import DisplayCardCreature from './DisplayCardCreature'

export default function Display() {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState)

  return (
    <div className='w-full flex flex-col text-gray-500 max-w-2xl m-4 px-4'>
      {activeCreatures.length != 0 &&
        <div className='text-gray-300 font-semibold text-center mb-1 text-sm tracking-wide'>TOP OF THE ROUND</div>
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
            activeCreatures.map((creature, index) => (
              <DisplayCardCreature 
                key={creature.id}
                creatureData={creature} 
              />
            ))
          )
      }
    </div>
  )
}
