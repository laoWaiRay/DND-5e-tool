import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRecoilState } from 'recoil'
import { loadingState } from '../atoms/loadingAtom'
import ReturnButton from './ReturnButton'
import { monsterManualState } from '../atoms/monsterManualAtom'
import { spellbookState } from '../atoms/spellbookAtom'
import { conditionsState } from '../atoms/conditionsAtom'

export default function Spellbook({ spells }) {
  const [isLoading, setIsLoading] = useRecoilState(loadingState)
  const [query, setQuery] = useState('')
  const [selectedSpell, setSelectedSpell] = useState('')
  const [data, setData] = useState(null)

  const filteredSpells =
  query === ''
    ? spells
    : spells.filter((spell) =>
        spell.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .match(`^${query.toLowerCase().replace(/\s+/g, '')}`)
      )

  useEffect(() => {
    if (!selectedSpell)
    return;

    setIsLoading(true)
    
    const fetchData = async () => {
      const res = await fetch(`https://www.dnd5eapi.co` + selectedSpell.url);
      const json = await res.json()
      setData(json)
      setIsLoading(false)
      console.log(json)
    }

    try {
      fetchData()
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
    
  }, [selectedSpell, setIsLoading])

  const appendText = (num) => {
    let suffix = "th";
    if (num % 10 == 1 && num % 100 != 11) suffix = "st";
    if (num % 10 == 2 && num % 100 != 12) suffix = "nd";
    if (num % 10 == 3 && num % 100 != 13) suffix = "rd";
 
    return num + suffix;
 };

  return (
    <div className='w-full h-full relative max-w-3xl'>
      <div className='max-w-xs mx-auto z-50 mb-5'>
        <Combobox value={selectedSpell} onChange={setSelectedSpell}>
          <div className="relative">
            <div className="relative w-full cursor-default rounded-lg bg-white text-left my-2">
              <Combobox.Input
                className="w-full border-0 rounded-lg py-2 pl-3 pr-10 leading-5 text-gray-800 
                shadow-md focus:ring-0 focus:shadow-lg bg-gray-100
                duration-300 transition-shadow"
                displayValue={(person) => person.name}
                onChange={(event) => setQuery(event.target.value)}
                spellCheck='false'
                placeholder='Search spells...'
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
                className="absolute mt-0 max-h-44 w-full overflow-auto rounded-md bg-gray-50 py-1 
                shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scrollbar-thin 
                scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md z-50"
              >
                {filteredSpells.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-0.5 px-3 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredSpells.map((spell) => (
                    <Combobox.Option
                      key={spell.index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-0.5 px-3 ${
                          active ? 'bg-gray-600 text-gray-100' : 'text-gray-700'
                        }`
                      }
                      value={spell}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-bold' : 'font-normal'
                            }`}
                          >
                            {spell.name}
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
      </div>
      <Image 
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 -z-10 scale-x-110 scale-y-105 w-[400px]' 
        src='/tree.png' 
        alt='crossed swords' 
        height={700} 
        width={700}
      />
     {
        data && (
          <section className='p-4 my-3 rounded-sm max-h-[90%] bg-paper shadow-lg shadow-black text-sm space-y-2 leading-[21px] overflow-auto'>
            <div>
              <h1 className='text-xl font-bold text-red-800 font-serif'>{data.name}</h1>
              <h2 className='italic'>{data.level > 0 ? `${appendText(data.level)}-level` : 'cantrip'} {data.school.index}{data.ritual && ' (ritual)'}</h2>
            </div>

            <div className='leading-6'>
              <div>
                <span className='font-semibold text-red-800'>Casting Time: </span>
                {data.casting_time}
              </div>
              <div>
                <span className='font-semibold text-red-800'>Range/Area: </span>
                {data.range}
                {data.area_of_effect && (
                  <span className=''> ({data.area_of_effect.size} ft. {data.area_of_effect.type})</span>
                )}
              </div>
              <div>
                <span className='font-semibold text-red-800'>Components: </span>
                {data.components.join(', ')}
                {data.material && (
                  <span className='italic'> ({data.material})</span>
                )}
              </div>
              <div>
                <span className='font-semibold text-red-800'>Duration: </span>
                {data.duration}
              </div>
            </div>
            <div className='space-y-2 py-3 !my-3 border-y border-red-900 border-opacity-70'>
              {
                data.desc.map((elt, index) => (
                  <p key={index}>{elt}</p>
                ))
              }
            </div>

            {data.higher_level.length > 0 && (
              <div>
                <span className='font-semibold italic'>At Higher Levels. </span>
                {data.higher_level}
              </div>
            )}
            <div>
              <span className='font-semibold text-red-800'>Classes: </span>
              {
                data.classes.map((classData) => classData.name).join(', ')
              }
            </div>
          </section>
        )
      }
      <div className='absolute right-3 top-0.5 z-50 text-gray-300 cursor-pointer hover:text-purple-600 transition-all duration-150 ease'>
        <ReturnButton />
      </div>
    </div>
  )
}
