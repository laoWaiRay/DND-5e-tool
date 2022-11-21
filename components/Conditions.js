import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { scrollToConditionState } from '../atoms/scrollToConditionAtom'
import ReturnButton from './ReturnButton'

export default function Conditions({ conditions }) {
  const [scrollToCondition, setScrollToCondition] = useRecoilState(scrollToConditionState)

  useEffect(() => {
    if (scrollToCondition) {
      const id = document.getElementById(scrollToCondition);
      console.dir(id)
      setTimeout(() => {
        id?.scrollIntoView()
      }, 150);
    }
  }, [scrollToCondition])

  return (
    <div className='w-full h-full relative max-w-3xl'>
      <section className='text-gray-900 p-4 my-3 rounded-sm max-h-[95%] bg-paper shadow-lg shadow-black 
      text-sm space-y-2 leading-6 overflow-auto'>
        <h1 className='text-2xl font-bold font-serif -mb-3'>Conditions</h1>
        {
          conditions.map((condition, index) => (
            <div key={index}>
              <h2 
                id={condition.name}
                className='text-xl font-light border-b border-gray-600 pt-4 pb-2'
              >
                {condition.name}
              </h2>
              {
                condition.desc.split('* ').map((elt, index) => {
                  if (elt) {
                    return (
                      <p key={index} className='py-1'>
                        &#x2022; {elt}
                      </p>
                    )
                  } else {
                    return
                  }
                })
              }
              {
                condition.headers && (
                  <table className='mt-2 mb-4 border-black border-spacing-x-2'>
                    <thead>
                      <tr colSpan={2}>
                      {
                        condition.headers.map((header, index) => (
                            <th key={index} className={`${index == 1 && 'text-left'} p-1 border-b border-black`}>{header}</th>
                        ))
                      }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        condition.rows.map((row, index) => (
                          <tr key={index}>
                            <td className={`text-center w-16 py-1 ${index == 0 && 'pt-2'}`}>{index + 1}</td>
                            <td className={`pr-10 ${index == 0 && 'pt-2'}`}>{row}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                </table>
                )
              }
            </div>
          ))
        }
        <div className='h-[350px]'></div>
      </section>
        
      <div 
        className='hidden xs:block absolute right-6 top-5 z-50 text-gray-800 min-[950px]:text-gray-300 cursor-pointer hover:text-red-600 
        transition-all duration-150 ease min-[950px]:-right-20 min-[950px]:top-1 rounded-full'
      >
        <ReturnButton />
      </div>
    </div>
  )
}
