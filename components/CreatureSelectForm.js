import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'

export default function CreatureSelectForm({ creatures, tab }) {
  const [selectedCreature, setSelectedCreature] = useState('')
  const [query, setQuery] = useState('')
  const [name, setName] = useState('');
  const [hp, setHp] = useState(0);
  const [ac, setAc] = useState(0);
  const [init, setInit] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState);
  const d20Ref = useRef(null);

  const filteredCreatures =
  query === ''
    ? creatures
    : creatures.filter((creature) =>
        creature.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .match(`^${query.toLowerCase().replace(/\s+/g, '')}`)
      )
    
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

  const updateList = (data) => {
    const newArray = [ ...activeCreatures, data ]
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

  const addCreatureToList = (e) => {
    e.preventDefault()
    if (!selectedCreature)
      return
    const selectedCreatureData = {
      ...selectedCreature,
      id: Math.random(),
      max_hp: hp,
      initiative: init,
      dex_bonus: bonus,
      ac: ac,
      pc: false   // player character
    }
    updateList(selectedCreatureData)
  }

  const addPlayerToList = (e) => {
    e.preventDefault()
    if (!name)
      return
    const playerData = {
      id: Math.random(),
      name: name,
      initiative: init,
      dex_bonus: bonus,
      pc: true
    }
    updateList(playerData)
  }

  useEffect(() => {
    if (!selectedCreature)
      return;
    
    const fetchData = async () => {
      const res = await fetch(`https://www.dnd5eapi.co` + selectedCreature.url);
      const json = await res.json()
      setBonus(Math.floor((parseInt(json.dexterity) - 10) / 2))
      setHp(json.hit_points)
      setAc(json.armor_class)
      setInit(0)
    }

    fetchData()
  }, [selectedCreature])

  useEffect(() => {
    setSelectedCreature('')
    setQuery('')
    setName('')
    setHp(0)
    setAc(0)
    setInit(0)
    setBonus(0)
  }, [tab])

  return (
    <form 
      className={`p-4 text-gray-800 grid grid-cols-[1fr_1fr_minmax(125px,1fr)] gap-2 transition-all duration-200
      ${tab === 'player' ? 'h-[160px]' : 'h-[248px]'}`}
      onSubmit={tab == 'player' ? addPlayerToList : addCreatureToList}
    >
      <div className='col-span-2'>
        {/* Problem is here */}
        {
          tab === 'player' || tab === 'custom' ?
            (
              <div>
                <input
                  // autoFocus={true}
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`${tab === 'player' ? 'Character name' : 'Creature / NPC name'}`}
                  className='w-full border-0 rounded-lg py-2 pl-3 pr-10 leading-5 text-gray-800 
                  shadow-md focus:ring-0 focus:shadow-lg bg-gray-100
                  duration-300 transition-shadow'
                />
              </div>
            )
          : tab === 'creatures' ?
          (
            <Combobox value={selectedCreature} onChange={setSelectedCreature}>
              <div className="relative">
                <div className="relative w-full cursor-default rounded-lg bg-white text-left">
                  <Combobox.Input
                    className="w-full border-0 rounded-lg py-2 pl-3 pr-10 leading-5 text-gray-800 
                    shadow-md focus:ring-0 focus:shadow-lg bg-gray-100
                    duration-300 transition-shadow"
                    displayValue={(person) => person.name}
                    onChange={(event) => setQuery(event.target.value)}
                    spellCheck='false'
                    placeholder='Search for a creature...'
                    // autoFocus={true}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-600"
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
                    className="absolute mt-1 max-h-44 w-full overflow-auto rounded-md bg-gray-50 py-1 
                    shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scrollbar-thin 
                    scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md"
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
                              active ? 'bg-gray-600 text-gray-100' : 'text-gray-700'
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
                                    active ? 'text-gray-100' : 'text-gray-700'
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
          )
          : null
        }
        
    
      </div>
      <div className='grid grid-cols-2 gap-2 items-center'>
        {
          tab != 'player' &&
          (
            <>
              <div className='text-gray-100 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>HP :</div>
              <div className='text-gray-100 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>AC :</div>
            </>
          )
        }

        <div className='text-gray-100 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>Initiative (total) :</div>
        <div className='text-gray-100 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>Bonus :</div>
        <div 
          className='text-gray-800 p-0.5 rounded-md text-center text-xs flex justify-center 
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
        <Transition
          className='w-full row-start-1 row-end-2 col-start-2 col-end-3'
          show={tab != 'player'}
          enter="transition-opacity duration-75 delay-400"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
            <input 
              className="w-full border-0 rounded-lg pr-1 text-gray-800 
              focus:ring-0 shadow-md focus:shadow-lg transition-shadow duration-300 text-sm
                bg-gray-100"
              type='number'
              placeholder='0'
              min={0}
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
        </Transition>

        <Transition
          className='w-full row-start-2 row-end-3 col-start-2 col-end-3'
          show={tab != 'player'}
          enter="transition-opacity duration-75 delay-400"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
            <input 
              className="w-full border-0 rounded-lg pr-1 text-gray-800 
              focus:ring-0 shadow-md focus:shadow-lg transition-shadow duration-300 text-sm
                bg-gray-100"
              type='number'
              placeholder='0'
              min={0}
              value={ac}
              onChange={(e) => setAc(e.target.value)}
            />
          </Transition>
        
        <input 
          className={`w-full border-0 rounded-lg pr-1 text-gray-800 col-start-2 col-end-3
          focus:ring-0 shadow-md focus:shadow-lg transition-shadow duration-300 text-sm bg-gray-100
          ${tab == 'player' ? 'row-start-1 row-end-2': 'row-start-3 row-end-4'}`}
          type='number'
          placeholder='0'
          min={-11}
          max={30}
          value={init}
          onChange={(e) => setInit(e.target.value)}
        />
        <input 
          className={`w-full border-0 rounded-lg pr-1 text-gray-800 col-start-2 col-end-3
          focus:ring-0 shadow-md focus:shadow-lg transition-shadow duration-300 text-sm bg-gray-100
          ${tab == 'player' ? 'row-start-2 row-end-3': 'row-start-4 row-end-5'}`}
          type='number'
          placeholder='DEX'
          min={-10}
          max={10}
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
        />
        <button className='bg-gray-100 text-gray-800 p-2 rounded-md w-full
        font-semibold '>
          Add
        </button>
      </div>
    </form>
  )
}
