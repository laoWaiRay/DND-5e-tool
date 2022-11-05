import React, { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Popover } from '@headlessui/react';

export default function PopupForm({ val, setVal, setFormOpen, maxHp, tmpHp, setTmpHp }) {
  const [value, setValue] = useState(1);
  const [tmpHpValue, setTmpHpValue] = useState(0);

  useEffect(() => {
    setTmpHpValue(tmpHp)
  }, [tmpHp])

  const heal = (e) => {
    e.preventDefault()
    if (parseInt(val) + parseInt(value) >= maxHp) {
      setVal(maxHp)
    } else {
      setVal(parseInt(val) + parseInt(value))
    }
    setFormOpen(false)
  }

  const damage = (e) => {
    e.preventDefault()
    let damageBuffer = parseInt(value);
    let tmpHpBuffer = tmpHp;

    if (tmpHpBuffer > 0)
    {
      if (damageBuffer >= tmpHpBuffer)
      {
        setTmpHp(0);
        damageBuffer = damageBuffer - tmpHpBuffer;
      }
      else
      {
        setTmpHp(tmpHpBuffer - damageBuffer);
        setFormOpen(false)
        return
      }
    }

    if (parseInt(val) - damageBuffer <= 0) {
      setVal(0)
    } else {
      setVal(parseInt(val) - damageBuffer)
    }
    setFormOpen(false)
  }

  const changeTmpHp = (e) => {
    setTmpHp(parseInt(tmpHpValue))
    setFormOpen(false)
  }

  return (
    <div 
      className='flex absolute z-10 -bottom-[100px] left-6 bg-opacity-90 
    bg-black py-4 px-4 rounded-md border border-white'
    >
      <div
        className='absolute w-0 h-0 bg-transparent left-1 -top-7 border-[16px] 
        border-black border-t-transparent border-r-transparent border-l-transparent
        border-opacity-100 border-b-black'
      >
        <div className='absolute bg-white w-[18px] h-[1px] rotate-45 top-[5px] -right-[15px]' />
        <div className='absolute bg-white w-[17px] h-[1px] -rotate-45 top-[5px] -left-[14.5px]' />
      </div>
      <div className='flex'>
        <div className='w-full grid grid-cols-3 gap-2'>
          <div>
            <input
              className='rounded-md py-0.5 pr-1 w-full text-stone-700 focus:border-gray-600 focus:ring-gray-600'
              type='number'
              value={value}
              onChange= {(e) => {
                if (e.target.value.length >= 4) {
                  setValue(Math.floor(parseInt(e.target.value) / 10))
                }
                else {
                  setValue(e.target.value)
                }
              }}
              min={1}
              max={999}
            />
          </div>

          <button
            className='bg-green-800 text-sm p-[5px] px-2 w-full rounded text-stone-100 hover:bg-green-700'
            onClick={heal}
          >
            Heal
          </button>

          <button 
            className='bg-red-800 text-sm p-[5px] w-full px-2 rounded text-stone-100 hover:bg-red-700'
            onClick={damage}
          >
            Damage
          </button>

          <div className='text-sm flex items-center justify-center'>Temp HP :</div>
          <input
              className='rounded-md py-0.5 pr-1 w-full text-stone-700 focus:border-gray-600 focus:ring-gray-600'
              type='number'
              value={tmpHpValue ? tmpHpValue : 0}
              onChange= {(e) => {
                if (e.target.value.length >= 4) {
                  setTmpHpValue(Math.floor(parseInt(e.target.value) / 10))
                }
                else if (e.target.value[0] == '0') {
                  setTmpHpValue(e.target.value.slice(-1))
                }
                else {
                  setTmpHpValue(parseInt(e.target.value))
                }
              }}
              min={0}
              max={999}
            />
          <button 
              className='bg-stone-600 text-sm p-[5px] px-2 rounded text-stone-100 hover:bg-stone-500'
              onClick={changeTmpHp}
            >
              Change
            </button>
        </div>


        <div className=' ml-3'>
          <XMarkIcon className='w-5 h-5 cursor-pointer'
            onClick={(e) => setFormOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
