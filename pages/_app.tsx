import AnalyticsProvider, {
  initializeAnalytics,
} from 'components/AnalyticsProvider'
initializeAnalytics()
import ErrorTrackingProvider from 'components/ErrorTrackingProvider'

import '/styles/globals.css'
import 'react-responsive-modal/styles.css'

// import { Inter } from '@next/font/google'
import localFont from '@next/font/local'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'
import { darkTheme, globalReset } from 'stitches.config'
import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import * as Tooltip from '@radix-ui/react-tooltip'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import {
  ReservoirKitProvider,
  darkTheme as reservoirDarkTheme,
  lightTheme as reservoirLightTheme,
  ReservoirKitTheme,
  CartProvider,
} from '@reservoir0x/reservoir-kit-ui'
import {
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
  rabbyWallet,
  ledgerWallet,
  phantomWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { FC, useContext, useEffect, useState } from 'react'
import { HotkeysProvider } from 'react-hotkeys-hook'
import ToastContextProvider from 'context/ToastContextProvider'
import supportedChains from 'utils/chains'
import { useMarketplaceChain } from 'hooks'
import ChainContextProvider from 'context/ChainContextProvider'
import { WebsocketContextProvider } from 'context/WebsocketContextProvider'
import ReferralContextProvider, {
  ReferralContext,
} from 'context/ReferralContextProvider'
import { chainPaymentTokensMap } from 'utils/paymentTokens'

//CONFIGURABLE: Use nextjs to load your own custom font: https://nextjs.org/docs/basic-features/font-optimization
// const inter = Inter({
//   subsets: ['latin'],
// })
const inter = localFont({
  src: [
    {
      path: '../public/assets/space_grotesk_medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/assets/space_grotesk_semibold.otf',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--inter-font',
  display: 'swap',
  // src: '../public/assets/space_grotesk_medium.otf',
})

export const NORMALIZE_ROYALTIES = process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES
  ? process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES === 'false'
  : true

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const { chains, publicClient } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
  publicProvider(),
])

//Jaguat customized:
// const { connectors } = getDefaultWallets({
//   // appName: 'Reservoir NFT Explorer',
//   appName: 'The Sphere Common Pool',
//   projectId: WALLET_CONNECT_PROJECT_ID,
//   chains,
// })
///////adding more supported wallets:
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
      }),
      coinbaseWallet({
        chains,
        appName: 'The Sphere Common Pool',
      }),
      rainbowWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
      }),
      walletConnectWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
      }),
      rabbyWallet({ chains }),
      ledgerWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
      }),
      phantomWallet({ chains }),
    ],
  },
])

const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

//CONFIGURABLE: Here you can override any of the theme tokens provided by RK: https://docs.reservoir.tools/docs/reservoir-kit-theming-and-customization
const reservoirKitThemeOverrides = {
  headlineFont: inter.style.fontFamily,
  font: inter.style.fontFamily,
  primaryColor: '#6E56CB',
  primaryHoverColor: '#644fc1',
}

