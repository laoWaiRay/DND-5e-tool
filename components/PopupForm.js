import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

export default function PopupForm({ val, setVal, setFormOpen, maxHp }) {
  const [value, setValue] = useState(1);

  const heal = (e) => {
    e.preventDefault()
    if (parseInt(val) + parseInt(value) >= maxHp) {
      setVal(maxHp)
    } else {
      setVal(parseInt(val) + parseInt(value))
    }
  }

  const damage = (e) => {
    e.preventDefault()
    if (parseInt(val) - parseInt(value) <= 0) {
      setVal(0)
    } else {
      setVal(parseInt(val) - parseInt(value))
    }
  }

  return (
    <div 
      className='flex items-center justify-between absolute z-10 -bottom-[72px] left-6 bg-opacity-90 
      bg-black w-60 py-3 px-4 rounded-md'
    >
      <div
        className='absolute w-0 h-0 bg-transparent left-1 -top-7 border-[16px] 
        border-black border-t-transparent border-r-transparent border-l-transparent
        border-opacity-90 z-10'
      />
      <div>
        <input
          className='rounded-md py-1 pr-1 w-20 text-stone-700'
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
      <div className='flex flex-col space-y-2'>
        <button 
          className='bg-green-700 text-sm px-1.5 rounded text-stone-100 hover:bg-green-800'
          onClick={heal}
        >
          Heal
        </button>
        <button 
          className='bg-red-700 text-sm px-1.5 rounded text-stone-100 hover:bg-red-800'
          onClick={damage}
        >
          Damage
        </button>
      </div>
      <XMarkIcon 
        className='w-5 h-5 cursor-pointer hover:text-stone-400' 
        onClick={() => setFormOpen(false)}
      />
    </div>
  )
}
