import { Popover } from '@headlessui/react'
import { EllipsisHorizontalCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import React, { useRef } from 'react'
import Image from 'next/image'

export default function EllipsisPopup({ setEllipsisPopupOpen, activeStatuses, overflowStatuses, 
setActiveStatuses, setOverflowStatuses, setIsHoverEllipsis }) {
  
  const ref = useRef(null)

  const handleClose = (e, close) => {
    let newOverflowArray = [...overflowStatuses]
    // let newStatusesArray = [...activeStatuses]
    const name = e.target.dataset.name
    console.log('removing', name)
    console.log(newOverflowArray)
    newOverflowArray = newOverflowArray.filter((condition) => condition.name != name)
    setOverflowStatuses(newOverflowArray)
    setIsHoverEllipsis(false)
    close(ref)
  }

  return (
    <>
      <div ref={ref}></div>
      <Popover>
        {({ close }) => (
          <>
            <Popover.Button className='flex'>
              <EllipsisHorizontalCircleIcon 
                className='w-4 h-4'
                onClick={() => { setEllipsisPopupOpen(true); setIsHoverEllipsis(false) }}
                onMouseEnter={(e) => setIsHoverEllipsis(true)}  
                onMouseLeave={(e) => setIsHoverEllipsis(false)}
              />
            </Popover.Button>
            <Popover.Panel>
              <div 
                className='absolute top-12 left-0 w-[calc(100%+2px)] bg-gray-900 border border-gray-400 p-2 pl-4 rounded-md text-sm 
                flex flex-wrap justify-start min-h-[50px]'
              >
                <div
                  className='absolute w-0 h-0 bg-transparent left-5 -top-7 border-[16px] 
                  border-gray-900 border-t-transparent border-r-transparent border-l-transparent
                  border-b-gray-900'
                >
                  <div className='absolute bg-gray-400 w-[18px] h-[1px] rotate-45 top-[5px] -right-[15px]' />
                  <div className='absolute bg-gray-400 w-[17px] h-[1px] -rotate-45 top-[5px] -left-[14.5px]' />
                </div>
                {
                  overflowStatuses.length != 0 && overflowStatuses.map((status) => 
                    { return status != null &&
                      <span key={status?.id} className='flex space-x-2 items-center mr-4' >
                        <span>{status?.name}</span>
                        <span className='relative'>
                          <Image src={status?.url} width={16} height={16} alt={status?.name} />
                          
                          <div 
                            className='absolute -right-1 -bottom-1 bg-gray-900 rounded-full cursor-pointer pointer-events-auto'
                            onClick={(e) => handleClose(e, close)} 
                            data-name={status.name}
                          >
                            <XCircleIcon
                              className='w-6 h-6 text-red-600 pointer-events-none'
                            />
                          </div>
                        </span>
                      </span>
                    }
                  )
                }
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  )
}
