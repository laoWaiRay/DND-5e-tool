import { Transition } from '@headlessui/react'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { activeCreaturesState } from '../atoms/activeCreaturesAtom'
import { hiddenUserInputState } from '../atoms/hiddenUserInputAtom'
import DisplayCardCreature from './DisplayCardCreature'
import ResetModal from './ResetModal'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Display() {
  const [activeCreatures, setActiveCreatures] = useRecoilState(activeCreaturesState);
  const [isHidden, setIsHidden] = useRecoilState(hiddenUserInputState);
  const [windowSize, setWindowSize] = useState([0, 0]);
  const [columns, setColumns] = useState([]);
  const [resetModalShown, setResetModalShown] = useState(false);
  const [PC_NPC_list, set_PC_NPC_list] = useState([]);
  const [monstersList, setMonstersList] = useState([]);
  const isMounted = useRef(false)
  const allStorage = () => {
    const order = JSON.parse(localStorage.getItem('order'));

    if (!order || order[0] == null)
    {
      return []
    }

    if (!order || order.length == 0) {
      const keys = Object.keys(localStorage);
      const values = [];
      let i = keys.length;

      while (i--)
        values.push(JSON.parse(localStorage.getItem(keys[i])));

      return values
    } else {
      const values = [];
      order.forEach((id) => {
        values.push(JSON.parse(localStorage.getItem(id.toString())))
      })
      return values
    }

  }

  useEffect(() => {
    const items = allStorage()
    setActiveCreatures(items)
  }, [setActiveCreatures])

  useEffect(()=>{
    const order = activeCreatures.map((creature) => creature.id);
    if (isMounted.current)
      localStorage.setItem('order', JSON.stringify(Array.from(order)))
    else
      isMounted.current = true
  }, [activeCreatures])

  const onDragEnd = useCallback((result, ...rest) => {
    if (!result.destination)
      return

    if (result.destination.droppableId != result.source.droppableId)
      return

    const items = Array.from(activeCreatures)

    const creature = items.find((item) => item.initiative == result.source.droppableId)
    const indexOffset = items.indexOf(creature)

    const [reorderedItem] = items.splice(result.source.index + indexOffset, 1)
    if (result.destination.index + indexOffset == 0)
      items.splice(indexOffset, 0, reorderedItem)
      // return
    else
      items.splice(result.destination.index + indexOffset, 0, reorderedItem)
    setActiveCreatures(items)
  }, [activeCreatures, setActiveCreatures]);

  const scrollToTop = () => {
    const top = document.getElementById('topOfTheRound');
    if (!top)
      return
    top.scrollIntoView({ block: 'start' })
  }

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    const sameInitiatives = [];
    for (let i = 0; i < activeCreatures.length; i++)
    {
      let num = activeCreatures[i].initiative;
      for (let j = i; j < activeCreatures.length; j++)
      {
        if (i != j && activeCreatures[j].initiative == num && !sameInitiatives.includes(num))
          sameInitiatives.push(num)
      }
    }
    const newColumns = []
    sameInitiatives.forEach((initiative) => {
      const creatures = [];
      activeCreatures.forEach((creature) => {
        if (creature.initiative == initiative)
          creatures.push(creature.id)
      })
      newColumns.push({
          id: initiative,
          creatureIds: [...creatures]
      })
    })
    setColumns(newColumns)
  }, [activeCreatures])

  const chunkCreatures = (creatures) => {
    if (creatures.length === 0)
      return

    const array2D = [];
    let currentInitiative = creatures[0].initiative;
    for (let i = 0; i < creatures.length; i++) {
      const group = []
      let j = i;
      while (j < creatures.length && creatures[j].initiative == currentInitiative)
      {
        group.push(creatures[j]);
        j++;
      }
      i = j - 1
      if (j < creatures.length)
        currentInitiative = creatures[j].initiative
      array2D.push(group)
    }

    return array2D
  }

  const mapActiveCreatures = (creatures) => {
    if (!creatures)
      return

    const chunkedCreatures = chunkCreatures(creatures)

    if (!chunkedCreatures)
      return

    let ret = chunkedCreatures.map((elt) => {
      if (elt.length === 1) {
        return (
          <DisplayCardCreature 
            key={elt[0].id}
            creatureData={elt[0]}
            windowSize={windowSize}
          />
        )
      } else {
        return (
          <Droppable key={elt[0].initiative} droppableId={elt[0].initiative.toString()}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className='m-0 select-none'>
                {elt.map((creature, index) => (
                  <Draggable key={creature.id.toString()} draggableId={creature.id.toString()} index={index}>
                    { (provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <DisplayCardCreature
                          creatureData={creature}
                          windowSize={windowSize}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )
      }
    })

    return ret
  }

  // Seperate all creatures into 2 lists: PCs/NPCs and monsters
  useEffect(() => {
    const new_PC_NPC_list = [];
    const newMonstersList = [];
    activeCreatures.forEach((creature) => {
      if (creature.pc == true || creature.npc == true)
        new_PC_NPC_list.push(creature);
      else
        newMonstersList.push(creature);
    })
    set_PC_NPC_list(new_PC_NPC_list);
    setMonstersList(newMonstersList);
  }, [activeCreatures])

  const handleClickClearMonstersBtn = () => {
    const updatedActiveCreatures = [];

    // Find all non-monsters and add them to the updated list of creatures 
    activeCreatures.forEach((creature) => {
      if (creature.pc || creature.npc)
        updatedActiveCreatures.push(creature) 
    })

    setActiveCreatures(updatedActiveCreatures);
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <div className={`w-full flex flex-col text-gray-500 max-w-2xl m-4 px-4 relative ${isHidden && 'pb-10'}`}>
        {activeCreatures.length != 0 &&
          <div
            id='topOfTheRound'
            className='text-gray-300 font-semibold text-center py-1.5 text-sm tracking-wide
            flex justify-center items-center'>
            <span className='mr-3'>
            <Image
              className='hover:cursor-pointer'
              title='Clear all creatures'
              alt='skull'
              src='/skull.svg'
              width={24}
              height={24}
              onClick={handleClickClearMonstersBtn}
            /> 
            </span>
            <span className='mr-3'>TOP OF THE ROUND!</span>
            <ResetModal 
              PC_NPC_list={PC_NPC_list}
              monstersList={monstersList}
            />
          </div>
        }
        {activeCreatures.length 
          === 0
          ? (
              <div 
                className='flex justify-center py-3 px-2 sm:px-4 border border-gray-700 bg-gray-800 text-stone-300
                rounded-md shadow-md relative text-center'>
                Add something below to get started
              </div>
            )
          : ''
        }
        {
          activeCreatures.length > 0 && mapActiveCreatures(activeCreatures) 
        }
        <Transition
          show={activeCreatures.length >= 14 && isHidden}
          enter="transition-all duration-300 delay-[500ms]"
          enterFrom="opacity-0 translate-y-10"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all duration-500"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-10"
        >
          <div 
            className='absolute right-4 -bottom-11 border-[1px] border-gray-400 rounded-full p-1 
            bg-transparent transition-all duration-150 ease-out hover:-translate-y-0.5 btn-shadow'
            onClick={scrollToTop}
          >
            <ChevronDoubleUpIcon className='w-6 h-6 text-gray-400 bg-transparent' />
          </div>
        </Transition>
      </div>
    </DragDropContext>
  )
}
