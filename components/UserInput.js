import { Combobox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React, { Fragment, useEffect, useRef, useState } from 'react'

export default function UserInput({ creatures }) {
  const [query, setQuery] = useState('')
  const [hp, setHp] = useState(0);
  const [init, setInit] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [tab, setTab] = useState('player');
  const [selectedCreature, setSelectedCreature] = useState(creatures[0])
  const [creature, setCreature] = useState(null);
  const d20Ref = useRef(null);

  useEffect(() => {
    // console.log(creatures)
  }, [creatures])

  useEffect(() => {
    if (!selectedCreature)
      return;
    
    creatures.find
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
  
  const addToList = (e) => {
    e.preventDefault()
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
    setInit(Math.floor(Math.random() * 20) + 1)
  }

  return (
    <div className='mt-auto'>
      <div className='grid grid-cols-3 m-4 mb-0 mt-auto border bg-gray-50 rounded-md max-w-4xl shadow-sm'>
        <div 
            className={`font-semibold text-center p-0.5 cursor-pointer border-r
            ${tab === 'player' && 'bg-stone-800 text-white'}`}
            onClick={(e) => setTab('player')}
          >
          Player
        </div>
        <div 
          className={`font-semibold text-center p-0.5 cursor-pointer border-r
          ${tab === 'creatures' && 'bg-stone-800 text-white'}`}
          onClick={(e) => setTab('creatures')}
        >
          Creatures
        </div>
        <div 
          className={`font-semibold text-center p-0.5 cursor-pointer
          ${tab === 'custom' && 'bg-stone-800 text-white'}`}
          onClick={(e) => setTab('custom')}
        >
          Custom
        </div>
      </div>
      <div className='bg-gray-50 m-4 mt-2 rounded-md max-w-2xl border shadow-md'>
        <form 
          className='p-4 text-black h-52 grid grid-cols-3 gap-2'
          onSubmit={addToList}
        >
          <div className='col-span-2'>
            <Combobox value={selectedCreature} onChange={setSelectedCreature}>
              <div className="relative">
                <div className="relative w-full cursor-default rounded-lg bg-white text-left">
                  <Combobox.Input
                    className="w-full border-0 rounded-lg py-2 pl-3 pr-10 leading-5 text-gray-900 
                    shadow-md focus:ring-0 focus:shadow-lg
                    duration-300 transition-shadow"
                    displayValue={(person) => person.name}
                    onChange={(event) => setQuery(event.target.value)}
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
                              active ? 'bg-stone-800 text-white' : 'text-gray-500'
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
            <div className='text-stone-800 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>HP :</div>
            <div className='text-stone-800 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>Initiative (total) :</div>
            <div className='text-stone-800 px-2 rounded-md w-full text-center text-xs col-start-1 col-end-2'>Bonus :</div>
            <button 
              className='text-stone-800 p-0.5 rounded-md w-full text-center text-xs flex justify-center 
              items-center col-start-1 col-end-2'
              onClick={spinDice}
            >
              <div 
                className='transition-transform duration-300'
                ref={d20Ref}
              >
                <Image src='/images/d20-dark.png' alt='d20' width={28} height={28} /> 
              </div>
            </button>
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
              min={1}
              max={50}
              value={init}
              onChange={(e) => setInit(e.target.value)}
            />
            <input 
              className="w-full border-0 rounded-lg pr-1 text-gray-900 
              focus:ring-0 shadow-md focus:shadow-lg transition-shadow duration-300
              col-start-2 col-end-3 row-start-3 row-end-4"
              type='number'
              placeholder='DEX'
              min={0}
              max={20}
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
            />
            <button className='bg-stone-800 text-white p-2 rounded-md w-full
            active:bg-stone-700 font-semibold col-start-2 col-end-3'>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
