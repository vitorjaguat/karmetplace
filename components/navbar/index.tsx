import { useRef } from 'react'
import { Box, Flex, Card } from '../primitives'
import GlobalSearch from './GlobalSearch'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import Link from 'next/link'
import Image from 'next/image'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import NavItem from './NavItem'
import ThemeSwitcher from './ThemeSwitcher'
import HamburgerMenu from './HamburgerMenu'
import MobileSearch from './MobileSearch'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from '../../hooks'
import { useAccount } from 'wagmi'
import CartButton from './CartButton'
import { AccountSidebar } from 'components/navbar/AccountSidebar'

import * as HoverCard from '@radix-ui/react-hover-card'
// import ChainToggle from 'components/common/ChainToggle'

export const NAVBAR_HEIGHT = 81
export const NAVBAR_HEIGHT_MOBILE = 77

const Navbar = () => {
  const { theme } = useTheme()
  const { isConnected } = useAccount()
  const isMobile = useMediaQuery({ query: '(max-width: 960px' })
  const isMounted = useMounted()
  const { routePrefix } = useMarketplaceChain()

  let searchRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  useHotkeys('meta+k', (e) => {
    e.preventDefault()
    if (searchRef?.current) {
      searchRef?.current?.focus()
    }
  })

  if (!isMounted) {
    return null
  }

  return isMobile ? (
    <Flex
      css={{
        height: NAVBAR_HEIGHT_MOBILE,
        px: '$4',
        width: '100%',
        borderBottom: '1px solid $gray4',
        zIndex: 999,
        background: '$slate1',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="between"
    >
      <Box css={{ flex: 1 }}>
        <Flex align="center">
          <Link href={`/${routePrefix}`}>
            <Box css={{ width: 46, cursor: 'pointer' }}>
              {/* <Image
                src="/reservoirLogo.svg"
                width={36}
                height={36}
                alt="Reservoir"
              /> */}
              <div id="logoAnimation" className="mr-7 scale-[0.6]">
                <div className="logo-animation"></div>
              </div>
            </Box>
          </Link>
        </Flex>
      </Box>
      <Flex align="center" css={{ gap: '$3' }}>
        {/* <MobileSearch key={`${router.asPath}-search`} /> */}
        {/* <ChainToggle /> */}
        <CartButton />
        <HamburgerMenu key={`${router.asPath}-hamburger`} />
      </Flex>
    </Flex>
  ) : (
    <Flex
      css={{
        height: NAVBAR_HEIGHT,
        px: '$5',
        '@xl': {
          px: '$6',
        },
        width: '100%',
        // maxWidth: 1920,
        mx: 'auto',
        borderBottom: '1px solid $gray4',
        zIndex: 999,
        background: '$neutralBg',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="between"
    >
      <Box
        css={{
          flex: 'unset',
          '@bp1300': {
            flex: 1,
          },
        }}
      >
        <Flex align="center">
          <Link href={`/${routePrefix}`}>
            <Box css={{ cursor: 'pointer' }}>
              {/* <Image
                src="/reservoirLogo.svg"
                width={36}
                height={36}
                alt="Reservoir"
              /> */}
              <div id="logoAnimation" className="mr-7 scale-[0.8]">
                <div className="logo-animation"></div>
              </div>
            </Box>
          </Link>
          <Flex
            align="center"
            css={{
              gap: '$5',
              ml: '$5',
            }}
          >
            <Link
              // href={`/${routePrefix}/about`}
              href="/about"
            >
              <NavItem
                className={
                  router.pathname.includes('about')
                    ? 'text-[var(--colors-gray10)]'
                    : ''
                }
              >
                About
              </NavItem>
            </Link>
            <Link
              // href={`/${routePrefix}/faq`}
              href="/faq"
            >
              <NavItem
                className={
                  router.pathname.includes('/faq')
                    ? 'text-[var(--colors-gray10)]'
                    : ''
                }
              >
                FAQ
              </NavItem>
            </Link>

            {/* <HoverCard.Root openDelay={200}>
              <HoverCard.Trigger>
                <Link href={`/${routePrefix}/collection-rankings`}>
                  <NavItem
                    active={router.pathname.includes('collection-rankings')}
                  >
                    NFTs
                  </NavItem>
                </Link>
              </HoverCard.Trigger>
              <HoverCard.Content sideOffset={24} align="start">
                <Card css={{ p: 24, width: 240 }}>
                  <Flex css={{ gap: '$4' }} direction="column">
                    <Link href={`/${routePrefix}/collection-rankings`}>
                      <NavItem
                        active={router.pathname.includes('collection-rankings')}
                      >
                        Trending Collections
                      </NavItem>
                    </Link>
                    <Link href={`/${routePrefix}/collection-rankings`}>
                      <NavItem
                        active={router.pathname.includes('collection-rankings')}
                      >
                        Trending Mints
                      </NavItem>
                    </Link>
                  </Flex>
                </Card>
              </HoverCard.Content>
            </HoverCard.Root> */}

            {/* {false && (
              <Link href={`/${routePrefix}/collections/minting`}>
                <NavItem>Mints</NavItem>
              </Link>
            )}
            {false && (
              <Link href="/swap">
                <NavItem>Tokens</NavItem>
              </Link>
            )} */}
          </Flex>
        </Flex>
      </Box>
      {/* <Box css={{ flex: 1, px: '$5' }}>
        <GlobalSearch
          ref={searchRef}
          placeholder="Search collections and addresses"
          containerCss={{ width: '100%' }}
          key={router.asPath}
        />
      </Box> */}

      <div className="hidden xl:block">
        <img
          src="/assets/karmetplace_logo.png"
          alt="The Sphere Karmetplace"
          width={240}
        />
      </div>

      <Flex
        css={{
          gap: '$3',
          flex: 'unset',
          '@bp1300': {
            flex: 1,
          },
        }}
        justify="end"
        align="center"
      >
        {/* <Flex css={{ gap: '$5', mr: 12 }}>
          <Box>
            <HoverCard.Root openDelay={120}>
              <HoverCard.Trigger>
                <a target="_blank" href={`https://docs.reservoir.tools/docs`}>
                  <NavItem>Developers</NavItem>
                </a>
              </HoverCard.Trigger>
              <HoverCard.Content sideOffset={24} align="start">
                <Card css={{ p: 24, width: 240 }}>
                  <Flex css={{ gap: '$4' }} direction="column">
                    <a target="_blank" href={`https://reservoir.tools`}>
                      <NavItem>About Reservoir</NavItem>
                    </a>
                    <a
                      target="_blank"
                      href={`https://docs.reservoir.tools/docs`}
                    >
                      <NavItem>Docs</NavItem>
                    </a>

                    <a
                      target="_blank"
                      href={`https://docs.reservoir.tools/reference/overview`}
                    >
                      <NavItem>API Reference</NavItem>
                    </a>

                    <a
                      target="_blank"
                      href={`https://github.com/reservoirprotocol`}
                    >
                      <NavItem>Github</NavItem>
                    </a>

                    <a href={`https://testnets.reservoir.tools`}>
                      <NavItem>Testnet Explorer</NavItem>
                    </a>
                  </Flex>
                </Card>
              </HoverCard.Content>
            </HoverCard.Root>
          </Box>
          {isConnected && (
            <Link href={`/portfolio`}>
              <Box css={{ mr: '$2' }}>
                <NavItem>Portfolio</NavItem>
              </Box>
            </Link>
          )}
        </Flex> */}

        {/* <ChainToggle /> */}

        {isConnected ? (
          <AccountSidebar />
        ) : (
          <Box css={{ maxWidth: '185px' }}>
            <ConnectWalletButton />
          </Box>
        )}
        <CartButton />
      </Flex>
    </Flex>
  )
}

export default Navbar
