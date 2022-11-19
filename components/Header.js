import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { monsterManualState } from '../atoms/monsterManualAtom'
import { spellbookState } from '../atoms/spellbookAtom'

export default function Header() {
  const [monsterManualOpen, setMonsterManualOpen] = useRecoilState(monsterManualState)
  const [spellbookOpen, setSpellbookOpen] = useRecoilState(spellbookState)
  const [transitioning, setTransitioning] = useState(false);

  const openPage = (prevIsOpen, closeFn, openFn) => {
    if (prevIsOpen) {
      setTransitioning(true)
      closeFn(false);
      setTimeout(() => {
        openFn(true)
        setTransitioning(false)
      }, 300);
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
            className={`cursor-pointer ${!transitioning && !monsterManualOpen && !spellbookOpen && 'text-gray-100'}`}
            onClick={() => { setMonsterManualOpen(false); setSpellbookOpen(false) }}
          >
            Battle
          </div>
          <div 
            className={`cursor-pointer ${monsterManualOpen && 'text-gray-100'}`}
            onClick={() => { openPage(spellbookOpen, setSpellbookOpen, setMonsterManualOpen) }}
          >
            Monster Manual
          </div>
          <div
            className={`cursor-pointer ${spellbookOpen && 'text-gray-100'}`}
            onClick={() => { openPage(monsterManualOpen, setMonsterManualOpen, setSpellbookOpen) }}
          >
            Spells
          </div>
          <div
            className={`cursor-pointer`}
            onClick={() => {}}
          >
            Feats
          </div>
          <div
            className={`cursor-pointer`}
            onClick={() => {}}
          >
            About
          </div>
        </nav>
      </div>
    </div>
  )
}
