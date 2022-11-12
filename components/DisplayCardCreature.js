import React, { useEffect, useRef, useState } from 'react'
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import PopupStatus from './PopupStatus'
import PopupAc from './PopupAc'
import PopupHp from './PopupHp'
import PopupOverflow from './PopupOverflow'

export default function DisplayCardCreature({ creatureData, windowSize }) {
  const [activeStatuses, setActiveStatuses] = useState([]);
  const [overflowStatuses, setOverflowStatuses] = useState([]);
  const [isHoverEllipses, setIsHoverEllipses] = useState(false);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [isAvailableSpace, setIsAvailableSpace] = useState(false);
  const statusBarRef = useRef(null);
  const statusBarInnerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const elt = statusBarRef.current
    const inner = statusBarInnerRef.current
    let isOverflowing = elt.clientWidth < elt.scrollWidth;
    let isSpace = elt.clientWidth - inner.clientWidth > 40;

    if (isOverflowing)
      setIsOverflowed(true)
    else
      setIsOverflowed(false)
    
    if (isSpace)
      setIsAvailableSpace(true)
    else
      setIsAvailableSpace(false)
  }, [activeStatuses, windowSize])

  useEffect(() => {
    const newOverflowArray = [...overflowStatuses];
    const newStatusesArray = [...activeStatuses];

    if (isOverflowed)
    {
      newOverflowArray.push(newStatusesArray.pop());
    }
    else if (isAvailableSpace)
    {
      if (overflowStatuses.length == 0)
        return;
      newStatusesArray.push(newOverflowArray.pop());
    }

    setActiveStatuses(newStatusesArray);
    setOverflowStatuses(newOverflowArray);

  }, [windowSize, isOverflowed, isAvailableSpace]);

  useEffect(() => {
    if (cardRef.current.clientWidth < cardRef.current.scrollWidth)
      window.dispatchEvent(new Event('resize'))
  }, [windowSize])
 
  return (
    <div 
      className='flex fix-borders py-3 border border-gray-700 bg-gray-800 text-stone-300 
      rounded-md shadow-md relative space-x-2 px-3 w-full'
      ref={cardRef}
    >
      {/* Name */}
      <div className='cursor-pointer'>
        {creatureData.name}
      </div>
      {/* Hp */}
      <PopupHp 
        creatureData={creatureData}
      />
      {/* AC */}
      <PopupAc 
        creatureData={creatureData}
      />
      {/* Statuses */}
      <div 
        className='flex flex-1 items-center space-x-2 overflow-visible'
        ref={statusBarRef}
      >        
        <div className='inline-flex space-x-2 overflow-visible items-center'
          ref={statusBarInnerRef}
        >
          {
            activeStatuses.map((stat) => (
              <Image key={stat.id} src={stat.url} alt={stat.name} width={16} height={16} />
            ))
          }

          {
            overflowStatuses.length > 0 &&
            (
              <div
                className='z-40 block'
                onClick={(e) => setIsHoverEllipses(!isHoverEllipses)}
                onMouseEnter={(e) => setIsHoverEllipses(true)}  
                onMouseLeave={(e) => setIsHoverEllipses(false)}
              >
                <EllipsisHorizontalCircleIcon className='w-4 h-4' />
              </div>
            )
          }        
          <PopupStatus
            activeStatuses={activeStatuses}
            setActiveStatuses={setActiveStatuses}
            overflowStatuses={overflowStatuses}
            setOverflowStatuses={setOverflowStatuses}
            isOverflowed={isOverflowed}
            isAvailableSpace={isAvailableSpace}
          />
          {
            overflowStatuses.length == 0 && 
            (
              <div className='w-4 h-4 bg-transparent shrink-0'></div>
            )
          }
        </div>
      </div>

      {/* Overflow status popup */}
      <PopupOverflow 
        isHoverEllipses={isHoverEllipses}
        overflowStatuses={overflowStatuses}
      />

      {/* Initiative */}
      <div className='font-bold select-none'>
        {creatureData.initiative}
        {/* ( {creatureData.dex_bonus}  */}
      </div> 
    </div>
  )
}
