import { Transition, Popover } from '@headlessui/react';
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { XCircleIcon } from '@heroicons/react/24/outline'

export default function StatusIcon({ stat, activeStatuses, overflowStatuses, setActiveStatuses, setOverflowStatuses }) {
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef(null)

  const handleHover = (e) => {
    setIsHovering(true);
  }

  const handleBlur = (e) => {
    setIsHovering(false);
  }

  const handleClose = (e, close) => {
    const newOverflowArray = [...overflowStatuses]
    let newStatusesArray = [...activeStatuses]
    const name = e.target.dataset.name
    newStatusesArray = newStatusesArray.filter((condition) => condition.name != name)
    if (newOverflowArray.length > 0)
      newStatusesArray.push(newOverflowArray.pop())
    setActiveStatuses(newStatusesArray)
    setOverflowStatuses(newOverflowArray)
    setIsHovering(false)
    close(ref)
    // setActiveStatuses(prev => {
    //   const id = e.target.dataset.id;
    //   let newStatusesArray = [...prev];
    //   newStatusesArray = newStatusesArray.filter((condition) => condition.id != id)
    //   setIsHovering(false)
    //   close(ref)
    //   return newStatusesArray
    // });
  }

  return (
    <Popover className="flex shrink-0 relative">
      {({ open, close }) => (
        <>
        <div className='hidden outline-none' ref={ref}></div>
        <Popover.Button>
          <div 
            className='shrink-0'
            onMouseOver={(e) => handleHover(e)}
            onMouseOut={(e) => handleBlur(e)} 
          >
            <Image src={stat.url} alt={stat.name} width={16} height={16} 
              className='cursor-pointer'  
            />
            <Transition
              show={isHovering && !open}
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div 
                className='absolute top-[33px] p-2 w-fit bg-gray-900 border border-gray-400 rounded-md 
                pointer-events-none left-1/2 right-1/2 -translate-x-1/2 z-50'
              >
                <span className='whitespace-nowrap flex-1'>{stat.name}</span>
              </div>
            </Transition>
            
          </div>
        </Popover.Button> 
        <Transition
              show={open}
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel className="absolute top-[33px] left-1/2">
                <div 
                  className='absolute p-2 w-fit bg-gray-900 border border-gray-400 rounded-md pointer-events-none 
                  z-50 -translate-x-1/2'
                >
                  <div 
                    className='absolute -top-2 -right-3 bg-gray-900 rounded-full cursor-pointer pointer-events-auto'
                    onClick={(e) => handleClose(e, close)} 
                    data-name={stat.name}
                  >
                    <XCircleIcon
                      className='w-6 h-6 text-red-600 pointer-events-none'
                    />
                  </div>
                  <span className='whitespace-nowrap flex-1'>{stat.name}</span>
                </div>
              </Popover.Panel>
            </Transition>    
        </>
      )}


    </Popover>
    
  )
}