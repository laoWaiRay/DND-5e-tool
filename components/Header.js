import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { aboutState } from '../atoms/aboutAtom'
import { conditionsState } from '../atoms/conditionsAtom'
import { monsterManualState } from '../atoms/monsterManualAtom'
import { scrollToConditionState } from '../atoms/scrollToConditionAtom'
import { spellbookState } from '../atoms/spellbookAtom'

export default function Header() {
  const [monsterManualOpen, setMonsterManualOpen] = useRecoilState(monsterManualState)
  const [spellbookOpen, setSpellbookOpen] = useRecoilState(spellbookState)
  const [conditionsOpen, setConditionsOpen] = useRecoilState(conditionsState)
  const [scrollToCondition, setScrollToCondition] = useRecoilState(scrollToConditionState)
  const [aboutOpen, setAboutOpen] = useRecoilState(aboutState)
  const [transitioning, setTransitioning] = useState(false);

  const closeAllPages = () => {
    setMonsterManualOpen(false)
    setSpellbookOpen(false)
    setConditionsOpen(false)
    setAboutOpen(false)
    setScrollToCondition('')
  }

  const openPage = (otherPages, openFn) => {
    let otherPagesOpen = false;
    
    otherPages.forEach((page) => {
      if (page)
      {
        otherPagesOpen = true;
      }
    })

    if (otherPagesOpen) {
      setTransitioning(true)
      closeAllPages()
      setTimeout(() => {
        openFn(true)
        setTransitioning(false)
      }, 200);
    } else {
      openFn(true)
    }
  }

  return (
    <div className='px-6 py-4 md:py-3 md:px-8 bg-gray-900 w-full z-50'>
      <div className='flex items-center w-full'>
        <div className='relative h-6 w-6 mr-2'>
          <Image src='/images/d20-holo.png' alt='d20' fill />
        </div>
        <div className='relative h-8 w-64 hidden md:block'>
          <Image src='/images/logo-light.png' alt='logo' fill />
        </div>
        
        <nav className='flex text-gray-400 space-x-4 flex-1 ml-4'>
          <div 
            className={`cursor-pointer ${!transitioning && !monsterManualOpen && !spellbookOpen 
            && !conditionsOpen && !aboutOpen && 'text-gray-100'}`}
            onClick={() => { closeAllPages() }}
          >
            Battle
          </div>
          <div 
            className={`whitespace-nowrap cursor-pointer ${monsterManualOpen && 'text-gray-100'}`}
            onClick={() => { openPage([spellbookOpen, conditionsOpen, aboutOpen], setMonsterManualOpen) }}
          >
            Monster Manual
          </div>
          <div
            className={`cursor-pointer ${spellbookOpen && 'text-gray-100'}`}
            onClick={() => { openPage([monsterManualOpen, conditionsOpen, aboutOpen], setSpellbookOpen) }}
          >
            Spells
          </div>
          <div
            className={`cursor-pointer ${conditionsOpen && 'text-gray-100'}`}
            onClick={() => { openPage([monsterManualOpen, spellbookOpen, aboutOpen], setConditionsOpen) }}
          >
            Conditions
          </div>
          <div
            className={`cursor-pointer ${aboutOpen && 'text-gray-100'}`}
            onClick={() => { openPage([monsterManualOpen, spellbookOpen, conditionsOpen], setAboutOpen) }}
          >
            About
          </div>
        </nav>
      </div>
    </div>
  )
}
