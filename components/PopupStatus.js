import React, { Fragment, useState } from 'react'
import { PlusSmallIcon } from '@heroicons/react/24/solid'
import { Combobox, Popover, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import statuses from '../statuses'

export default function PopupStatus({ setHpOpen }) {
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [query, setQuery] = useState('')

  const filteredStatuses =
  query === ''
    ? statuses
    : statuses.filter((status) =>
        status.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  return (
    <Popover className="flex">
      <Popover.Button>
        <div 
          className='border border-gray-300 rounded-sm hover:bg-gray-900'
          onClick={(e) => setHpOpen(false)}
        >
          <PlusSmallIcon className='w-4 h-4 text-gray-300'/>
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute top-[49px] z-50 left-0">
        <div className="bg-gray-900 border border-gray-600 p-3 rounded-md">
          <form className='flex space'>
            <Combobox value={selectedStatus} onChange={setSelectedStatus}>
              <div className="relative w-48">
                <div className="relative w-full cursor-default rounded-lg bg-white text-left">
                  <div className='relative'>
                    <Combobox.Input
                      className="w-full border-0 rounded-lg py-2 pl-3 pr-10 leading-5 text-gray-800 
                      shadow-md focus:ring-0 focus:shadow-lg bg-gray-100
                      duration-300 transition-shadow"
                      displayValue={(status) => status.name}
                      onChange={(event) => setQuery(event.target.value)}
                      spellCheck='false'
                    />
                    <div className='absolute right-8 top-2.5'>
                      <Image src={selectedStatus.url} alt='Concentration' width={16} height={16} />
                    </div>
                  </div>
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
                    className="absolute mt-1 max-h-36 w-full overflow-auto rounded-md bg-gray-50 py-1 
                    shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scrollbar-thin 
                    scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md overflow-x-hidden"
                  >
                    {filteredStatuses.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none py-0.5 px-3 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredStatuses.map((status) => (
                        <div key={status.id} className='relative'>
                          <Combobox.Option
                            className={({ active }) =>
                              `relative cursor-default select-none py-0.5 px-3 ${
                                active ? 'bg-gray-600 text-gray-100' : 'text-gray-700'
                              }`
                            }
                            value={status}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-bold' : 'font-normal'
                                  }`}
                                >
                                  {status.name}
                                </span>
                              </>
                            )}
                          </Combobox.Option>
                          <div className='absolute right-8 top-1.5'>
                            <Image src={status.url} alt='Concentration' width={16} height={16} />
                          </div>
                        </div>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
            <button className='ml-3'>
              <CheckCircleIcon className='w-8 h-8 hover:text-green-500'/>
            </button>       
          </form>
        </div>

      </Popover.Panel>

    </Popover>
  )
}
