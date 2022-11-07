import { Popover } from '@headlessui/react'
import React, { useRef, useState } from 'react'
import ShieldIcon from './ShieldIcon'
import { CheckCircleIcon } from '@heroicons/react/24/outline'


export default function PopupAc({ creatureData }) {
  const [baseAcInput, setBaseAcInput] = useState(creatureData.ac)
  const [baseAc, setBaseAc] = useState(creatureData.ac);
  const [bonusAcInput, setBonusAcInput] = useState(0);
  const [bonusAc, setBonusAc] = useState(0);
  const closeRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    setBaseAc(parseInt(baseAcInput));
    setBonusAc(parseInt(bonusAcInput));
  }

  return (
    <>
    <div ref={closeRef}></div>
    <Popover className="flex">
      <Popover.Button>
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

      <Popover.Panel className="absolute top-[49px] z-50 left-0">
        {({ close }) => (
          <div className="bg-gray-900 border border-gray-600 p-4 rounded-md">
            <div
              className='absolute w-0 h-0 bg-transparent left-5 -top-7 border-[16px] 
              border-gray-900 border-t-transparent border-r-transparent border-l-transparent
              border-b-gray-900'
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
                  <h2 className='pb-1 text-sm'>Base AC</h2>
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
