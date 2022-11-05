import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import PopupForm from './PopupForm'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'

export default function DisplayCardCreature({ creatureData }) {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState)
  const [hpOpen, setHpOpen] = useState(false)
  const [hpVal, setHpVal] = useState(creatureData.max_hp)
 
  return (
    <div 
      className='flex fix-borders py-3 px-4 border border-stone-400 bg-stone-800 text-stone-300 
      rounded-md shadow-md relative'
    >
      {/* Name */}
      <div className=' mr-2'>
        {creatureData.name}
      </div>
      {/* Hp */}
      <div className='flex-1 relative'>
        <div 
          className={`bg-white text-black w-10 flex justify-center rounded-full select-none cursor-pointer
          ${hpOpen ? 'z-50' : ''}`}
          onClick={() => setHpOpen(!hpOpen)}
        >
          {hpVal}
        </div>
      </div>
      {hpOpen &&
          (
            <PopupForm 
              maxHp={creatureData.max_hp}
              val={hpVal}
              setVal={setHpVal}
              setFormOpen={setHpOpen}
            />
          )
        }
      {/* Statuses */}
      {/* Initiative */}
      <div className=''>
        {creatureData.initiative}
        {/* ( {creatureData.dex_bonus}  */}
      </div>
    </div>
  )
}
