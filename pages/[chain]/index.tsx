import { NextPage, GetServerSideProps } from 'next'
import Link from 'next/link'
import {
  Text,
  Flex,
  Box,
  Button,
  FormatCryptoCurrency,
} from 'components/primitives'
import Layout from 'components/Layout'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useContext, useEffect, useState } from 'react'
// import { Footer } from 'components/home/Footer'
import { useMarketplaceChain, useMounted } from 'hooks'
import supportedChains, { DefaultChain } from 'utils/chains'
import { Head } from 'components/Head'
import { ChainContext } from 'context/ChainContextProvider'

import Img from 'components/primitives/Img'
// import useTopSellingCollections from 'hooks/useTopSellingCollections'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
// import ReactMarkdown from 'react-markdown'
import { basicFetcher as fetcher } from 'utils/fetcher'
import { styled } from 'stitches.config'
import { useTheme } from 'next-themes'
// import ChainToggle from 'components/common/ChainToggle'
import optimizeImage from 'utils/optimizeImage'
// import { MarkdownLink } from 'components/primitives/MarkdownLink'
import { useRouter } from 'next/router'
// import Header from 'components/home/Header'

const StyledImage = styled('img', {})

const Home: NextPage<any> = ({ ssr }) => {
  const router = useRouter()
  const marketplaceChain = useMarketplaceChain()
  const isMounted = useMounted()

  //get floor prices:
  const collectionsArr = [
    '0x95520e629368c3a08ec6b4d070a130ee72f6e471',
    '0xfc599d7ad9255f7d60f84b4ab64ef8080453b767',
    '0x69b377c8dddc25ae26c422d39b45744bb67aab4b',
    '0xe27f011e8eb90b4d42fa7658fbe44e240d9c5f03',
  ]

  //floor price for collection 0:
  const [floorPrice0, setFloorPrice0] = useState<number | null>(null)
  const { data: collection0 } = useCollections({ id: collectionsArr[0] }, {}, 1)
  useEffect(() => {
    if (collection0[0]?.floorAsk?.price?.amount?.native) {
      setFloorPrice0(collection0[0]?.floorAsk?.price?.amount?.native)
    }
  }, [collection0[0]?.floorAsk?.price?.amount?.native])
  const [coll0, setColl0] = useState<any>(null)
  useEffect(() => {
    if (collection0[0]) {
      setColl0(collection0[0])
    }
  }, [collection0[0]])

  //floor price for collection 1:
  const [floorPrice1, setFloorPrice1] = useState<number | null>(null)
  const { data: collection1 } = useCollections(
    { id: collectionsArr[1] },
    {},
    7777777
  )
  useEffect(() => {
    if (collection1[0]?.floorAsk?.price?.amount?.native) {
      setFloorPrice1(collection1[0]?.floorAsk?.price?.amount?.native)
    }
  }, [collection1[0]?.floorAsk?.price?.amount?.native])

  //floor price for collection 2:
  const [floorPrice2, setFloorPrice2] = useState<number | null>(null)
  const { data: collection2 } = useCollections({ id: collectionsArr[0] }, {}, 1)
  useEffect(() => {
    if (collection2[0]?.floorAsk?.price?.amount?.native) {
      setFloorPrice2(collection2[0]?.floorAsk?.price?.amount?.native)
    }
  }, [collection2[0]?.floorAsk?.price?.amount?.native])

  //floor price for collection 3:
  const [floorPrice3, setFloorPrice3] = useState<number | null>(null)
  const { data: collection3 } = useCollections(
    { id: collectionsArr[3] },
    {},
    7777777
  )
  useEffect(() => {
    if (collection3[0]?.floorAsk?.price?.amount?.native) {
      setFloorPrice3(collection3[0]?.floorAsk?.price?.amount?.native)
    }
  }, [collection3[0]?.floorAsk?.price?.amount?.native])
  // setTimeout(() => {
  //   console.log(collection3)
  // }, 3000)
  // console.log(floorPrice0, floorPrice1, floorPrice2, floorPrice3)

  // not sure if there is a better way to fix this
  const { theme: nextTheme } = useTheme()
  const [theme, setTheme] = useState<string | null>(null)
  useEffect(() => {
    if (nextTheme) {
      setTheme(nextTheme)
    }
  }, [nextTheme])

  const { chain, switchCurrentChain } = useContext(ChainContext)

  //handles for collections/chains
  // const handleGoerli = () => {
  //   const newChain = supportedChains?.find((ch) => ch?.routePrefix == 'goerli')
  //   if (newChain) {
  //     //   const newUrl = router.asPath.replace(
  //     //     chain.routePrefix,
  //     //     newChain?.routePrefix
  //     //   )
  //     //   console.log(newUrl)
  //     switchCurrentChain(newChain?.id)
  //     router.push(
  //       `/goerli/collection/0x01a8c25b7f28443875d982c8236c59699ce70dd9`,
  //       undefined,
  //       { scroll: false }
  //     )
  //   }
  // }

  // const handleEthereum = () => {
  //   const newChain = supportedChains?.find(
  //     (ch) => ch?.routePrefix == 'ethereum'
  //   )
  //   if (newChain) {
  //     //   const newUrl = router.asPath.replace(
  //     //     chain.routePrefix,
  //     //     newChain?.routePrefix
  //     //   )
  //     //   console.log(newUrl)
  //     switchCurrentChain(newChain?.id)
  //     router.push(
  //       `/ethereum/collection/0x69b377c8dddc25ae26c422d39b45744bb67aab4b`,
  //       undefined,
  //       { scroll: false }
  //     )
  //   }
  // }

  // const handleZora = () => {
  //   const newChain = supportedChains?.find((ch) => ch?.routePrefix == 'zora')
  //   if (newChain) {
  //     //   const newUrl = router.asPath.replace(
  //     //     chain.routePrefix,
  //     //     newChain?.routePrefix
  //     //   )
  //     //   console.log(newUrl)
  //     switchCurrentChain(newChain?.id)
  //     router.push(
  //       `/zora/collection/0xe27f011e8eb90b4d42fa7658fbe44e240d9c5f03`,
  //       undefined,
  //       { scroll: false }
  //     )
  //   }
  // }

  // const handleSapo = () => {
  //   const newChain = supportedChains?.find(
  //     (ch) => ch?.routePrefix == 'ethereum'
  //   )
  //   if (newChain) {
  //     //   const newUrl = router.asPath.replace(
  //     //     chain.routePrefix,
  //     //     newChain?.routePrefix
  //     //   )
  //     //   console.log(newUrl)
  //     switchCurrentChain(newChain?.id)
  //     router.push(
  //       `/ethereum/collection/0x9523e213d3929be2c6f48e5dafe2b8a3d4fd3e39`,
  //       undefined,
  //       { scroll: false }
  //     )
  //   }
  // }

  return (
    <Layout>
      <Head />
      {/* <Header /> */}
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            px: '$5',
          },
          '@xl': {
            px: '$6',
          },
        }}
      >
        {/* <div className="w-full relative text-4xl text-right text-white z-[100] flex justify-end my-4">
          <div className="max-w-[700px] text-[#edeeef]">
            <div className="">Experiment, Trade, and Collect Live Art</div>
          </div>
        </div> */}
        <div className="md:grid md:grid-cols-2">
          {/* THE SPHERE KARMIC OBJECTS — FIRST CYCLE */}
          <Link href="/ethereum/collection/0x95520e629368c3a08ec6b4d070a130ee72f6e471">
            <Flex>
              <Flex
                css={{
                  '&:hover button': {
                    background: theme == 'light' ? '$primary11' : '$gray2',
                  },
                  minHeight: 540,

                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  gap: '$3',
                  p: '$4',
                  display: 'flex',
                  flexDirection: 'column',
                  '@md': {
                    p: '$5',
                    gap: '$4',
                    flexDirection: 'column',
                    display: 'flex',
                  },
                  '@lg': {
                    flexDirection: 'row',
                    p: '$5',
                    gap: '$5',
                    mt: '$4',
                    maxHeight: 540,
                  },
                  '@xl': {
                    p: '$6',
                    gap: '$6',
                  },

                  mb: '$6',
                  maxWidth: 1820,
                  mx: 'auto',
                  // borderRadius: 16,
                  // backgroundSize: 'cover',
                  // border: `1px solid $gray5`,
                  // backgroundImage: theme === 'light' ? `$gray2` : '$gray3',
                  // backgroundColor: '$gray5',
                }}
              >
                <Box
                  css={{
                    position: 'absolute',
                    top: 0,
                    display: theme === 'light' ? 'block' : 'none',
                    zIndex: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: 'blur(20px)',
                    '@lg': {
                      height: '100%',
                    },
                    // background: 'rgba(255, 255, 255, 0.9)',
                  }}
                />

                <Box
                  css={{
                    flex: 2,
                    position: 'relative',
                    zIndex: 5,
                    '@lg': {
                      height: '100%',
                    },
                    '@xl': {
                      flex: 3,
                    },
                  }}
                >
                  <StyledImage
                    src={optimizeImage(
                      // topCollection?.banner ??
                      //   topCollection?.image ??
                      //   topCollection?.recentSales?.[0]?.collection?.image ??
                      //   topCollection?.recentSales?.[0]?.token?.image,
                      '/assets/materia.jpg',
                      1820
                    )}
                    css={{
                      width: '100%',
                      borderRadius: 8,
                      height: 320,
                      '@lg': {
                        height: '100%',
                      },
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    css={{
                      position: 'absolute',
                      left: '$4',
                      display: 'none',
                      aspectRatio: 'square',
                      '@md': {
                        display: 'block',
                      },
                      '@lg': {
                        top: '$4',
                      },
                      bottom: '$4',
                    }}
                  >
                    <Img
                      alt="collection image"
                      width={80}
                      height={80}
                      style={{
                        display: 'block',
                        borderRadius: 8,
                        border: '2px solid rgba(255,255,255,0.6)',
                        aspectRatio: 'square',
                        minHeight: 80,
                      }}
                      src={
                        optimizeImage(
                          // topCollection?.image,
                          '/assets/logo_animation_square.gif',
                          200
                        ) as string
                      }
                    />
                  </Box>
                </Box>
                <Box
                  css={{
                    flex: 2,
                    zIndex: 4,
                  }}
                >
                  <Flex
                    direction="column"
                    css={{
                      height: '100%',
                    }}
                  >
                    <Box css={{ flex: 1 }}>
                      <Text
                        style="h3"
                        css={{ mt: '$3', mb: '$2', fontSize: '25px' }}
                        as="h3"
                      >
                        THE SPHERE KARMIC OBJECTS — FIRST CYCLE
                      </Text>

                      <Box
                        css={{
                          maxWidth: 720,
                          lineHeight: 1.5,
                          fontSize: 16,
                          fontWeight: 400,
                          display: '-webkit-box',
                          color: '$gray12',
                          fontFamily: '$body',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {/* <ReactMarkdown
                            children={topCollection?.description || ''}
                            components={{
                              a: MarkdownLink,
                              p: Text as any,
                            }}
                          /> */}
                        The Sphere concludes its first funding cycle with{' '}
                        <span className="font-bold">KARMIC OBJECTS</span>, a
                        unique collection of six artworks.
                      </Box>

                      <Flex css={{ mt: '$4' }}>
                        <Box css={{ mr: '$5' }}>
                          <Text style="subtitle2" color="subtle">
                            FLOOR PRICE
                          </Text>
                          <Box css={{ mt: 2 }}>
                            <FormatCryptoCurrency
                              amount={floorPrice0 ?? 0}
                              textStyle={'h4'}
                              logoHeight={20}
                              // address={
                              //   coll0.floorAsk?.price?.currency?.contract
                              // }
                            />
                          </Box>
                        </Box>

                        {/* <Box css={{ mr: '$4' }}>
                            <Text style="subtitle2" color="subtle">
                              24H SALES
                            </Text>
                            <Text style="h4" as="h4" css={{ mt: 2 }}>
                              {topCollection?.count?.toLocaleString()}
                            </Text>
                          </Box> */}
                      </Flex>
                      {/* <Box
                          css={{
                            display: 'none',
                            '@lg': {
                              display: 'block',
                            },
                          }}
                        >
                          <Text
                            style="subtitle2"
                            color="subtle"
                            as="p"
                            css={{ mt: '$4' }}
                          >
                            RECENT SALES
                          </Text>
                          <Flex
                            css={{
                              mt: '$2',
                              gap: '$3',
                            }}
                          >
                            {topCollection?.recentSales
                              ?.slice(0, 4)
                              ?.map((sale, i) => (
                                <Box
                                  css={{
                                    aspectRatio: '1/1',
                                    maxWidth: 120,
                                  }}
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    if (
                                      sale?.collection?.id &&
                                      sale?.token?.id
                                    ) {
                                      router.push(
                                        `/${chain.routePrefix}/asset/${sale?.collection?.id}:${sale?.token?.id}`
                                      )
                                    }
                                  }}
                                >
                                  <img
                                    style={{ borderRadius: 4 }}
                                    src={optimizeImage(
                                      sale?.token?.image ||
                                        topCollection?.image,
                                      250
                                    )}
                                  />
                                  <Box css={{ mt: '$1' }}>
                                    <FormatCryptoCurrency
                                      amount={sale?.price?.amount?.decimal ?? 0}
                                      textStyle={'h6'}
                                      logoHeight={16}
                                      address={sale?.price?.currency?.contract}
                                    />
                                  </Box>
                                </Box>
                              ))}
                            <Box css={{ flex: 1 }} />
                            <Box css={{ flex: 1 }} />
                          </Flex>
                        </Box> */}
                    </Box>
                    <Flex css={{ gap: '$4', mt: '$4' }}>
                      {theme == 'light' ? (
                        <Button
                          as="button"
                          color="primary"
                          size="large"
                          className="w-full justify-center"
                        >
                          Explore
                        </Button>
                      ) : (
                        <Button
                          as="button"
                          color="gray4"
                          size="large"
                          className="w-full justify-center"
                        >
                          Explore
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Link>

          {/* THE ANARCHIVING GAME  */}
          <Link href="/zora/collection/0xfc599d7ad9255f7d60f84b4ab64ef8080453b767">
            <Flex>
              <Flex
                css={{
                  '&:hover button': {
                    background: theme == 'light' ? '$primary11' : '$gray2',
                  },
                  minHeight: 540,

                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  gap: '$3',
                  p: '$4',
                  display: 'flex',
                  flexDirection: 'column',
                  '@md': {
                    p: '$5',
                    gap: '$4',
                    flexDirection: 'column',
                    display: 'flex',
                  },
                  '@lg': {
                    flexDirection: 'row',
                    p: '$5',
                    gap: '$5',
                    mt: '$4',
                    maxHeight: 540,
                  },
                  '@xl': {
                    p: '$6',
                    gap: '$6',
                  },

                  mb: '$6',
                  maxWidth: 1820,
                  mx: 'auto',
                  // borderRadius: 16,
                  // backgroundSize: 'cover',
                  // border: `1px solid $gray5`,
                  // backgroundImage: theme === 'light' ? `$gray2` : '$gray3',
                  // backgroundColor: '$gray5',
                }}
              >
                <Box
                  css={{
                    position: 'absolute',
                    top: 0,
                    display: theme === 'light' ? 'block' : 'none',
                    zIndex: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: 'blur(20px)',
                    '@lg': {
                      height: '100%',
                    },
                    // background: 'rgba(255, 255, 255, 0.9)',
                  }}
                />

                <Box
                  css={{
                    flex: 2,
                    position: 'relative',
                    zIndex: 5,
                    '@lg': {
                      height: '100%',
                    },
                    '@xl': {
                      flex: 3,
                    },
                  }}
                >
                  <StyledImage
                    src={optimizeImage(
                      // topCollection?.banner ??
                      //   topCollection?.image ??
                      //   topCollection?.recentSales?.[0]?.collection?.image ??
                      //   topCollection?.recentSales?.[0]?.token?.image,
                      '/assets/anarchiving_game.jpeg',
                      1820
                    )}
                    css={{
                      width: '100%',
                      borderRadius: 8,
                      height: 320,
                      '@lg': {
                        height: '100%',
                      },
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    css={{
                      position: 'absolute',
                      left: '$4',
                      display: 'none',
                      aspectRatio: 'square',
                      '@md': {
                        display: 'block',
                      },
                      '@lg': {
                        top: '$4',
                      },
                      bottom: '$4',
                    }}
                  >
                    <Img
                      alt="collection image"
                      width={80}
                      height={80}
                      style={{
                        display: 'block',
                        borderRadius: 8,
                        border: '2px solid rgba(255,255,255,0.6)',
                        aspectRatio: 'square',
                        minHeight: 80,
                      }}
                      src={
                        optimizeImage(
                          // topCollection?.image,
                          '/assets/logo_animation_square.gif',
                          200
                        ) as string
                      }
                    />
                  </Box>
                </Box>
                <Box css={{ flex: 2, zIndex: 4 }}>
                  <Flex direction="column" css={{ height: '100%' }}>
                    <Box css={{ flex: 1 }}>
                      <Text
                        style="h3"
                        css={{ mt: '$3', mb: '$2', fontSize: '25px' }}
                        as="h3"
                      >
                        THE ANARCHIVING GAME
                      </Text>

                      <Box
                        css={{
                          maxWidth: 720,
                          lineHeight: 1.5,
                          fontSize: 16,
                          fontWeight: 400,
                          display: '-webkit-box',
                          color: '$gray12',
                          fontFamily: '$body',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {/* <ReactMarkdown
                            children={topCollection?.description || ''}
                            components={{
                              a: MarkdownLink,
                              p: Text as any,
                            }}
                          /> */}
                        The Sphere's Anarchive is a dynamic, participatory open
                        canvas where its community's memories and creativity are
                        continuously re-imagined.
                      </Box>

                      <Flex css={{ mt: '$4' }}>
                        <Box css={{ mr: '$5' }}>
                          <Text style="subtitle2" color="subtle">
                            FLOOR PRICE
                          </Text>
                          <Box css={{ mt: 2 }}>
                            <FormatCryptoCurrency
                              amount={floorPrice1 ?? 0}
                              textStyle={'h4'}
                              logoHeight={20}
                              // address={
                              //   topCollection?.floorAsk?.price?.currency
                              //     ?.contract
                              // }
                            />
                          </Box>
                        </Box>

                        {/* <Box css={{ mr: '$4' }}>
                            <Text style="subtitle2" color="subtle">
                              24H SALES
                            </Text>
                            <Text style="h4" as="h4" css={{ mt: 2 }}>
                              {topCollection?.count?.toLocaleString()}
                            </Text>
                          </Box> */}
                      </Flex>
                      {/* <Box
                          css={{
                            display: 'none',
                            '@lg': {
                              display: 'block',
                            },
                          }}
                        >
                          <Text
                            style="subtitle2"
                            color="subtle"
                            as="p"
                            css={{ mt: '$4' }}
                          >
                            RECENT SALES
                          </Text>
                          <Flex
                            css={{
                              mt: '$2',
                              gap: '$3',
                            }}
                          >
                            {topCollection?.recentSales
                              ?.slice(0, 4)
                              ?.map((sale, i) => (
                                <Box
                                  css={{
                                    aspectRatio: '1/1',
                                    maxWidth: 120,
                                  }}
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    if (
                                      sale?.collection?.id &&
                                      sale?.token?.id
                                    ) {
                                      router.push(
                                        `/${chain.routePrefix}/asset/${sale?.collection?.id}:${sale?.token?.id}`
                                      )
                                    }
                                  }}
                                >
                                  <img
                                    style={{ borderRadius: 4 }}
                                    src={optimizeImage(
                                      sale?.token?.image ||
                                        topCollection?.image,
                                      250
                                    )}
                                  />
                                  <Box css={{ mt: '$1' }}>
                                    <FormatCryptoCurrency
                                      amount={sale?.price?.amount?.decimal ?? 0}
                                      textStyle={'h6'}
                                      logoHeight={16}
                                      address={sale?.price?.currency?.contract}
                                    />
                                  </Box>
                                </Box>
                              ))}
                            <Box css={{ flex: 1 }} />
                            <Box css={{ flex: 1 }} />
                          </Flex>
                        </Box> */}
                    </Box>
                    <Flex css={{ gap: '$4', mt: '$4' }}>
                      {theme == 'light' ? (
                        <Button
                          as="button"
                          color="primary"
                          size="large"
                          className="w-full justify-center"
                        >
                          Explore
                        </Button>
                      ) : (
                        <Button
                          as="button"
                          color="gray4"
                          size="large"
                          className="w-full justify-center"
                        >
                          Explore
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Link>

          {/* Spherical GeNFT */}
          {/* <Link href="/ethereum/collection/0x69b377c8dddc25ae26c422d39b45744bb67aab4b">
            <Flex>
              <Flex
                css={{
                  '&:hover button': {
                    background: theme == 'light' ? '$primary11' : '$gray2',
                  },
                  minHeight: 540,

                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  gap: '$3',
                  p: '$4',
                  display: 'flex',
                  flexDirection: 'column',
                  '@md': {
                    p: '$5',
                    gap: '$4',
                    flexDirection: 'column',
                    display: 'flex',
                  },
                  '@lg': {
                    flexDirection: 'row',
                    p: '$5',
                    gap: '$5',
                    mt: '$4',
                  },
                  '@xl': {
                    p: '$6',
                    gap: '$6',
                  },

                  mb: '$6',
                  maxWidth: 1820,
                  mx: 'auto',
                  // borderRadius: 16,
                  // backgroundSize: 'cover',
                  // border: `1px solid $gray5`,
                  // backgroundImage: theme === 'light' ? `$gray2` : '$gray3',
                  // backgroundColor: '$gray5',
                }}
              >
                <Box
                  css={{
                    position: 'absolute',
                    top: 0,
                    display: theme === 'light' ? 'block' : 'none',
                    zIndex: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: 'blur(20px)',

                    // background: 'rgba(255, 255, 255, 0.9)',
                  }}
                />

                <Box
                  css={{
                    flex: 2,
                    position: 'relative',
                    zIndex: 5,

                    '@xl': {
                      flex: 3,
                    },
                  }}
                >
                  <StyledImage
                    src={optimizeImage(
                      // topCollection?.banner ??
                      //   topCollection?.image ??
                      //   topCollection?.recentSales?.[0]?.collection?.image ??
                      //   topCollection?.recentSales?.[0]?.token?.image,
                      '/assets/collection1.jpg',
                      1820
                    )}
                    css={{
                      width: '100%',
                      borderRadius: 8,
                      height: 320,
                      '@lg': {
                        height: 540,
                      },
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    css={{
                      position: 'absolute',
                      left: '$4',
                      display: 'none',
                      aspectRatio: 'square',
                      '@md': {
                        display: 'block',
                      },
                      '@lg': {
                        top: '$4',
                      },
                      bottom: '$4',
                    }}
                  >
                    <Img
                      alt="collection image"
                      width={80}
                      height={80}
                      style={{
                        display: 'block',
                        borderRadius: 8,
                        border: '2px solid rgba(255,255,255,0.6)',
                        aspectRatio: 'square',
                        minHeight: 80,
                      }}
                      src={
                        optimizeImage(
                          // topCollection?.image,
                          '/assets/collection1.jpg',
                          200
                        ) as string
                      }
                    />
                  </Box>
                </Box>
                <Box css={{ flex: 2, zIndex: 4 }}>
                  <Flex direction="column" css={{ height: '100%' }}>
                    <Box css={{ flex: 1 }}>
                      <Text style="h3" css={{ mt: '$3', mb: '$2' }} as="h3">
                        Spherical GeNFT
                      </Text>

                      <Box
                        css={{
                          maxWidth: 720,
                          lineHeight: 1.5,
                          fontSize: 16,
                          fontWeight: 400,
                          display: '-webkit-box',
                          color: '$gray12',
                          fontFamily: '$body',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        
                        The Spherical GeNFTs are dynamic on-chain generative
                        artworks that evolve over time as an expression of
                        membership in The Sphere. The particularities of the
                        holder's wallet become the seed for an ongoing creation.
                      </Box>

                      <Flex css={{ mt: '$4' }}>
                        <Box css={{ mr: '$5' }}>
                          <Text style="subtitle2" color="subtle">
                            FLOOR PRICE
                          </Text>
                          <Box css={{ mt: 2 }}>
                            <FormatCryptoCurrency
                              amount={floorPrice2 ?? 0}
                              textStyle={'h4'}
                              logoHeight={20}
                              // address={
                              //   topCollection?.floorAsk?.price?.currency
                              //     ?.contract
                              // }
                            />
                          </Box>
                        </Box>

                        
                      </Flex>
                      
                    </Box>
                    <Flex css={{ gap: '$4', mt: '$4' }}>
                      {theme == 'light' ? (
                        <Button
                          as="button"
                          color="primary"
                          size="large"
                          className="w-full justify-center"
                        >
                          Explore
                        </Button>
                      ) : (
                        <Button
                          as="button"
                          color="gray4"
                          size="large"
                          className="w-full justify-center"
                        >
                          Explore
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Link> */}

          {/* GRAFS */}
          {/* <Link href="/zora/collection/0xe27f011e8eb90b4d42fa7658fbe44e240d9c5f03">
            <Flex>
              <Flex
                css={{
                  '&:hover button': {
                    background: theme == 'light' ? '$primary11' : '$gray2',
                  },
                  minHeight: 540,
                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  gap: '$3',
                  p: '$4',
                  display: 'flex',
                  flexDirection: 'column',
                  '@md': {
                    p: '$5',
                    gap: '$4',
                    flexDirection: 'column',
                    display: 'flex',
                  },
                  '@lg': {
                    flexDirection: 'row',
                    p: '$5',
                    gap: '$5',
                    mt: '$4',
                  },
                  '@xl': {
                    p: '$6',
                    gap: '$6',
                  },

                  mb: '$6',
                  maxWidth: 1820,
                  mx: 'auto',
                  // borderRadius: 16,
                  // backgroundSize: 'cover',
                  // border: `1px solid $gray5`,
                  // backgroundImage: theme === 'light' ? `$gray2` : '$gray3',
                  // backgroundColor: '$gray5',
                }}
              >
                <Box
                  css={{
                    position: 'absolute',
                    top: 0,
                    display: theme === 'light' ? 'block' : 'none',
                    zIndex: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: 'blur(20px)',
                    // background: 'rgba(255, 255, 255, 0.9)',
                  }}
                />

                <Box
                  css={{
                    flex: 2,
                    position: 'relative',
                    zIndex: 5,
                    '@xl': {
                      flex: 3,
                    },
                  }}
                >
                  <StyledImage
                    src={optimizeImage(
                      // topCollection?.banner ??
                      //   topCollection?.image ??
                      //   topCollection?.recentSales?.[0]?.collection?.image ??
                      //   topCollection?.recentSales?.[0]?.token?.image,
                      '/assets/collection2.jpg',
                      1820
                    )}
                    css={{
                      width: '100%',
                      borderRadius: 8,
                      height: 320,
                      '@lg': {
                        height: 540,
                      },
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    css={{
                      position: 'absolute',
                      left: '$4',
                      display: 'none',
                      aspectRatio: 'square',
                      '@md': {
                        display: 'block',
                      },
                      '@lg': {
                        top: '$4',
                      },
                      bottom: '$4',
                    }}
                  >
                    <Img
                      alt="collection image"
                      width={80}
                      height={80}
                      style={{
                        display: 'block',
                        borderRadius: 8,
                        border: '2px solid rgba(255,255,255,0.6)',
                        aspectRatio: 'square',
                        minHeight: 80,
                      }}
                      src={
                        optimizeImage(
                          // topCollection?.image,
                          '/assets/collection2.jpg',
                          200
                        ) as string
                      }
                    />
                  </Box>
                </Box>
                <Box css={{ flex: 2, zIndex: 4 }}>
                  <Flex direction="column" css={{ height: '100%' }}>
                    <Box css={{ flex: 1 }}>
                      <Text style="h3" css={{ mt: '$3', mb: '$2' }} as="h3">
                        GRAFS
                      </Text>

                      <Box
                        css={{
                          maxWidth: 720,
                          lineHeight: 1.5,
                          fontSize: 16,
                          fontWeight: 400,
                          display: '-webkit-box',
                          color: '$gray12',
                          fontFamily: '$body',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                       
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Expedita voluptatem vitae, animi placeat, necessitatibus
                        eaque molestiae explicabo aut architecto sequi inventore
                        officia. Voluptatum explicabo, dicta assumenda rerum
                        officia distinctio voluptatibus!
                      </Box>

                      <Flex css={{ mt: '$4' }}>
                        <Box css={{ mr: '$5' }}>
                          <Text style="subtitle2" color="subtle">
                            FLOOR PRICE
                          </Text>
                          <Box css={{ mt: 2 }}>
                            <FormatCryptoCurrency
                              amount={floorPrice3 ?? 0}
                              textStyle={'h4'}
                              logoHeight={20}
                              // address={
                              //   topCollection?.floorAsk?.price?.currency
                              //     ?.contract
                              // }
                            />
                          </Box>
                        </Box>

                        
                      </Flex>
                     
                    </Box>
                    <Flex css={{ gap: '$4', mt: '$4' }}>
                      {theme == 'light' ? (
                        <Button
                          as="button"
                          color="primary"
                          size="large"
                          className="w-full justify-center"
                        >
                          Explore
                        </Button>
                      ) : (
                        <Button
                          as="button"
                          color="gray4"
                          size="large"
                          className="w-full justify-center"
                        >
                          Explore
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Link> */}
        </div>

        {/* s */}
      </Box>

      {/* <Footer /> */}
    </Layout>
  )
}

type TopSellingCollectionsSchema =
  paths['/collections/top-selling/v1']['get']['responses']['200']['schema']

type ChainTopSellingCollections = Record<string, TopSellingCollectionsSchema>

export const getServerSideProps: GetServerSideProps<{
  ssr: {
    topSellingCollections: ChainTopSellingCollections
  }
}> = async ({ params, res }) => {
  const chainPrefix = params?.chain || ''
  const chain =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain

  const topSellingCollections: ChainTopSellingCollections = {}
  try {
    const response = await fetcher(
      `${chain.reservoirBaseUrl}/collections/top-selling/v2?period=24h&includeRecentSales=true&limit=9&fillType=sale`,
      {
        headers: {
          'x-api-key': process.env.RESERVOIR_API_KEY || '',
        },
      }
    )

    topSellingCollections[chain.id] = response.data

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=180'
    )
  } catch (e) {}

  return {
    props: { ssr: { topSellingCollections } },
  }
}

export default Home
