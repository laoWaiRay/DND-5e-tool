import React from 'react'
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline'
import { monsterManualState } from '../atoms/monsterManualAtom'
import { spellbookState } from '../atoms/spellbookAtom'
import { conditionsState } from '../atoms/conditionsAtom'
import { scrollToConditionState } from '../atoms/scrollToConditionAtom'
import { aboutState } from '../atoms/aboutAtom'
import { useRecoilState } from 'recoil'

export default function ReturnButton() {
  const [monsterManualOpen, setMonsterManualOpen] = useRecoilState(monsterManualState)
  const [spellbookOpen, setSpellbookOpen] = useRecoilState(spellbookState)
  const [conditionsOpen, setConditionsOpen] = useRecoilState(conditionsState)
  const [scrollToCondition, setScrollToCondition] = useRecoilState(scrollToConditionState)
  const [aboutOpen, setAboutOpen] = useRecoilState(aboutState)

  const closeAllPages = () => {
    setMonsterManualOpen(false)
    setSpellbookOpen(false)
    setConditionsOpen(false)
    setAboutOpen(false)
    setScrollToCondition('')
  }

  return (
    <ArrowLeftCircleIcon 
      className='h-12 w-12' 
      onClick={closeAllPages}
    />
  )
}
