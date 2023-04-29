import { Popover } from '@headlessui/react';
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { useRecoilState } from 'recoil';
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'
import React, { useEffect, useRef, useState } from 'react'

const deepCopyFunction = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopyFunction(value)
  }

  return outObject
}

export default function ResetModal({ PC_NPC_list, monstersList }) {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState) 
  const [PC_NPC_inputFields, set_PC_NPC_inputfields] = useState([...PC_NPC_list])
  const [isOpen, setIsOpen] = useState(false)
  const [listenerActive, setListenerActive] = useState(false)
  const popupRef = useRef(null)
  const firstInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    console.log('mounted')
    console.log(activeCreatures)

    return () => console.log('unmounted')
  }, [])

  useEffect(() => {
    if (popupRef.current)
      document.body.style.overflow = 'hidden'
    else
      document.body.style.overflow = ''
  }, [popupRef.current])

  const resetInputs = () => {
    set_PC_NPC_inputfields([...PC_NPC_list])
  }

  const zeroInitiativeInputs = () => {
    const updatedInputFields = deepCopyFunction(PC_NPC_inputFields)
    updatedInputFields.forEach((player) => {
      player.initiative = 0;
    })
    set_PC_NPC_inputfields(updatedInputFields)
  }

  const handleClickButton = (e) => {
    setIsOpen(!isOpen)
    if (!listenerActive)
      document.addEventListener('click', listenForClickOutside)
  }

  const listenForClickOutside = (e) => {
    setListenerActive(true)
    if (!popupRef.current)
    {
      resetInputs()
      setListenerActive(false)
      document.removeEventListener('click', listenForClickOutside)
    }
  }

  {/* 
    This is to detect if the user clicks outside the popover panel.
    Since the panel is technically covering the width of the screen,
    we need to check if the user clicks within the panel element but
    outside of the UI visible portion of the panel, and then close
    the popover.
  */}
  const handleClickClose = (e, close) => {
    if (!formRef.current.contains(e.target))
      close();
  }

  const handleFormChange = (index, event) => {
    const data = [...PC_NPC_inputFields];
    const updatedElement = {
      ...data[index],
    };
    
    let inputMin;
    let inputMax;

    if (event.target.name == 'initiative') {
      inputMin = 0;
      inputMax = 99;
    } else if (event.target.name == 'dex_bonus') {
      inputMin = -99;
      inputMax = 99;
    }

    let parsedInt;
    if (event.target.value)
      parsedInt = parseInt(event.target.value)
    let value;

    if (!parsedInt || parsedInt == 0)
      value = '';
    else if (parsedInt < inputMin)
      value = inputMin;
    else if (parsedInt > inputMax)
      value = inputMax;
    else
      value = parsedInt;

    updatedElement[event.target.name] = value;
    data[index] = updatedElement;
    set_PC_NPC_inputfields(data);
  }

  const handleInputFocus = (index, event) => {
    if (!parseInt(event.target.value) || parseInt(event.target.value) <= 0)
      event.target.value = ''
  }
  
  const handleClickClearBtn = (e) => {
    zeroInitiativeInputs();
    if (firstInputRef.current) {
      firstInputRef.current.focus();
      setTimeout(() => {
        firstInputRef.current.value = '';
      }, 0)
    }
  }

  const handleClickSaveBtn = (e, close) => {
    const updatedActiveCreatures = deepCopyFunction(activeCreatures);
    const PC_NPC_inputFields_copy = deepCopyFunction(PC_NPC_inputFields);
    PC_NPC_inputFields_copy.forEach((PC_NPC) => {
      const index = updatedActiveCreatures.findIndex((el) => el.id === PC_NPC.id);
      updatedActiveCreatures[index].initiative = PC_NPC.initiative;
      updatedActiveCreatures[index].dex_bonus = PC_NPC.dex_bonus;
    })
    
    updatedActiveCreatures.sort((a, b) => {
      if (a.initiative != b.initiative) {
        return parseInt(b.initiative) - parseInt(a.initiative)
      }
      else {
        return parseInt(b.dex_bonus) - parseInt(a.dex_bonus)
      }
    })

    setActiveCreatures(updatedActiveCreatures);

    close();
  }

  const handleKeyDown = (e) => {
    return (e.key === 'e' || e.key === '.') && e.preventDefault()
  }

  useEffect(() => {
    set_PC_NPC_inputfields([...PC_NPC_list])
  }, [PC_NPC_list])

  useEffect(() => {
    if (listenerActive)
      return

    resetInputs()
  }, [listenerActive])

  return (
    <Popover className="flex">
      {({ close }) => 
        <>
        <Popover.Button
          onClick={handleClickButton}
        >
          <div className='cursor-pointer'>
            <ArrowPathIcon className='h-6 w-6 text-gray-300'></ArrowPathIcon> 
          </div>
        </Popover.Button>
        
        <Popover.Overlay className="fixed inset-0 bg-black z-10 opacity-90 cursor-auto" />
        
        <Popover.Panel 
          className="z-50 fixed inset-0 flex justify-center items-center cursor-auto outline-none"
          ref={popupRef}
          onClick={(e) => handleClickClose(e, close)}
        >
          {/* This is a wrapper for the form to add space between it and the edges of the screen */}
          <div 
            className='w-full max-w-md mx-4 bg-gray-800 rounded-md border border-gray-500 text-gray-100'
          >
            <form 
              className='grid grid-cols-[1fr_100px_100px] text-gray-200 py-4 px-6'
              ref={formRef}
            >
              <div className='text-sm uppercase col-span-3 font-semibold grid grid-cols-[1fr_100px_100px] mb-2 border-b-gray-400 border-b pb-2'>
                  <div className='justify-self-start flex items-center'>Player</div>
                  <div>Initiative (total)</div>
                  <div>Dex Bonus (optional)</div>
              </div>
              {PC_NPC_inputFields.map((PC_NPC, index) => {
                return (
                  <div 
                    key={index}
                    className='text-gray-600 grid grid-cols-[1fr_100px_100px] col-span-3 my-1'
                  >
                    <div 
                      className='text-lg font-light text-gray-100 flex justify-start self-center 
                      overflow-hidden' 
                    >
                      <span className='overflow-hidden whitespace-nowrap overflow-ellipsis'>{PC_NPC.name}</span>
                    </div>
                    <input 
                      ref={index == 0 ? firstInputRef : null}
                      name='initiative'
                      type='number'
                      min={0}
                      max={99}
                      placeholder='0'
                      value={PC_NPC.initiative}
                      onFocus={e => handleInputFocus(index, e)}
                      onChange={e => handleFormChange(index, e)}
                      // Prevent certain inputs
                      onKeyDown={(e) => handleKeyDown(e)}
                      className='w-14 border-0 rounded-md p-1.5 focus:ring-0 shadow-md
                      focus:shadow-lg transition-shadow duration-300 justify-self-center h-fit'
                    />
                    <input 
                      name='dex_bonus'
                      type='number'
                      min={-99}
                      max={99}
                      placeholder='0'
                      value={PC_NPC.dex_bonus}
                      onChange={e => handleFormChange(index, e)}
                      // Prevent certain inputs
                      onKeyDown={(e) => handleKeyDown(e)}
                      className='w-14 border-0 rounded-md p-1.5 focus:ring-0 shadow-md
                      focus:shadow-lg transition-shadow duration-300 justify-self-center h-fit'
                    />
                  </div>
                )
              })}
              <div className='flex w-full justify-end col-span-3 mt-4 space-x-2'>
                <button 
                  className='p-2 rounded-md font-semibold col-start-2 
                  col-end-3 bg-red-600 text-white'
                  type='button'
                  onClick={(e) => handleClickClearBtn(e)}
                >
                  Clear
                </button>
                <Popover.Button
                  className='p-2 rounded-md font-semibold col-start-2 
                  col-end-3 bg-gray-600 text-white'
                >
                    Cancel
                </Popover.Button>
                <button 
                  className='p-2 rounded-md font-semibold col-start-2 
                  col-end-3 bg-green-600 text-white'
                  type='button'
                  onClick={(e) => handleClickSaveBtn(e, close)}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </Popover.Panel>
        </>
      }
    </Popover>
  )
}
