import { Popover, Transition } from '@headlessui/react'
import React, { useRef, useState, useEffect } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/solid'


export default function PopupHp({ creatureData }) {
  const [input, setInput] = useState(0);
  const [tmpHpInput, setTmpHpInput] = useState(0);
  const [hp, setHp] = useState(parseInt(creatureData.max_hp))
  const [tmpHp, setTmpHp] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const closeRef = useRef(null)

  useEffect(() => {
    console.log(creatureData)
  }, [creatureData])

  useEffect(() => {
    setTmpHpInput(tmpHp)
  }, [tmpHp])

  const heal = (e, close) => {
    e.preventDefault()
    if (!input)
    {
      close(closeRef)
      return
    }

    if (parseInt(hp) + parseInt(input) >= parseInt(creatureData.max_hp)) {
      setHp(parseInt(creatureData.max_hp))
    } else {
      setHp(parseInt(hp) + parseInt(input))
    }
    setInput(0)
    close(closeRef)
  }

  const damage = (e, close) => {
    e.preventDefault()

    if (!input)
    {
      close(closeRef)
      return
    }

    let damageBuffer = parseInt(input);
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
        close(closeRef)
        return
      }
    }

    if (parseInt(hp) - damageBuffer <= 0) {
      setHp(0)
    } else {
      setHp(parseInt(hp) - damageBuffer)
    }
    close(closeRef)
  }

  const changeTmpHp = (e, close) => {
    e.preventDefault()
    setTmpHp(parseInt(tmpHpInput))
    close(closeRef)
  }

  const handleInput = (e) => {
    if (e.target.value.length >= 4) {
      setInput(Math.floor(parseInt(e.target.value) / 10))
    }
    else if (e.target.value[0] == '0') {
      setInput(e.target.value.slice(-1))
    }
    else {
      setInput(e.target.value)
    }
  }

  const handleKeyDown = (e, close) => {
    if (e.key == '=') {
      if (input) {
        heal(e, close)
      } else {
        e.preventDefault()
        close(closeRef)
      }
    }
    if (e.key == '-') {
      if (input) {
        damage(e, close)
      } else {
        e.preventDefault()
        close(closeRef)
      }
    }
  }

  const handleMouseOver = (e) => {
    setIsHovering(true)
  }

  const handleMouseOut = (e) => {
    setIsHovering(false)
  }

  return (
    <>
      <div className='hidden' ref={closeRef}></div>
      <Popover className="flex">
        {({ close }) => (
          <>
          <Popover.Button>
            <div className='relative'>
              <div 
                className={`bg-gray-100 text-gray-800 w-10 flex justify-center rounded-full select-none 
                cursor-pointer ring-1 ring-gray-700 ${parseInt(tmpHp) > 0 && '!text-orange-400'}`}
              >
                {parseInt(hp) + parseInt(tmpHp)}
              </div>
              <div className='absolute -left-[5px] -top-1 text-red-500'>
                <HeartIcon className='w-4 h-4 stroke-gray-800'/>
              </div>
            </div>
          </Popover.Button>

          <Popover.Panel className="absolute top-[49px] z-50 left-0 w-full"> 
              <div 
                className='flex absolute z-10 -bottom-[103px] -left-[1px] bg-gray-900 py-4 px-4 rounded-md 
                border border-gray-400 outline-none shadow-md shadow-gray-900'
                onKeyDown={(e) => handleKeyDown(e, close)}
                tabIndex='0'
              >
                <div
                  className='absolute w-0 h-0 bg-transparent left-5 -top-7 border-[16px] 
                  border-gray-900 border-t-transparent border-r-transparent border-l-transparent
                  border-b-gray-900'
                >
                  <div className='absolute bg-gray-400 w-[18px] h-[1px] rotate-45 top-[5px] -right-[15px]' />
                  <div className='absolute bg-gray-400 w-[17px] h-[1px] -rotate-45 top-[5px] -left-[14.5px]' />
                </div>
                <div className='flex'>
                  <div className='w-full flex flex-col space-y-2'>
                    <div className='flex space-x-3 items-center'>
                      <div>
                        <input
                          className='rounded-md py-0.5 pr-1 text-gray-700 focus:border-gray-100 focus:ring-gray-100'
                          type='number'
                          placeholder='0'
                          autoFocus={true}
                          value={input}
                          onKeyDown={(e) => handleKeyDown(e, close)}
                          onChange= {handleInput}
                          min={1}
                          max={999}
                        />
                      </div>

                      <button
                        className='bg-green-700 text-sm p-[5px] px-2 w-full rounded text-gray-100'
                        onClick={(e) => heal(e, close)}
                      >
                        Heal
                      </button>

                      <button 
                        className='bg-red-700 text-sm p-[5px] w-full px-2 rounded text-gray-100'
                        onClick={(e) => damage(e, close)}
                      >
                        Damage
                      </button>
                    </div>

                    <form className='text-sm flex items-center justify-center space-x-3 text-gray-300'>
                      <div className='text-sm'>Temp HP :</div>
                      <input
                        className='rounded-md py-0.5 pr-1 text-stone-700 focus:border-gray-100 focus:ring-gray-100'
                        type='number'
                        value={tmpHpInput ? tmpHpInput : 0}
                        onChange= {(e) => {
                          if (e.target.value.length >= 4) {
                            setTmpHpInput(Math.floor(parseInt(e.target.value) / 10))
                          }
                          else if (e.target.value[0] == '0') {
                            setTmpHpInput(e.target.value.slice(-1))
                          }
                          else {
                            setTmpHpInput(parseInt(e.target.value))
                          }
                        }}
                        min={0}
                        max={999}
                      />
                      <button 
                        className='bg-transparent border border-gray-300 text-sm p-[5px] px-2 rounded text-gray-300'
                        onClick={(e) => changeTmpHp(e, close)}
                      >
                        Change
                      </button>
                    </form>
                  </div>


                  <div className=' ml-3 flex flex-col justify-between'>
                    <QuestionMarkCircleIcon className='w-5 h-5 text-gray-400' 
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    />
                  </div>
                </div>
                <Transition
                  show={isHovering}
                  enter="transition-opacity duration-100 delay-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div 
                    className='absolute text-sm leading-5 -bottom-[1px] -right-40 bg-gray-900 
                    text-gray-300 p-2.5 rounded-md border-gray-400 border space-x-1'
                  >
                    <h2 className='pb-[3px]'>Shortcuts:</h2>
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
          </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  )
}
