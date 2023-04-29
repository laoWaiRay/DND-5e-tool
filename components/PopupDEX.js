import { Popover } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'

export default function PopupDEX({ creatureData, setStateData, stateData }) {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState);
  const [dexBonusOpen, setDexBonusOpen] = useState(false)
  const [initiativeInput, setInitiativeInput] = useState(creatureData.initiative)
  const [dexBonusInput, setDexBonusInput] = useState(creatureData.dex_bonus)
  const [isOpen, setIsOpen] = useState(false)
  const [isOverflowed, setIsOverflowed] = useState(false)
  const closeRef = useRef(null)
  const popupRef = useRef(null);

  useEffect(() => {
    if (!popupRef.current || isOverflowed == true)
      return
    // console.log(popupRef.current.getBoundingClientRect().bottom)
    const isOverflowing = popupRef.current.getBoundingClientRect().bottom > window.innerHeight;
    setIsOverflowed(isOverflowing)
  }, [isOpen, isOverflowed])

  const updateDexData = (initiative, dexBonus) => {
    const newStateData = { ...stateData };
    newStateData.dex_bonus = parseInt(dexBonus);
    newStateData.initiative = parseInt(initiative);
    // console.log("NEW DATA")
    // console.log(newStateData)
    setStateData(newStateData)
  }

  useEffect(() => {
    if (creatureData.dex_bonus) {
      setDexBonusInput(parseInt(creatureData.dex_bonus))
    }
    if(creatureData.initiative) {
      setInitiativeInput(parseInt(creatureData.initiative))
    }
  }, [creatureData])

  useEffect(() => {
    updateDexData(initiativeInput, dexBonusInput)
  }, [dexBonusInput, initiativeInput])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newCreatureData = { ...creatureData }
    newCreatureData.dex_bonus = parseInt(dexBonusInput)
    newCreatureData.initiative = parseInt(initiativeInput)
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
          {creatureData.initiative + creatureData.dex_bonus}
        </div>
      </Popover.Button>

      <Popover.Panel className={`${!isOverflowed ? 'top-[48px]' : '-top-[90px]'} absolute left-0 z-50`}>
        {({ close }) => (
          <div 
            ref={popupRef}
            className={`flex absolute z-10 -left-[1px] bg-gray-900 py-4 px-4 rounded-md cursor-auto
            border border-gray-600 outline-none shadow-lg ${!isOverflowed && 'shadow-black'}`}
          >
            <div
              className={`absolute w-0 h-0 bg-transparent left-5 border-[16px] 
              border-gray-900 border-t-transparent border-r-transparent border-l-transparent
              border-b-gray-900 
              ${!isOverflowed ? '-top-7' : 'rotate-180 -bottom-7'}`}
            >
              <div className='absolute bg-gray-600 w-[18px] h-[1px] rotate-45 top-[5px] -right-[15px]' />
              <div className='absolute bg-gray-600 w-[17px] h-[1px] -rotate-45 top-[5px] -left-[14.5px]' />
            </div>

            <form 
              className='flex'
              onSubmit={(e) => {handleSubmit(e); close(closeRef);}}
            >
              <div className='flex space-x-4'>
                <div>
                  <h2 className='pb-1 text-sm whitespace-nowrap'>Initiative</h2>
                  <input
                    className='rounded-md py-0.5 pr-1 text-stone-700 focus:border-gray-600 focus:ring-gray-600'
                    type='number'
                    autoFocus={true}
                    value={initiativeInput}
                    onChange= {(e) => {
                      if (!e.target.value)
                      {
                        setInitiativeInput(0)
                      }
                      else if (e.target.value.length >= 3) {
                        setInitiativeInput(Math.floor(parseInt(e.target.value) / 10))
                      }
                      else if (e.target.value[0] == '0') {
                        setInitiativeInput(e.target.value.slice(-1))
                      }
                      else {
                        setInitiativeInput(parseInt(e.target.value))
                      }
                    }}
                    min={-20}
                    max={20}
                  />
                </div>
                <div>
                  <h2 className='pb-1 text-sm whitespace-nowrap'>Bonus DEX</h2>
                  <input
                    className='rounded-md py-0.5 pr-1 text-stone-700 focus:border-gray-600 focus:ring-gray-600'
                    type='number'
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

              </div>
            </form>
          </div>
        )}
      </Popover.Panel>
    </Popover>
    </>
  )
}
