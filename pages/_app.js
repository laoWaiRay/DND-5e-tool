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
        <meta name='description' content='Simple and elegant combat/initiative tracker for D&D 5e' />
        <link rel="icon" type="image/x-icon" href="/d20-holo.png" />
      </Head>
      
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
