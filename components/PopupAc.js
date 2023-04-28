import { Popover } from '@headlessui/react'
import React, { useEffect, useRef, useState } from 'react'
import ShieldIcon from './ShieldIcon'
import { CheckCircleIcon } from '@heroicons/react/24/outline'


export default function PopupAc({ creatureData, stateData, setStateData }) {
  const [baseAcInput, setBaseAcInput] = useState(creatureData.ac)
  const [baseAc, setBaseAc] = useState(creatureData.ac);
  const [bonusAcInput, setBonusAcInput] = useState(0);
  const [bonusAc, setBonusAc] = useState(creatureData.dex_bonus || 0);
  const [isOpen, setIsOpen] = useState(false)
  const [isOverflowed, setIsOverflowed] = useState(false)
  const closeRef = useRef(null)
  const popupRef = useRef(null)

  useEffect(() => {
    if (!popupRef.current || isOverflowed == true)
      return
    console.log(popupRef.current.getBoundingClientRect().bottom)
    const isOverflowing = popupRef.current.getBoundingClientRect().bottom > window.innerHeight;
    setIsOverflowed(isOverflowing)
  }, [isOpen, isOverflowed])

  const updateAcData = (baseAc, bonusAc) => {
    const newStateData = { ...stateData };
    newStateData.dex_bonus = parseInt(bonusAc);
    newStateData.ac = parseInt(baseAc);
    setStateData(newStateData)
  }

  useEffect(() => {
    if (creatureData.ac) {
      setBaseAc(parseInt(creatureData.ac))
    }
  }, [creatureData])

  useEffect(() => {
    updateAcData(baseAc, bonusAc)
  }, [baseAc, bonusAc])

  useEffect(() => {
    setBaseAcInput(baseAc)
    setBonusAcInput(bonusAc)
  }, [bonusAc, baseAc])

  const handleSubmit = (e) => {
    e.preventDefault();
    setBaseAc(parseInt(baseAcInput));
    setBonusAc(parseInt(bonusAcInput));
  }

  const resetInputs = () => {
    setBaseAcInput(baseAc)
    setBonusAcInput(bonusAc)
  }

  const listenForClickOutside = (e) => {
    if (!popupRef.current)
    {
      resetInputs()
      document.removeEventListener('click', listenForClickOutside)
    }
  }

  return (
    <>
    <div className='hidden' ref={closeRef}></div>
    <Popover className="flex">
      <Popover.Button
        onClick={() => { document.addEventListener('click', listenForClickOutside); setIsOpen(!isOpen) }}
      >
        <div className='relative'>
          <div 
            className='bg-gray-100 text-gray-800 w-8 flex justify-center rounded-full select-none 
            cursor-pointer ring-1 ring-gray-700'
          >
            {baseAc + bonusAc}
          </div>
          <div className='absolute -left-2.5 -top-2 w-4 h-4'>
            <ShieldIcon className='fill-gray-400 stroke-gray-800 stroke-[1.5px] scale-[60%]'/>
          </div>
          <div className='absolute -left-2.5 -top-2 w-4 h-4'>
            <ShieldIcon className='fill-none stroke-gray-800 stroke-[2px] scale-[38%]'/>
          </div>
        </div>
      </Popover.Button>

      <Popover.Panel 
        className="absolute top-[48px] z-50 left-0"
      >
        {({ close }) => (
          <div 
            className={`flex absolute z-10  bg-gray-900 py-4 px-4 rounded-md 
            border border-gray-600 outline-none  shadow-black cursor-default
            ${!isOverflowed ? '-bottom-[103px] -left-[1px] shadow-lg' : 'bottom-[50px] left-0'}`}
            ref={popupRef}
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
                  <h2 className='pb-1 text-sm whitespace-nowrap'>Base AC</h2>
                  <input
                    className='rounded-md py-0.5 pr-1 text-stone-700 focus:border-gray-600 focus:ring-gray-600'
                    type='number'
                    autoFocus={true}
                    value={baseAcInput}
                    onChange= {(e) => {
                      if (!e.target.value)
                      {
                        setBaseAcInput(0)
                      }
                      else if (e.target.value.length >= 3) {
                        setBaseAcInput(Math.floor(parseInt(e.target.value) / 10))
                      }
                      else if (e.target.value[0] == '0') {
                        setBaseAcInput(e.target.value.slice(-1))
                      }
                      else {
                        setBaseAcInput(parseInt(e.target.value))
                      }
                    }}
                    min={0}
                    max={99}
                  />
                </div>
                
                <div>
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
                </div>
              </div>
              
              <button className='ml-3'>
                <CheckCircleIcon className='w-8 h-8 hover:text-green-500 transition-colors duration-150 ease-in'/>
              </button>       
            </form>
          </div>
        )}
      </Popover.Panel>
    </Popover>
    </>
  )
}
