import React, { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react';

export default function PopupForm({ val, setVal, setFormOpen, maxHp, tmpHp, setTmpHp }) {
  const [value, setValue] = useState('');
  const [tmpHpValue, setTmpHpValue] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setTmpHpValue(tmpHp)
  }, [tmpHp])

  const heal = (e) => {
    e.preventDefault()
    if (!value)
    {
      setFormOpen(false)
      return
    }

    if (parseInt(val) + parseInt(value) >= maxHp) {
      setVal(maxHp)
    } else {
      setVal(parseInt(val) + parseInt(value))
    }
    setFormOpen(false)
  }

  const damage = (e) => {
    e.preventDefault()

    if (!value)
    {
      setFormOpen(false)
      return
    }

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

  const handleInput = (e) => {
    if (e.target.value.length >= 4) {
      setValue(Math.floor(parseInt(e.target.value) / 10))
    }
    else {
      setValue(e.target.value)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key == '=') {
      if (value) {
        heal(e)
      } else {
        e.preventDefault()
        setFormOpen(false)
      }
    }
    if (e.key == '-') {
      if (value) {
        damage(e)
      } else {
        e.preventDefault()
        setFormOpen(false)
      }
    }
    if (e.key == 'Escape')
      setFormOpen(false)
  }

  const handleMouseOver = (e) => {
    setIsHovering(true)
  }

  const handleMouseOut = (e) => {
    setIsHovering(false)
  }

  return (
    <div 
      className='flex absolute z-10 -bottom-[100px] left-6 bg-opacity-90 
    bg-black py-4 px-4 rounded-md border border-stone-400'
      onKeyDown={handleKeyDown}
      tabIndex='0'
    >
      <div
        className='absolute w-0 h-0 bg-transparent left-1 -top-7 border-[16px] 
        border-black border-t-transparent border-r-transparent border-l-transparent
        border-opacity-100 border-b-black'
      >
        <div className='absolute bg-stone-400 w-[18px] h-[1px] rotate-45 top-[5px] -right-[15px]' />
        <div className='absolute bg-stone-400 w-[17px] h-[1px] -rotate-45 top-[5px] -left-[14.5px]' />
      </div>
      <div className='flex'>
        <div className='w-full grid grid-cols-3 gap-2'>
          <div>
            <input
              className='rounded-md py-0.5 pr-1 w-full text-stone-700 focus:border-gray-600 focus:ring-gray-600'
              type='number'
              placeholder='0'
              autoFocus='true'
              value={value}
              onKeyDown={handleKeyDown}
              onChange= {handleInput}
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


        <div className=' ml-3 flex flex-col justify-between'>
          <XMarkIcon className='w-5 h-5 cursor-pointer'
            onClick={(e) => setFormOpen(false)}
          />
          <QuestionMarkCircleIcon className='w-5 h-5' 
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          />
        </div>
      </div>
      <Transition
        show={isHovering}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div 
          className='absolute text-sm leading-5 -bottom-[1px] -right-40 bg-black bg-opacity-90 
          text-stone-100 p-2.5 rounded-md border-stone-400 border'
        >
          <h2>Keyboard Shortcuts:</h2>
          <p>
            &apos;Esc&apos; : Close menu
          </p>
          <p>
            &apos;=&apos; : Heal
          </p>
          <p>
            &apos;-&apos; : Damage
          </p>
        </div>
      </Transition>
    </div>
  )
}
