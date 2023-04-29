import { Popover } from '@headlessui/react';
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { useRecoilState } from 'recoil';
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'
import React, { useEffect, useRef, useState } from 'react'

export default function ResetModal({ PC_NPC_list, monstersList }) {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState) 
  const [PC_NPC_inputFields, set_PC_NPC_inputfields] = useState([...PC_NPC_list])
  const [isOpen, setIsOpen] = useState(false)
  const [listenerActive, setListenerActive] = useState(false)
  const popupRef = useRef(null)

  useEffect(() => {
    console.log('mounted')

    return () => console.log('unmounted')
  }, [])

  useEffect(() => {
    console.log(isOpen)
  }, [isOpen])

  const resetInputs = () => {
    set_PC_NPC_inputfields([...PC_NPC_list])
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

  const handleFormChange = (index, event) => {
    const data = [...PC_NPC_inputFields];
    const updatedElement = {
      ...data[index],
    };
    updatedElement[event.target.name] = event.target.value;
    data[index] = updatedElement;
    set_PC_NPC_inputfields(data);
    // console.log(activeCreatures)
    console.log(popupRef.current)
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
      <Popover.Button
        onClick={handleClickButton}
      >
        <div className='cursor-pointer'>
          <ArrowPathIcon className='h-6 w-6 text-gray-300'></ArrowPathIcon> 
        </div>
      </Popover.Button>

      <Popover.Panel 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex justify-center items-center cursor-auto outline-none"
      >
        <div 
          className='w-screen px-3 flex justify-center'
          ref={popupRef}
        >
          <div className='w-full max-w-2xl bg-gray-800 rounded-md border border-gray-500 text-gray-100'>
            <form className='grid grid-cols-[1fr_100px_100px] text-gray-200 py-3 px-6'>
              <div className='text-sm uppercase col-span-3 font-semibold grid grid-cols-[1fr_100px_100px] mb-2'>
                  <div className='justify-self-start'>Player</div>
                  <div>Initiative</div>
                  <div>Dex Bonus</div>
              </div>
              {PC_NPC_inputFields.map((PC_NPC, index) => {
                return (
                  <div 
                    key={index}
                    className='text-gray-600 grid grid-cols-[1fr_100px_100px] col-span-3 my-1'
                  >
                    <div className='text-lg font-light text-gray-100 flex justify-start self-center'>
                      {PC_NPC.name}
                    </div>
                    <input 
                      name='initiative'
                      type='number'
                      min={1}
                      max={20}
                      placeholder='0'
                      value={PC_NPC.initiative}
                      onChange={e => handleFormChange(index, e)}
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
                      className='w-14 border-0 rounded-md p-1.5 focus:ring-0 shadow-md
                      focus:shadow-lg transition-shadow duration-300 justify-self-center h-fit'
                    />
                  </div>
                )
              })}
              <div className='flex w-full justify-end col-span-3 mt-3 space-x-2'>
                <button 
                  className='p-2 rounded-md font-semibold col-start-2 
                  col-end-3 bg-red-600 text-white'
                >
                  Clear
                </button>
                <button 
                  className='p-2 rounded-md font-semibold col-start-2 
                  col-end-3 bg-gray-500 text-white'
                >
                  Cancel
                </button>
                <button 
                  className='p-2 rounded-md font-semibold col-start-2 
                  col-end-3 bg-green-600 text-white'
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  )
}
