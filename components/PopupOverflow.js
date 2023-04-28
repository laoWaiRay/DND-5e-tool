import { Transition } from '@headlessui/react'
import Image from 'next/image'
import React from 'react'

export default function PopupOverflow({ isHoverEllipsis, overflowStatuses }) {
  return (
    <div className='absolute w-full -left-[9px] top-0 z-50'>
       <Transition
        show={isHoverEllipsis}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div 
          className='absolute top-12 left-0 w-[calc(100%+2px)] bg-gray-900 border border-gray-600 p-2 pl-4 rounded-md text-sm 
          flex flex-wrap justify-start min-h-[50px]'
        >
          <div
            className='absolute w-0 h-0 bg-transparent left-5 -top-7 border-[16px] 
            border-gray-900 border-t-transparent border-r-transparent border-l-transparent
            border-b-gray-900'
          >
            <div className='absolute bg-gray-600 w-[18px] h-[1px] rotate-45 top-[5px] -right-[15px]' />
            <div className='absolute bg-gray-600 w-[17px] h-[1px] -rotate-45 top-[5px] -left-[14.5px]' />
          </div>
          {
            overflowStatuses.length != 0 && overflowStatuses.map((status) => {
              if (!status)
                return
              else
                return (
                  <span key={status?.id} className='flex space-x-2 items-center mr-4' >
                    <span>{status?.name}</span>
                    <span>
                      <Image src={status?.url} width={16} height={16} alt={status.name} />
                    </span>
                  </span>
                )
            })
          }
        </div>
      </Transition>
    </div>
  )
}
