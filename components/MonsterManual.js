import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRecoilState } from 'recoil'
import { loadingState } from '../atoms/loadingAtom'

export default function MonsterManual({ creatures }) {
  const [isLoading, setIsLoading] = useRecoilState(loadingState)
  const [selectedCreature, setSelectedCreature] = useState('')
  const [data, setData] = useState(null)
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

  useEffect(() => {
    if (!selectedCreature)
    return;

    setIsLoading(true)
    
    const fetchData = async () => {
      const res = await fetch(`https://www.dnd5eapi.co` + selectedCreature.url);
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
    
  }, [selectedCreature, setIsLoading])

  const capitalize = (string) => {
    let words = string.split(' ');
    words = words.map((word) => word[0].toUpperCase() + word.slice(1));
    return words.join(' ')
  }

  const get_proficiencies_saves = (proficiencies) => {
    const profs = proficiencies
                    .filter((prof) => prof.proficiency.name.indexOf('Saving Throw') != -1)
                    .map((prof) => `${prof.proficiency.name.slice(-3)} +${prof.value}` )
                    .join(', ')
    
    return (
      <span>{profs ? profs : 'None'}</span>
    )
  }

  const get_proficiencies_skills = (skillsData) => {
    const skills = skillsData
                    .filter((skill) => skill.proficiency.name.indexOf('Skill') != -1)
                    .map((skill) => `${skill.proficiency.name.slice(7)} +${skill.value}` )
                    .join(', ')
    
    return (
      <span className='whitespace-pre-wrap'>{skills ? skills : 'None'}</span>
    )
  }

  const get_immunities_resistances_vulnerabilities = (immunities, resistances, vulnerabilities) => {
    return (
      <div>
        {immunities.length > 0 && 
          <div>
            <span className='font-semibold text-red-800'>Damage Immunities </span>
            {
              immunities.map((immunity) => immunity[0].toUpperCase() + immunity.slice(1))
                .join(', ')
            }
          </div>
        }
        {resistances.length > 0 && 
          <div>
            <span className='font-semibold text-red-800'>Damage Resistances </span>
            {
              resistances.map((resistance) => (
                <span key={resistance}>{resistance}</span>
              ))
            }
          </div>
        }
        {vulnerabilities.length > 0 && 
          <div>
            <span className='font-semibold text-red-800'>Damage Vulnerabilities </span>
            {
              vulnerabilities.map((vulnerability) => (
                <span key={vulnerability}>{vulnerability}</span>
              ))
            }
          </div>
        }
      </div>
    )
  }

  const get_senses = (sensesData) => {
    const keys = Object.keys(sensesData)
    const strings = []
    keys.forEach((key) => {
      if (key == 'passive_perception')
        strings.push(`Passive Perception ${sensesData[key]}`)
      else
        strings.push(`${key[0].toUpperCase() + key.slice(1)} ${sensesData[key]}`)
    })

    return (
      <span>{strings.join(', ')}</span>
    )
  }

  return (
    <div className='w-full h-full relative max-w-4xl -mt-2'>
      <div className='max-w-sm mx-auto'>
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
      {
        data && (
          <section className='p-2 my-3 rounded-sm h-[94%] bg-paper shadow-lg shadow-black text-sm space-y-2 leading-[21px]'>
            <div>
              <h1 className='text-2xl font-bold text-red-800 font-serif'>{data.name}</h1>
              <h3 className='italic'>{`${data.size} ${capitalize(data.type)}, ${capitalize(data.alignment)}`}</h3>
            </div>
            <div className='flex flex-col border-y-2 border-red-900 py-2'>
              <span>
                <span className='font-semibold text-red-800'>Armor Class</span> 
                {' '}{data.armor_class}
              </span>
              <span>
                <span className='font-semibold text-red-800'>Hit Points</span> 
                {' '}{data.hit_points}
              </span>
              <span>
                <span className='font-semibold text-red-800'>Speed:</span>
                {' '}{data.speed.walk}{data.speed?.swim && ', swim ' + data.speed.swim}{data.speed?.fly && ', fly ' + data.speed.fly}
              </span>
            </div>
            {/* Attributes */}
            <div className='grid grid-cols-3 grid-rows-2'>
              <div className='flex flex-col justify-center items-center'>
                <span className='font-semibold text-red-800'>STR</span>
                <span>{data.strength} &nbsp;(+3)</span>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <span className='font-semibold text-red-800'>DEX</span>
                <span>{data.dexterity} &nbsp;(+3)</span>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <span className='font-semibold text-red-800'>CON</span>
                <span>{data.constitution} &nbsp;(+3)</span>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <span className='font-semibold text-red-800'>INT</span>
                <span>{data.intelligence} &nbsp;(+3)</span>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <span className='font-semibold text-red-800'>WIS</span>
                <span>{data.wisdom} &nbsp;(+3)</span>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <span className='font-semibold text-red-800'>CHA</span>
                <span>{data.charisma} &nbsp;(+3)</span>
              </div>
            </div>

            <div className='flex flex-col border-y-2 border-red-900 py-2'>
              <div>
                <span className='font-semibold text-red-800'>Saving Throws </span>
                {
                  get_proficiencies_saves(data.proficiencies)
                }
              </div>
              <div>
                <span className='font-semibold text-red-800'>Skills </span>
                {
                  get_proficiencies_skills(data.proficiencies)
                }
              </div>
              {
                get_immunities_resistances_vulnerabilities(data.damage_immunities, 
                  data.damage_resistances, data.damage_vulnerabilities)
              }
              <div>
                <span className='font-semibold text-red-800'>Senses </span>
                {
                  get_senses(data.senses)
                }
              </div>
              <div>
                <span className='font-semibold text-red-800'>Languages </span>
                {
                  data.languages
                }
              </div>
              <div>
                <span className='font-semibold text-red-800'>Challenge {data.challenge_rating}</span> ({data.xp} XP)
              </div>
            </div>
            {data.special_abilities.length > 0 && (
              <div>
                {data.special_abilities.map((ability) => (
                  <div key={ability.name}>
                    <span className='font-semibold italic'>{ability.name} ({ability.usage.times} {ability.usage.type}).</span>
                    <span> {ability.desc} </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      }
      
    </div>
  )
}
