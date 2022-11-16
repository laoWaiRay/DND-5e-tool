import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import React, { Fragment, useState } from 'react'
import Image from 'next/image'

export default function MonsterManual({ creatures }) {
  const [selectedCreature, setSelectedCreature] = useState('')
  const [query, setQuery] = useState('')

  const filteredCreatures =
  query === ''
    ? creatures
    : creatures.filter((creature) =>
        creature.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .match(`^${query.toLowerCase().replace(/\s+/g, '')}`)
      )

  return (
    <div className='w-full h-full relative max-w-2xl px-4'>
      <div>
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
      </div>
      <Image 
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-sm opacity-50 -z-10' 
        src='/swords.svg' 
        alt='crossed swords' 
        height={72} 
        width={72}
      />
    </div>
  )
}
