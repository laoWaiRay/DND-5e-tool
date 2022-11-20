import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Head>
        <meta name="viewport" content="width=device-width" />
        <meta name="author" content='Raymond Ly' />
        <meta name='keywords' content='Dungeons and Dragons, 5e, Combat, Tracker, Initiative'/>
        <meta name='description' content='Simple and elegant combat/initiative tracker for D&D 5th edition' />
        <meta property="og:title" content="Roll For Initiative - D&D 5e Combat Tracker" />
        <meta property="og:url" content="https://roll-for-initiative-delta.vercel.app/" />
        <meta property="og:image" content="/roll-for-initiative.jpg" />
        <meta property="og:description" content="Simple and elegant combat/initiative tracker for D&D 5th edition." />
        <link rel="icon" type="image/x-icon" href="/d20-holo.png" />
      </Head>
      
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