function AppWrapper(props: AppProps & { baseUrl: string }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      value={{
        dark: darkTheme.className,
        light: 'light',
      }}
    >
      <WagmiConfig config={wagmiClient}>
        <ChainContextProvider>
          <AnalyticsProvider>
            <ErrorTrackingProvider>
              <ReferralContextProvider>
                <div className={`${inter.variable} font-inter`}>
                  <MyApp {...props} />
                </div>
              </ReferralContextProvider>
            </ErrorTrackingProvider>
          </AnalyticsProvider>
        </ChainContextProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

function MyApp({
  Component,
  pageProps,
  baseUrl,
}: AppProps & { baseUrl: string }) {
  globalReset()

  const { theme } = useTheme()
  const marketplaceChain = useMarketplaceChain()
  const [reservoirKitTheme, setReservoirKitTheme] = useState<
    ReservoirKitTheme | undefined
  >()

  const [rainbowKitTheme, setRainbowKitTheme] = useState<
    | ReturnType<typeof rainbowDarkTheme>
    | ReturnType<typeof rainbowLightTheme>
    | undefined
  >()

  useEffect(() => {
    if (theme == 'dark') {
      setReservoirKitTheme(reservoirDarkTheme(reservoirKitThemeOverrides))
      setRainbowKitTheme(
        rainbowDarkTheme({
          borderRadius: 'small',
        })
      )
    } else {
      setReservoirKitTheme(reservoirLightTheme(reservoirKitThemeOverrides))
      setRainbowKitTheme(
        rainbowLightTheme({
          borderRadius: 'small',
        })
      )
    }
  }, [theme])
  const { feesOnTop } = useContext(ReferralContext)

  const FunctionalComponent = Component as FC

  let source = process.env.NEXT_PUBLIC_MARKETPLACE_SOURCE

  if (!source && process.env.NEXT_PUBLIC_HOST_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_HOST_URL)
      source = url.host
    } catch (e) {}
  }

  return (
    <HotkeysProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        value={{
          dark: darkTheme.className,
          light: 'light',
        }}
      >
        <ReservoirKitProvider
          options={{
            // Reservoir API key which you can generate at https://reservoir.tools/
            // This is a protected key and displays as 'undefined' on the browser
            // DO NOT add NEXT_PUBLIC to the key or you'll risk leaking it on the browser
            apiKey: process.env.RESERVOIR_API_KEY,
            //CONFIGURABLE: Override any configuration available in RK: https://docs.reservoir.tools/docs/reservoirkit-ui#configuring-reservoirkit-ui
            // Note that you should at the very least configure the source with your own domain
            chains: supportedChains.map(
              ({
                reservoirBaseUrl,
                proxyApi,
                id,
                name,
                checkPollingInterval,
              }) => {
                return {
                  id,
                  name,
                  baseApiUrl: proxyApi
                    ? `${baseUrl}${proxyApi}`
                    : reservoirBaseUrl,
                  active: marketplaceChain.id === id,
                  checkPollingInterval: checkPollingInterval,
                  paymentTokens: chainPaymentTokensMap[id],
                }
              }
            ),
            logLevel: 4,
            source: source,
            normalizeRoyalties: NORMALIZE_ROYALTIES,
            //CONFIGURABLE: Set your marketplace fee and recipient, (fee is in BPS)
            // Note that this impacts orders created on your marketplace (offers/listings)
            // marketplaceFee: 250,
            // marketplaceFeeRecipient: "0xabc"
            disablePoweredByReservoir: true,
          }}
          theme={reservoirKitTheme}
        >
          <CartProvider feesOnTopUsd={feesOnTop}>
            <WebsocketContextProvider>
              <Tooltip.Provider>
                <RainbowKitProvider
                  chains={chains}
                  theme={rainbowKitTheme}
                  modalSize="compact"
                >
                  <ToastContextProvider>
                    <main className={`${inter.variable} font-inter`}>
                      <FunctionalComponent {...pageProps} />
                    </main>
                  </ToastContextProvider>
                </RainbowKitProvider>
              </Tooltip.Provider>
            </WebsocketContextProvider>
          </CartProvider>
        </ReservoirKitProvider>
      </ThemeProvider>
    </HotkeysProvider>
  )
}

AppWrapper.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(appContext)
  let baseUrl = ''

  if (appContext.ctx.req?.headers.host) {
    const host = appContext.ctx.req?.headers.host
    baseUrl = `${host.includes('localhost') ? 'http' : 'https'}://${host}`
  } else if (process.env.NEXT_PUBLIC_HOST_URL) {
    baseUrl = process.env.NEXT_PUBLIC_HOST_URL || ''
  }
  baseUrl = baseUrl.replace(/\/$/, '')

  return { ...appProps, baseUrl }
}

export default AppWrapper
