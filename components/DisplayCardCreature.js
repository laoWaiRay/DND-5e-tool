import React, { useEffect, useRef, useState } from 'react'
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import PopupStatus from './PopupStatus'
import PopupAc from './PopupAc'
import PopupHp from './PopupHp'
import PopupOverflow from './PopupOverflow'

export default function DisplayCardCreature({ creatureData }) {
  const [activeStatuses, setActiveStatuses] = useState([]);
  const [overflowStatuses, setOverflowStatuses] = useState([]);
  const [isHoverEllipses, setIsHoverEllipses] = useState(false);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const statusBarRef = useRef(null);

  // useEffect(() => {
  //   console.log('->', overflowStatuses)
  // }, [overflowStatuses])

  // useEffect(() => {
  //   console.log(isHoverEllipses)
  // },[isHoverEllipses])

  useEffect(() => {
    const elt = statusBarRef.current
    let isOverflowing = elt.clientWidth < elt.scrollWidth;
    console.log(isOverflowing)

    if (isOverflowing)
      setIsOverflowed(true)
    else
      setIsOverflowed(false)
  }, [activeStatuses])
 
  return (
    <div 
      className='flex fix-borders py-3 border border-gray-700 bg-gray-800 text-stone-300 
      rounded-md shadow-md relative space-x-2 px-3 w-full'
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
        className='flex flex-1 items-center space-x-2 px-1'
        ref={statusBarRef}
      >        
        <Image src='/images/conditions/Blinded.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Charmed.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Deafened.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Exhausted.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Grappled.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Bleeding Out.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Blinded.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Charmed.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Deafened.png' alt='Concentration' width={16} height={16} />

        {
          activeStatuses.map((status) => (
            <span className='relative w-4 h-4' key={status.id} data-id={status.id} data-name={status.name} data-url={status.url} data-status='true'>
              <Image src={status.url} alt={status.name} width={16} height={16} className='min-w-[16px]' />
            </span>
          ))
        }
        {
          overflowStatuses.length > 0 &&
          (
            <div
              className='z-40'
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
        />
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
