import React, { useEffect, useRef, useState } from 'react'
import { EllipsisHorizontalCircleIcon, ChevronLeftIcon, XMarkIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid'
import PopupStatus from './PopupStatus'
import PopupAc from './PopupAc'
import PopupHp from './PopupHp'
import PopupOverflow from './PopupOverflow'
import StatusIcon from './StatusIcon'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'
import { useRecoilState } from 'recoil'
import PopupDEX from './PopupDEX'
import { selectedCreatureState } from '../atoms/selectedCreatureAtom'
import { monsterManualState } from '../atoms/monsterManualAtom'
import WarningModal from './WarningModal'
import EllipsisPopup from './EllipsisPopup'

export default function DisplayCardCreature({ creatureData, windowSize, ...rest }) {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState);
  const [selectedCreature, setSelectedCreature] = useRecoilState(selectedCreatureState)
  const [isMonsterManualOpen, setIsMonsterManualOpen] = useRecoilState(monsterManualState)
  const [activeStatuses, setActiveStatuses] = useState([...creatureData?.activeStatuses]);
  const [overflowStatuses, setOverflowStatuses] = useState([...creatureData.overflowStatuses]);
  const [isHoverEllipsis, setIsHoverEllipsis] = useState(false);
  const [ellipsisPopupOpen, setEllipsisPopupOpen] = useState(false);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [isAvailableSpace, setIsAvailableSpace] = useState(false);
  const [isSlid, setIsSlid] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const statusBarRef = useRef(null);
  const statusBarInnerRef = useRef(null);
  const cardRef = useRef(null);
  const elementRef = useRef(null)
  const nameRef = useRef(null)
  const isMounted = useRef(false)
  const [stateData, setStateData] = useState({
    ...creatureData,
    activeStatuses: [...creatureData.activeStatuses],
    overflowStatuses: [...creatureData.overflowStatuses],
    hp: parseInt(creatureData.hp),
    tmpHp: parseInt(creatureData.tmpHp),
    ac: parseInt(creatureData.ac),
    bonusAc: parseInt(creatureData.dex_bonus),
    color: creatureData.color
  })

  const updateStatusData = (active, overflow) => {
    const newStateData = { ...stateData };
    newStateData.activeStatuses = active;
    newStateData.overflowStatuses = overflow;
    setStateData(newStateData)
  }

  useEffect(() => {
    const elt = statusBarRef.current
    const inner = statusBarInnerRef.current
    let isOverflowing = elt.clientWidth < elt.scrollWidth;
    let isSpace = elt.clientWidth - inner.clientWidth > 24;

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
    if (!isOverflowed || activeStatuses.length == 0)
      return

    let i = 0;
    while (isOverflowed && i < 10) {
      window.dispatchEvent(new Event('resize'))
      i++;
    }
  }, [windowSize, activeStatuses.length, isOverflowed])

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
    let newActiveCreatures = [...activeCreatures]
    newActiveCreatures = newActiveCreatures.filter((creature) => creature.id != creatureData.id)
    localStorage.removeItem(creatureData.id)
    setActiveCreatures(newActiveCreatures)
  }

  const openMonsterManual = () => {
    setIsMonsterManualOpen(true);
    setSelectedCreature(creatureData)
  }

  useEffect(() => {
    updateStatusData(activeStatuses, overflowStatuses)
  }, [activeStatuses, overflowStatuses])

  useEffect(() => {
    if (creatureData.activeStatuses.length > 0) {
      updateStatusData(creatureData.activeStatuses, creatureData.overflowStatuses)
    }
  }, [creatureData])

  useEffect(() => {
    // Don't run on mount
    if (isMounted.current) {
      localStorage.setItem(stateData.id, JSON.stringify(stateData));
    } else {
      isMounted.current = true;
    }
  }, [stateData])

 
  return (
    <div 
      className={`relative rounded-md border border-gray-700 fix-borders z-auto ${(isSlid || isSliding) && 'overflow-hidden'}`}
      ref={elementRef}
    >
      {/* Underlay */}
      <div 
        className='absolute bg-gray-900 top-0 left-0 w-full h-full rounded-md flex 
        justify-end items-center pr-1.5'
      >
        {
          creatureData.pc == false ? (
            <div className='bg-red-500 rounded-md p-1 cursor-pointer'
              onClick={handleDelete}
            >
              <XMarkIcon className='w-5 h-5 text-white'/>
            </div>
          ) : (
            <WarningModal
              handleDelete={handleDelete}
              elementRef={elementRef}
            />
          )
        }    
      </div>

      {/* Main Card */}
      <div 
        className={`flex py-3 border-0 bg-gray-800 text-stone-300 
        rounded-md shadow-md relative top-0 left-0 px-3 w-full space-x-2 pr-1 transition-transform duration-200
        ${isSlid && '-translate-x-10'}`}
        ref={cardRef}
      >
        <div className={`flex w-full overflow-hidden space-x-2 top-0 left-0 ${isSlid && 'pointer-events-none'}`}>
          {/* Name */}
          <div className={`${ creatureData.pc == false && creatureData.npc == false && 'cursor-pointer'} overflow-hidden`}>
            <span 
              className={`${creatureData.pc && 'text-amber-400'} overflow-ellipsis overflow-hidden whitespace-nowrap`}
              ref={nameRef}
              onClick={(creatureData.pc == false && creatureData.npc == false) ? openMonsterManual : null}
            >
              {creatureData.name}
            </span>
          </div>
          {/* Hp */}
          { creatureData.pc === false &&
            <PopupHp 
              creatureData={creatureData}
              setStateData={setStateData}
              stateData={stateData}
            />
          }
          {/* AC */}
          { creatureData.pc === false &&
            <PopupAc 
              creatureData={creatureData}
              setStateData={setStateData}
              stateData={stateData}
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
                activeStatuses.map((stat) => {
                  if (stat) {
                    return (
                      <StatusIcon 
                        key={stat.u_id}
                        stat={stat}
                        activeStatuses={activeStatuses}
                        setActiveStatuses={setActiveStatuses}
                        overflowStatuses={overflowStatuses}
                        setOverflowStatuses={setOverflowStatuses}
                      />
                    )
                  } else {
                    return
                  }
                })
              }

              {
                overflowStatuses.length > 0 &&
                (
                  <div
                    className='z-0 flex'
                    // onClick={(e) => setIsHoverEllipsis(!isHoverEllipsis)}
                  >
                    {/* Overflow status popup menu */}
                    <EllipsisPopup 
                      setEllipsisPopupOpen={setEllipsisPopupOpen}
                      activeStatuses={activeStatuses}
                      setActiveStatuses={setActiveStatuses}
                      overflowStatuses={overflowStatuses}
                      setOverflowStatuses={setOverflowStatuses}
                      setIsHoverEllipsis={setIsHoverEllipsis}
                      isHoverEllipsis={isHoverEllipsis}
                    />
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
            isHoverEllipsis={isHoverEllipsis}
            overflowStatuses={overflowStatuses}
          />

          {/* Initiative */}
          <div>
            <PopupDEX 
              creatureData={creatureData}
              setStateData={setStateData}
              stateData={stateData}
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
