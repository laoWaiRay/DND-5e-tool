import { Popover } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import React, { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'

export default function PopupDEX({ creatureData }) {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState);
  const [dexBonusOpen, setDexBonusOpen] = useState(false)
  const [dexBonus, setDexBonus] = useState(creatureData.dex_bonus)
  const [dexBonusInput, setDexBonusInput] = useState(creatureData.dex_bonus)
  const closeRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const newCreatureData = { ...creatureData }
    newCreatureData.dex_bonus = parseInt(dexBonusInput)
    updateList(newCreatureData)
  }

  const updateList = (data) => {
    let newArray = activeCreatures.filter((creature) => creature.id != creatureData.id)
    newArray.push(data)
    newArray.sort((a, b) => {
      if (a.initiative != b.initiative) {
        return parseInt(b.initiative) - parseInt(a.initiative)
      }
      else {
        return parseInt(b.dex_bonus) - parseInt(a.dex_bonus)
      }
    })
    setActiveCreatures(newArray)
  }

  return (
    <>
    <div className='hidden' ref={closeRef}></div>
    <Popover className="flex">
      <Popover.Button>
        <div
          className='font-bold cursor-pointer px-1 aspect-square'
          onClick={() => setDexBonusOpen(!dexBonusOpen)}
        >
          {creatureData.initiative}
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute top-[48px] z-50 left-0">
        {({ close }) => (
          <div 
            className='flex absolute z-10 -left-[1px] bg-gray-900 py-4 px-4 rounded-md 
            border border-gray-400 outline-none shadow-lg shadow-black'
          >
            <div
              className='absolute w-0 h-0 bg-transparent left-5 -top-7 border-[16px] 
              border-gray-900 border-t-transparent border-r-transparent border-l-transparent
              border-b-gray-900'
            >
              <div className='absolute bg-gray-400 w-[18px] h-[1px] rotate-45 top-[5px] -right-[15px]' />
              <div className='absolute bg-gray-400 w-[17px] h-[1px] -rotate-45 top-[5px] -left-[14.5px]' />
            </div>

            <form 
              className='flex'
              onSubmit={(e) => {handleSubmit(e); close(closeRef);}}
            >
              <div className='flex space-x-4'>
                <div>
                  <h2 className='pb-1 text-sm whitespace-nowrap'>Bonus DEX</h2>
                  <input
                    className='rounded-md py-0.5 pr-1 text-stone-700 focus:border-gray-600 focus:ring-gray-600'
                    type='number'
                    autoFocus={true}
                    value={dexBonusInput}
                    onChange= {(e) => {
                      if (!e.target.value)
                      {
                        setDexBonusInput(0)
                      }
                      else if (e.target.value.length >= 3) {
                        setDexBonusInput(Math.floor(parseInt(e.target.value) / 10))
                      }
                      else if (e.target.value[0] == '0') {
                        setDexBonusInput(e.target.value.slice(-1))
                      }
                      else {
                        setDexBonusInput(parseInt(e.target.value))
                      }
                    }}
                    min={-20}
                    max={20}
                  />
                </div>

                <button className='ml-3'>
                  <CheckCircleIcon className='w-8 h-8 hover:text-green-500 transition-colors duration-150 ease-in'/>
                </button>   
                
                {/* <div>
                  <h2 className='pb-1 text-sm'>Bonuses</h2>
                  <input
                    className='rounded-md py-0.5 pr-1 text-stone-700 focus:border-gray-600 focus:ring-gray-600'
                    type='number'
                    value={bonusAcInput}
                    onChange= {(e) => {
                      if (!e.target.value)
                      {
                        setBonusAcInput(0)
                      }
                      else if (e.target.value.length >= 3) {
                        setBonusAcInput(Math.floor(parseInt(e.target.value) / 10))
                      }
                      else if (e.target.value[0] == '0') {
                        setBonusAcInput(e.target.value.slice(-1))
                      }
                      else {
                        setBonusAcInput(parseInt(e.target.value))
                      }
                    }}
                    min={0}
                    max={99}
                  />
                </div> */}
              </div>
            </form>
          </div>
        )}
      </Popover.Panel>
    </Popover>
    </>
  )
}
