import { Combobox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'

export default function UserInput({ creatures }) {
  const [query, setQuery] = useState('')
  const [hp, setHp] = useState(0);
  const [init, setInit] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [tab, setTab] = useState('player');
  const [selectedCreature, setSelectedCreature] = useState(creatures[0])
  const [creature, setCreature] = useState(null);
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState);
  const d20Ref = useRef(null);

  useEffect(() => {
    // console.log(creatures)
  }, [creatures])

  useEffect(() => {
    console.log('Active Creatures', activeCreatures)
  }, [activeCreatures])

  useEffect(() => {
    if (!selectedCreature)
      return;
    
    const fetchData = async () => {
      const res = await fetch(`https://www.dnd5eapi.co` + selectedCreature.url);
      const json = await res.json()
      setBonus(Math.floor((parseInt(json.dexterity) - 10) / 2))
      setHp(json.hit_points)
      setInit(0)
    }

    fetchData()
    // console.log(selectedCreature)
  }, [selectedCreature])

  const filteredCreatures =
  query === ''
    ? creatures
    : creatures.filter((creature) =>
        creature.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )
  
  const addToCreaturesList = (e) => {
    e.preventDefault()
    if (!selectedCreature)
      return
    const selectedCreatureData = {
      ...selectedCreature,
      max_hp: hp,
      initiative: init,
      dex_bonus: bonus
    }
    const newArray = [ ...activeCreatures, selectedCreatureData ]
    newArray.sort((a, b) => {
      if (a.initiative != b.initiative) {
        return parseInt(b.initiative) - parseInt(a.initiative)
      }
      else {
        return parseInt(b.dex_bonus) - parseInt(a.dex_bonus)
      }
    })
    setActiveCreatures(newArray)
  }

  const spinDice = (e) => {
    e.preventDefault()

    if (isSpinning)
    {
      return
    }

    setIsSpinning(true)
    d20Ref.current.classList.add('animate-spin-fast')

    setTimeout(() => {
      d20Ref.current.classList.remove('animate-spin-fast')
      setIsSpinning(false)
    }, 1000)
    setInit(Math.floor(Math.random() * 20) + 1 + bonus)
  }

  return (
    <div className='mt-auto'>
      <div 
        className='grid grid-cols-3 m-4 mb-0 mt-auto border bg-stone-700 text-stone-300 
        rounded-md max-w-4xl shadow-sm border-stone-500'
      >
        <div 
            className={`font-semibold text-center p-0.5 cursor-pointer border-r-stone-500
            ${tab === 'player' && 'bg-stone-50 text-stone-800 rounded-md'}
            ${tab != 'creatures' && 'border-r'}`}
            onClick={(e) => setTab('player')}
          >
          Player
        </div>
        <div 
          className={`font-semibold text-center p-0.5 cursor-pointer border-r-stone-500
          ${tab === 'creatures' && 'bg-stone-50 text-stone-800 rounded-md'}
          ${tab != 'custom' && 'border-r'}`}
          onClick={(e) => setTab('creatures')}
        >
          Creatures
        </div>
        <div 
          className={`font-semibold text-center p-0.5 cursor-pointer
          ${tab === 'custom' && 'bg-stone-50 text-stone-800 rounded-md'}`}
          onClick={(e) => setTab('custom')}
        >
          Custom
        </div>
      </div>
      <div className='bg-stone-800 border-stone-500 m-4 mt-2 rounded-md max-w-2xl border shadow-md'>
        <form 
          className='p-4 text-black h-52 grid grid-cols-[1fr_1fr_minmax(125px,1fr)] gap-2'
          onSubmit={addToCreaturesList}
        >
          <div className='col-span-2'>
            <Combobox value={selectedCreature} onChange={setSelectedCreature}>
              <div className="relative">
                <div className="relative w-full cursor-default rounded-lg bg-white text-left">
                  <Combobox.Input
                    className="w-full border-0 rounded-lg py-2 pl-3 pr-10 leading-5 text-stone-800 
                    shadow-md focus:ring-0 focus:shadow-lg
                    duration-300 transition-shadow"
                    displayValue={(person) => person.name}
                    onChange={(event) => setQuery(event.target.value)}
                    spellCheck='false'
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  enterFrom='opacity-0'
                  enter='transition ease-in duration-100'
                  enterTo='opacity-100'
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
                >
                  <Combobox.Options 
                    className="absolute mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 
                    shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scrollbar-thin 
                    scrollbar-thumb-gray-200 scrollbar-thumb-rounded-md"
                  >
                    {filteredCreatures.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none py-0.5 px-3 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredCreatures.map((creature) => (
                        <Combobox.Option
                          key={creature.index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-0.5 px-3 ${
                              active ? 'bg-stone-600 text-white' : 'text-gray-500'
                            }`
                          }
                          value={creature}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-bold' : 'font-normal'
                                }`}
                              >
                                {creature.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 right-4 flex items-center pl-3 ${
                                    active ? 'text-white' : 'text-gray-800'
                                  }`}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <div className='grid grid-cols-2 grid-rows-4 gap-2 items-center'>
            <div className='text-stone-300 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>HP :</div>
            <div className='text-stone-300 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>Initiative (total) :</div>
            <div className='text-stone-300 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>Bonus :</div>
            <div 
              className='text-stone-800 p-0.5 rounded-md text-center text-xs flex justify-center 
              items-center col-start-1 col-end-2 cursor-pointer'
              onClick={spinDice}
            >
              <div 
                className='transition-transform duration-300'
                ref={d20Ref}
              >
                <Image src='/images/d20-light.png' alt='d20' width={28} height={28} className='h-auto w-auto' /> 
              </div>
            </div>
            <input 
              className="w-full border-0 rounded-lg pr-1 text-gray-900 
              focus:ring-0 shadow-md focus:shadow-lg transition-shadow duration-300
              col-start-2 col-end-3 row-start-1 row-end-2"
              type='number'
              placeholder='0'
              min={0}
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
            <input 
              className="w-full border-0 rounded-lg pr-1 text-gray-900 
              focus:ring-0 shadow-md focus:shadow-lg transition-shadow duration-300
              col-start-2 col-end-3 row-start-2 row-end-3"
              type='number'
              placeholder='0'
              min={-11}
              max={30}
              value={init}
              onChange={(e) => setInit(e.target.value)}
            />
            <input 
              className="w-full border-0 rounded-lg pr-1 text-gray-900 
              focus:ring-0 shadow-md focus:shadow-lg transition-shadow duration-300
              col-start-2 col-end-3 row-start-3 row-end-4"
              type='number'
              placeholder='DEX'
              min={-10}
              max={10}
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
            />
            <button className='bg-white text-stone-800 p-2 rounded-md w-full
            active:bg-stone-300 font-semibold col-start-2 col-end-3'>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
