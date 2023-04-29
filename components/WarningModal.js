import { Popover } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react'

export default function WarningModal({ handleDelete, elementRef }) {
  return (
    <Popover className="flex">
      <Popover.Button>
        <div className='bg-red-500 rounded-md p-1 cursor-pointer'>
          <XMarkIcon className='w-5 h-5 text-white'/>
        </div>
        
      </Popover.Button>

      <Popover.Overlay className="fixed inset-0 bg-black opacity-90 z-50 cursor-auto" />

      <Popover.Panel 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex justify-center items-center cursor-auto"
      >
        {({ close }) => (
          <div className='p-8 bg-gray-800 rounded-md border border-gray-500 flex flex-col space-y-3 text-gray-200'>
            <p className='whitespace-nowrap'>Removing a player character. Are you sure?</p>
            <div className='flex space-x-4'>
              <button 
                className='p-2 bg-red-500 rounded-sm'
                onClick={() => { handleDelete(); close(elementRef) }}
              >
                Remove
              </button>
              <button 
                className='p-2 bg-gray-500 rounded-sm'
                onClick={() => close(elementRef)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  )
}
