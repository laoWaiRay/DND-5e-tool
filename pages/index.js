import Head from 'next/head'
import { useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { loadingState } from '../atoms/loadingAtom'
import { monsterManualState } from '../atoms/monsterManualAtom'
import Header from '../components/Header'
import Main from '../components/Main'
import MonsterManual from '../components/MonsterManual'
import { Transition } from '@headlessui/react'
import { spellbookState } from '../atoms/spellbookAtom'
import Spellbook from '../components/Spellbook'
import { conditionsState } from '../atoms/conditionsAtom'
import Conditions from '../components/Conditions'
import { exhaustionDef } from '../exhaustionDef'
import About from '../components/About'
import { aboutState } from '../atoms/aboutAtom'

export default function Home({ creatures, spells, conditions }) {
  const [monsterManualOpen, setMonsterManualOpen] = useRecoilState(monsterManualState)
  const [spellbookOpen, setSpellbookOpen] = useRecoilState(spellbookState)
  const [conditionsOpen, setConditionsOpen] = useRecoilState(conditionsState)
  const [aboutOpen, setAboutOpen] = useRecoilState(aboutState)
  // This stuff is to prevent input scrolling from scrolling the body
  const ref = useRef(null)

  useEffect(() => {
    const reff = ref.current
    const wheelHandler = () => {}
    reff.addEventListener('wheel', wheelHandler, { passive: true} )
    return () => reff.removeEventListener('wheel', wheelHandler)
  }, [ref])

  useEffect(() => {
    if (monsterManualOpen || spellbookOpen || conditionsOpen)
    {
      document.body.style.position = 'fixed'
      document.body.style.width = '100vw'
    }
    else
    {
      document.body.style.position = ''
      document.body.style.width = ''
    }
      
  }, [monsterManualOpen, spellbookOpen, conditionsOpen])
  
  return (
    // Overflow hidden is amazing !!!
    <div 
      className='bg-image min-h-screen flex flex-col items-center relative overflow-hidden'
      ref={ref}
    >
      <Head>
        <title>Roll For Initiative</title>
      </Head>

      <Header />

      <Main 
        creatures={creatures}
      />

      {/* Monster Manual */}
      <Transition
        show={monsterManualOpen}
        unmount={false}
        enter={`transition-all duration-300`}
        enterFrom="opacity-0 ease-in scale-0"
        enterTo="opacity-100 scale-100"
        leave="transition-all ease-out duration-300"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
        className='fixed w-screen height-minus-header mm-bg sm:px-6 pt-4 pb-6 px-2 flex justify-center'
      >
        <MonsterManual 
          creatures={creatures}
        />
      </Transition>

       {/* Spellbook */}
       <Transition
        show={spellbookOpen}
        enter={`transition-all duration-300`}
        enterFrom="opacity-0 ease-in scale-0"
        enterTo="opacity-100 scale-100"
        leave="transition-all ease-out duration-300"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
        className='fixed w-screen height-minus-header mm-bg sm:px-6 pt-4 pb-6 px-2 flex justify-center'
      >
        <Spellbook
          spells={spells}
        />
      </Transition>

      {/* Feats */}
      <Transition
        show={conditionsOpen}
        enter={`transition-all duration-300`}
        enterFrom="opacity-0 ease-in scale-0"
        enterTo="opacity-100 scale-100"
        leave="transition-all ease-out duration-300"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
        className='fixed w-screen height-minus-header mm-bg sm:px-6 pt-4 pb-6 px-2 flex justify-center'
      >
        <Conditions 
          conditions={conditions}
        />
      </Transition>

      {/* About */}
      <Transition
        show={aboutOpen}
        enter="transition-all duration-300"
        enterFrom="ease-in -translate-y-full"
        enterTo="translate-y-0"
        leave="transition-all ease-out duration-300"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-full"
        className='fixed w-screen height-minus-header bg-awesome sm:px-6 pt-4 pb-6 px-2 flex justify-center'
      >
        <About />
      </Transition>

      {/* Loading spinner */}
      {/* {
        isLoading  && <Loader />
      } */}
    </div>
  )
}

export async function getServerSideProps() {
  let res = await fetch('https://www.dnd5eapi.co/api/monsters');
  // const res = await fetch('https://api.open5e.com/monsters/?limit=1469');
  let json = await res.json();
  const creatures = json.results;

  res = await fetch('https://www.dnd5eapi.co/api/spells');
  json = await res.json();
  const spells = json.results;

  res = await fetch('https://api.open5e.com/conditions/');
  json = await res.json();
  let conditions = json.results;
  const elt = conditions.find((condition) => condition.name == 'Exhaustion');
  const index = conditions.findIndex((elt) => elt.name == 'Exhaustion');
  const newElt = {...elt}
  newElt.desc = exhaustionDef
  newElt.headers = ['Level', 'Effect']
  newElt.rows = ['Disadvantage on Ability Checks', 'Speed halved', 
  'Disadvantage on Attack rolls and Saving Throws', 'Hit point maximum halved',
  'Speed reduced to 0', 'Death']
  conditions.splice(index, 1, newElt)

  return {
    props: {
      creatures,
      spells,
      conditions
    },
  }
}