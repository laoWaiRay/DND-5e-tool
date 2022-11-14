import React, { useEffect, useRef, useState } from 'react'
import { EllipsisHorizontalCircleIcon, ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/solid'
import PopupStatus from './PopupStatus'
import PopupAc from './PopupAc'
import PopupHp from './PopupHp'
import PopupOverflow from './PopupOverflow'
import StatusIcon from './StatusIcon'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'
import { useRecoilState } from 'recoil'
import PopupDEX from './PopupDEX'

export default function DisplayCardCreature({ creatureData, windowSize }) {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState);
  const [activeStatuses, setActiveStatuses] = useState([]);
  const [overflowStatuses, setOverflowStatuses] = useState([]);
  const [isHoverEllipses, setIsHoverEllipses] = useState(false);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [isAvailableSpace, setIsAvailableSpace] = useState(false);
  const [isSlid, setIsSlid] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const statusBarRef = useRef(null);
  const statusBarInnerRef = useRef(null);
  const cardRef = useRef(null);
  const elementRef = useRef(null)
  const nameRef = useRef(null)

  useEffect(() => {
    console.log(activeStatuses)
  }, [activeStatuses])

  useEffect(() => {
    const elt = statusBarRef.current
    const inner = statusBarInnerRef.current
    let isOverflowing = elt.clientWidth < elt.scrollWidth;
    let isSpace = elt.clientWidth - inner.clientWidth > 30;

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize, isOverflowed, isAvailableSpace]);

  useEffect(() => {
    if (cardRef.current.clientWidth < cardRef.current.scrollWidth)
      window.dispatchEvent(new Event('resize'))
  }, [windowSize])

  useEffect(() => {
    if (!isSlid)
    {
      setTimeout(() => {
        setIsSliding(false)
      }, 200);
    }
    
  }, [isSlid])

  const detectClick = (e) => {
    console.dir(e.target)
    if (elementRef.current && !elementRef.current.contains(e.target))
      setIsSlid(false)
  }

  useEffect(() => {
    if (isSlid) {
      window.addEventListener('click', detectClick)
    } else {
      window.removeEventListener('click', detectClick)
    }

    return () => window.removeEventListener('click', detectClick)
  }, [isSlid])

  useEffect(() => {
    if (creatureData.color)
    {
      nameRef.current.style.color = creatureData.color;
    }
  }, [creatureData])

  const handleDelete = () => {
    console.log(creatureData, activeCreatures)
    let newActiveCreatures = [...activeCreatures]
    newActiveCreatures = newActiveCreatures.filter((creature) => creature.id != creatureData.id)
    setActiveCreatures(newActiveCreatures)
  }
 
  return (
    <div 
      className={`relative rounded-md border border-gray-700 fix-borders z-auto ${(isSlid || isSliding) && 'overflow-hidden'}`}
      ref={elementRef}
    >
      {/* Underlay */}
      <div 
        className='absolute bg-gray-900 top-0 left-0 w-full h-full rounded-md flex 
        justify-end items-center'
      >
        <div className='bg-red-500 rounded-md mr-1.5 p-1 cursor-pointer'
          onClick={handleDelete}
        >
          <XMarkIcon className='w-5 h-5 text-white'/>
        </div>
      </div>

      {/* Main Card */}
      <div 
        className={`flex py-3 border-0 bg-gray-800 text-stone-300 
        rounded-md shadow-md relative top-0 left-0 px-3 w-full space-x-2 pr-1 transition-transform duration-200
        ${isSlid && '-translate-x-10'}`}
        ref={cardRef}
      >
        <div className={`flex w-full space-x-2 top-0 left-0 ${isSlid && 'pointer-events-none'}`}>
          {/* Name */}
          <div className='cursor-pointer'>
            <span 
              className={`${creatureData.pc && 'text-amber-300'}`}
              ref={nameRef}
            >
              {creatureData.name}
            </span>
          </div>
          {/* Hp */}
          { creatureData.pc === false &&
            <PopupHp 
              creatureData={creatureData}
            />
          }
          {/* AC */}
          { creatureData.pc === false &&
            <PopupAc 
              creatureData={creatureData}
            />
          }
          
          {/* Statuses */}
          <div 
            className='flex flex-1 items-center space-x-2 px-1 overflow-visible'
            ref={statusBarRef}
          >        
            <div className='inline-flex space-x-2 overflow-visible items-center'
              ref={statusBarInnerRef}
            >
              { 
                activeStatuses.map((stat) => (
                  <StatusIcon 
                    key={stat.u_id}
                    stat={stat}
                    activeStatuses={activeStatuses}
                    setActiveStatuses={setActiveStatuses}
                    overflowStatuses={overflowStatuses}
                    setOverflowStatuses={setOverflowStatuses}
                  />
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
          <div>
            <PopupDEX 
              creatureData={creatureData}
            />
          </div> 
        </div>

        {/* Expand Menu */}
        <div className='flex items-center border-l border-l-gray-600 pl-1'>
          <ChevronLeftIcon 
            className={`w-5 h-5 cursor-pointer duration-200 transition-transform ${ isSlid && 'rotate-180'}`}
            onClick={() => {setIsSlid(!isSlid); setIsSliding(true)}}
          />
        </div>
      </div>
       
    </div>
  )
}
