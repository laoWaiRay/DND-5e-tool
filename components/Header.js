import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { aboutState } from '../atoms/aboutAtom'
import { conditionsState } from '../atoms/conditionsAtom'
import { monsterManualState } from '../atoms/monsterManualAtom'
import { scrollToConditionState } from '../atoms/scrollToConditionAtom'
import { spellbookState } from '../atoms/spellbookAtom'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'
import ReturnButton from './ReturnButton'

export default function Header() {
  const [monsterManualOpen, setMonsterManualOpen] = useRecoilState(monsterManualState)
  const [spellbookOpen, setSpellbookOpen] = useRecoilState(spellbookState)
  const [conditionsOpen, setConditionsOpen] = useRecoilState(conditionsState)
  const [scrollToCondition, setScrollToCondition] = useRecoilState(scrollToConditionState)
  const [aboutOpen, setAboutOpen] = useRecoilState(aboutState)
  const [transitioning, setTransitioning] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <>
      <div className='px-6 pr-5 py-0.5 md:py-0 sm:px-8 bg-gray-900 w-full z-[51]'>
        <div className='flex items-center w-full'>
          <div className='relative aspect-auto mr-2 flex items-center shrink-0'>
            <Image src='/images/d20-holo.png' alt='d20' className='h-6 w-6' height={24} width={24} />
          </div>
          <div className='relative aspect-auto hidden shrink-0 md:flex md:items-center pr-2'>
            <Image src='/images/logo-light.png' alt='logo' className='h-8 w-64' height={32} width={256} priority />
          </div>
          
          <nav className='flex text-gray-400 xs:space-x-4 flex-1 xs:ml-4 justify-end xs:justify-start relative'>
            <div 
              className={`cursor-pointer ${!transitioning && !monsterManualOpen && !spellbookOpen 
              && !conditionsOpen && !aboutOpen && 'text-gray-100'} py-4 hidden xs:block`}
              onClick={() => { closeAllPages() }}
            >
              Combat
            </div>
            <div 
              className={`whitespace-nowrap cursor-pointer ${monsterManualOpen && 'text-gray-100'} py-4
              hidden xs:block `}
              onClick={() => { openPage([spellbookOpen, conditionsOpen, aboutOpen], setMonsterManualOpen) }}
            >
              Monster Manual
            </div>
            <div
              className={`cursor-pointer ${spellbookOpen && 'text-gray-100'} py-4 hidden xs:block`}
              onClick={() => { openPage([monsterManualOpen, conditionsOpen, aboutOpen], setSpellbookOpen) }}
            >
              Spells
            </div>
            <div
              className={`cursor-pointer ${conditionsOpen && 'text-gray-100'} py-4 hidden xs:block`}
              onClick={() => { openPage([monsterManualOpen, spellbookOpen, aboutOpen], setConditionsOpen) }}
            >
              Conditions
            </div>
            <div
              className={`cursor-pointer ${aboutOpen && 'text-gray-100'} py-4 hidden xs:block`}
              onClick={() => { openPage([monsterManualOpen, spellbookOpen, conditionsOpen], setAboutOpen) }}
            >
              About
            </div>

            {/* Return Button */}
            {
              ( monsterManualOpen || spellbookOpen || conditionsOpen || aboutOpen ) && (
                <div className='xs:hidden z-50 text-gray-400 cursor-pointer scale-90'>
                  <ReturnButton />
                </div>
              )
            }
            
            <div 
              className='p-1.5 xs:hidden -mr-2'
              onClick={(e) => setDropdownOpen(!dropdownOpen)}
            >
              <Bars3Icon className='w-9 h-10 rounded-sm text-gray-400'/>
            </div>
            
          </nav>
        </div>
      </div>
      {/* Dropdown Menu */}
      <Transition
        show={dropdownOpen}
        enter="transition-all duration-300"
        enterFrom="-translate-y-64"
        enterTo="translate-y-3"
        leave="transition-all duration-300"
        leaveFrom="translate-y-3"
        leaveTo="-translate-y-64"
        className='absolute top-11 left-0 z-50'
      >
        <div className='w-screen bg-gray-900 text-gray-300'>
          <ul className='flex flex-col'>
            <li 
              className='border-y border-gray-700 p-3 text-center'
              onClick={() => { closeAllPages(); setDropdownOpen(false) }}
            >
              Battle
            </li>
            <li 
              className='border-b border-gray-700 p-3 text-center'
              onClick={() => { openPage([spellbookOpen, conditionsOpen, aboutOpen], setMonsterManualOpen); setDropdownOpen(false) }}
            >
              Monster Manual
            </li>
            <li 
              className='border-b border-gray-700 p-3 text-center'
              onClick={() => { openPage([monsterManualOpen, conditionsOpen, aboutOpen], setSpellbookOpen); setDropdownOpen(false) }}
            >
              Spellbook
            </li>
            <li 
              className='border-b border-gray-700 p-3 text-center'
              onClick={() => { openPage([monsterManualOpen, spellbookOpen, aboutOpen], setConditionsOpen); setDropdownOpen(false) }}
            >
              Conditions
            </li>
            <li 
              className='border-b border-gray-700 p-3 text-center'
              onClick={() => { openPage([monsterManualOpen, spellbookOpen, conditionsOpen], setAboutOpen); setDropdownOpen(false) }}
            >
              About
            </li>
          </ul>
        </div>
      </Transition>
    </>
  )
}
