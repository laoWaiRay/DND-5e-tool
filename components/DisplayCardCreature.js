import React, { useState } from 'react'
import PopupForm from './PopupForm'
import Image from 'next/image'
import PopupStatus from './PopupStatus'
import { HeartIcon } from '@heroicons/react/24/solid'
import PopupAc from './PopupAc'

export default function DisplayCardCreature({ creatureData }) {
  const [hpOpen, setHpOpen] = useState(false)
  const [hpVal, setHpVal] = useState(creatureData.max_hp)
  const [tmpHp, setTmpHp] = useState(0);
  const [activeStatuses, setActiveStatuses] = useState([]);

  // console.log(creatureData)
 
  return (
    <div 
      className='flex fix-borders py-3 border border-gray-700 bg-gray-800 text-stone-300 
      rounded-md shadow-md relative space-x-2 px-3'
    >
      {/* Name */}
      <div className='cursor-pointer'>
        {creatureData.name}
      </div>
      {/* Hp */}
      <div className='relative'>
        <div 
          className={`bg-gray-100 text-gray-800 w-10 flex justify-center rounded-full select-none 
          cursor-pointer ring-1 ring-gray-700
          ${hpOpen ? 'z-50' : ''}
          ${parseInt(tmpHp) > 0 && '!text-orange-400'}`}
          onClick={() => setHpOpen(!hpOpen)}
        >
          {parseInt(hpVal) + parseInt(tmpHp)}
        </div>
        <div className='absolute -left-[5px] -top-1 text-red-500'>
          <HeartIcon className='w-4 h-4 stroke-gray-800'/>
        </div>
      </div>
      {hpOpen &&
        (
          <PopupForm 
            maxHp={creatureData.max_hp}
            val={hpVal}
            setVal={setHpVal}
            tmpHp={tmpHp}
            setTmpHp={setTmpHp}
            setFormOpen={setHpOpen}
          />
        )
      }
      {/* AC */}
      <PopupAc 
        creatureData={creatureData}
      />
      {/* Statuses */}
      <div className='flex-1 flex items-center space-x-2 px-1'> 
        <Image src='/images/conditions/Concentration.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Bleeding Out.png' alt='Concentration' width={16} height={16} />
        {/* <Image src='/images/conditions/Blinded.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Charmed.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Deafened.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Exhausted.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Grappled.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Bleeding Out.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Blinded.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Charmed.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Deafened.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Exhausted.png' alt='Concentration' width={16} height={16} />
        <Image src='/images/conditions/Grappled.png' alt='Concentration' width={16} height={16} /> */}
        <PopupStatus 
          setHpOpen={setHpOpen}
        />
      </div>


      {/* Initiative */}
      <div className='font-bold select-none'>
        {creatureData.initiative}
        {/* ( {creatureData.dex_bonus}  */}
      </div>
    </div>
  )
}
