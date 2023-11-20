import { ListModal, ListStep, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import {
  cloneElement,
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { useAccount, useWalletClient } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { createPortal } from 'react-dom'

import { Modal } from 'react-responsive-modal'

// const orderFee = process.env.NEXT_PUBLIC_MARKETPLACE_FEE

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']

type PropsList = {
  token?: ReturnType<typeof useTokens>['data'][0]
  buttonCss?: CSS
  buttonChildren?: ReactNode
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  Tooltip,
  FormatCryptoCurrency,
  Box,
  Grid,
} from '../primitives'
import { AcceptBid } from 'components/buttons'
import Image from 'next/image'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import {
  EditListingModal,
  EditListingStep,
  useReservoirClient,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBolt,
  faEdit,
  faEllipsis,
  faGasPump,
  faMagnifyingGlass,
  faRefresh,
  faHeart,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { Address } from 'wagmi'
// import { useMarketplaceChain } from 'hooks'
import { NAVBAR_HEIGHT } from 'components/navbar'
import Checkbox from 'components/primitives/Checkbox'
import { UserToken } from 'pages/portfolio/[[...address]]'
import { ChainContext } from 'context/ChainContextProvider'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { PortfolioSortingOption } from 'components/common/PortfolioSortDropdown'
import CancelListing from 'components/buttons/CancelListing'
// import { ToastContext } from 'context/ToastContextProvider'
import fetcher from 'utils/fetcher'
import { DATE_REGEX, timeTill } from 'utils/till'
import { spin } from 'components/common/LoadingSpinner'
import { formatDollar, formatNumber } from 'utils/numbers'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import { ItemView } from './ViewToggle'
import PortfolioTokenCard from './PortfolioTokenCard'
import optimizeImage from 'utils/optimizeImage'
import { useState } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { spanStatusfromHttpCode } from '@sentry/nextjs'

type Props = {
  address: Address | undefined
  filterCollection: string | undefined
  sortBy: PortfolioSortingOption
  isLoading?: boolean
  hideSpam: boolean
  selectedItems: UserToken[]
  isOwner: boolean
  itemView: ItemView
  acceptModalOpen?: boolean
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
}

const ownerDesktopTemplateColumns = '1.25fr repeat(3, .75fr) 1.5fr'
const desktopTemplateColumns = '1.25fr repeat(3, .75fr)'

export type TokenTableRef = { mutate: any }

export const TokenTable = forwardRef<TokenTableRef, Props>(
  (
    {
      address,
      isLoading,
      sortBy,
      filterCollection,
      selectedItems,
      isOwner,
      itemView,
      setSelectedItems,
      hideSpam,
    },
    ref
  ) => {
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})
    const client = useReservoirClient()
    const [acceptBidModalOpen, setAcceptBidModalOpen] = useState(false)

    const [playingElement, setPlayingElement] = useState<
      HTMLAudioElement | HTMLVideoElement | null
    >()

    let tokenQuery: Parameters<typeof useUserTokens>['1'] = {
      limit: 20,
      sortBy: sortBy,
      collection: filterCollection,
      includeTopBid: true,
      includeRawData: true,
      includeAttributes: true,
      excludeSpam: hideSpam,
    }

    const { chain } = useContext(ChainContext)

    if (chain.collectionSetId) {
      tokenQuery.collectionsSetId = chain.collectionSetId
    } else if (chain.community) {
      tokenQuery.community = chain.community
    }

    const {
      data: tokens,
      fetchNextPage,
      mutate,
      setSize,
      isFetchingPage,
      isValidating,
    } = useUserTokens(address, tokenQuery, {
      revalidateOnMount: true,
      fallbackData: [],
    })

    useEffect(() => {
      mutate()
      return () => {
        setSize(1)
      }
    }, [])

    useEffect(() => {
      const isVisible = !!loadMoreObserver?.isIntersecting
      if (isVisible) {
        fetchNextPage()
      }
    }, [loadMoreObserver?.isIntersecting])

    useEffect(() => {
      const eventListener: Parameters<
        NonNullable<ReturnType<typeof useReservoirClient>>['addEventListener']
      >['0'] = (event, chainId) => {
        switch (event.name) {
          case 'accept_offer_complete': {
            if (!acceptBidModalOpen && !selectedItems.length) {
              mutate()
              setSelectedItems([])
            }
            break
          }
        }
      }
      client?.addEventListener(eventListener)

      return () => {
        client?.removeEventListener(eventListener)
      }
    }, [client])

    useEffect(() => {
      if (acceptBidModalOpen) {
        setSelectedItems([])
      }
    }, [acceptBidModalOpen])

    useImperativeHandle(ref, () => ({
      mutate,
    }))

    return (
      <>
        {!isValidating && !isFetchingPage && tokens && tokens.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            css={{ py: '$6', gap: '$4', width: '100%' }}
          >
            <Text css={{ color: '$gray11' }}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
            </Text>
            <Text css={{ color: '$gray11' }}>No items found</Text>
          </Flex>
        ) : (
          <Flex direction="column" css={{ width: '100%' }}>
            {isLoading ? null : itemView === 'list' ? (
              <>
                <TableHeading isOwner={isOwner} />
                {tokens.map((token, i) => {
                  if (!token) return null

                  return (
                    <TokenTableRow
                      key={`${token.token?.tokenId}-${i}`}
                      token={token}
                      mutate={mutate}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                      isOwner={isOwner}
                      onAcceptBidModalOpened={(open) => {
                        setAcceptBidModalOpen(open)
                      }}
                    />
                  )
                })}
              </>
            ) : (
              <Grid
                css={{
                  gap: '$4',
                  width: '100%',
                  pb: '$6',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  '@md': {
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(240px, 1fr))',
                  },
                }}
              >
                {tokens?.map((token, i) => (
                  <PortfolioTokenCard
                    key={i}
                    token={token}
                    isOwner={isOwner}
                    address={address as Address}
                    tokenCount={
                      token?.token?.kind === 'erc1155'
                        ? token.ownership?.tokenCount
                        : undefined
                    }
                    mutate={mutate}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    rarityEnabled={true}
                    onMediaPlayed={(e) => {
                      if (
                        playingElement &&
                        playingElement !== e.nativeEvent.target
                      ) {
                        playingElement.pause()
                      }
                      const element =
                        (e.nativeEvent.target as HTMLAudioElement) ||
                        (e.nativeEvent.target as HTMLVideoElement)
                      if (element) {
                        setPlayingElement(element)
                      }
                    }}
                  />
                ))}
              </Grid>
            )}
            <div ref={loadMoreRef}></div>
          </Flex>
        )}
        {isValidating && (
          <Flex align="center" justify="center" css={{ py: '$6' }}>
            <LoadingSpinner />
          </Flex>
        )}
      </>
    )
  }
)

type TokenTableRowProps = {
  token: ReturnType<typeof useUserTokens>['data'][0]
  mutate?: MutatorCallback
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  onAcceptBidModalOpened: (open: boolean) => void
  isOwner: boolean
}

const TokenTableRow: FC<TokenTableRowProps> = ({
  token,
  selectedItems,
  isOwner,
  onAcceptBidModalOpened,
  mutate,
  setSelectedItems,
}) => {
  const { routePrefix, proxyApi } = useMarketplaceChain()
  const { addToast } = useContext(ToastContext)

  const [isRefreshing, setIsRefreshing] = useState(false)
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  const [openHeart, setOpenHeart] = useState(false)
  const [heartValue, setHeartValue] = useState(0)

  const addSelectedItem = (item: UserToken) => {
    setSelectedItems([...selectedItems, item])
  }

  const removeSelectedItem = (item: UserToken) => {
    setSelectedItems(
      selectedItems.filter(
        (selectedItem) =>
          selectedItem?.token?.tokenId !== item?.token?.tokenId ||
          selectedItem?.token?.contract !== item?.token?.contract
      )
    )
  }

  const isSelectedItem = (item: UserToken) => {
    return selectedItems.some(
      (selectedItem) =>
        selectedItem?.token?.tokenId === item?.token?.tokenId &&
        selectedItem?.token?.contract === item?.token?.contract
    )
  }

  const [acceptBidModalOpen, setAcceptBidModalOpen] = useState(false)

  const imageSrc = useMemo(() => {
    return token?.token?.tokenId
      ? token?.token?.imageSmall ||
          optimizeImage(token?.token?.collection?.imageUrl, 250)
      : optimizeImage(token?.token?.collection?.imageUrl, 250)
  }, [
    token?.token?.tokenId,
    token?.token?.imageSmall,
    token?.token?.collection?.imageUrl,
  ])

  const isOracleOrder = token?.ownership?.floorAsk?.isNativeOffChainCancellable

  const contract = token.token?.collection?.id
    ? token.token?.collection.id?.split(':')[0]
    : undefined

  const List: FC<PropsList> = ({
    token,
    buttonCss,
    buttonChildren,
    buttonProps,
    mutate,
  }) => {
    const { isDisconnected } = useAccount()
    const { openConnectModal } = useConnectModal()
    const { addToast } = useContext(ToastContext)

    const marketplaceChain = useMarketplaceChain()
    // console.log(marketplaceChain)

    const { data: signer } = useWalletClient()
    // console.log(signer)
    const listingCurrencies: ListingCurrencies =
      marketplaceChain.listingCurrencies
    const tokenId = token?.token?.tokenId
    const contract = token?.token?.contract

    // console.log(openConnectModal)

    const trigger = (
      <Button css={buttonCss} color="primary" {...buttonProps}>
        {buttonChildren}
      </Button>
    )

    //connecting orderFee to heartValue:
    const [orderFee, setOrderFee] = useState('')
    const [orderFees, setOrderFees] = useState<string[]>([])
    useEffect(() => {
      const newOrderFee =
        '0x5C6DC3b2a55be4b02e26b75848e27c19df4Af9fE:' + heartValue * 100
      setOrderFee(newOrderFee)
      setOrderFees([newOrderFee])
    }, [heartValue])

    // const orderFees = orderFee ? [orderFee] : []
    // console.log(heartValue)

    //list heart useEffect
    const heartPortalRef = useRef()
    const HeartModal = ({}) => {
      return (
        <div className="sticky top-0 left-0 h-screen w-screen bg-black/30 flex items-center justify-center z-[1000000000] text-black">
          <div className="flex flex-col items-center justify-center p-4 w-1/2 h-1/2 bg-white ">
            <div className="">
              Você é bonzinho e quer doar uma porcentagem para o projeto?
            </div>
            <form>
              <input
                type="number"
                name="percentage"
                id="percentage"
                placeholder="0"
                defaultValue="0"
                onChange={(e) => setHeartValue(+e.target.value)}
              />
              <button
                onClick={() => {
                  setOpenHeart(false)
                  // +open real List!
                }}
              >
                ok
              </button>
            </form>
          </div>
        </div>
      )
    }
    useEffect(() => {
      if (openHeart) {
        createPortal(<HeartModal />, document.body, 'heart')
      }
    }, [openHeart])
    // console.log(openHeart)

    if (isDisconnected) {
      return cloneElement(trigger, {
        onClick: async () => {
          if (!signer) {
            openConnectModal?.()
          }
        },
      })
    } else
      return (
        <ListModal
          trigger={trigger}
          // nativeOnly={true}
          collectionId={contract}
          tokenId={tokenId}
          feesBps={orderFees}
          enableOnChainRoyalties={true}
          currencies={listingCurrencies}
          chainId={marketplaceChain.id}
          onClose={(data, stepData, currentStep) => {
            if (mutate && currentStep == ListStep.Complete) mutate()
            setOpenHeart(false)
          }}
          onListingError={(err: any) => {
            if (err?.code === 4001) {
              addToast?.({
                title: 'User canceled transaction',
                description: 'You have canceled the transaction.',
              })
              return
            }
            addToast?.({
              title: 'Could not list token',
              description: 'The transaction was not completed.',
            })
          }}
        />
      )
  }

  if (isSmallDevice) {
    return (
      <Flex
        key={token?.token?.tokenId}
        direction="column"
        align="start"
        css={{
          gap: '$3',
          borderBottom: '1px solid $gray3',
          py: '$3',
          width: '100%',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <Link
          href={`/${routePrefix}/asset/${token?.token?.contract}:${token?.token?.tokenId}`}
        >
          <Flex align="center">
            {imageSrc && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={imageSrc}
                alt={`${token?.token?.name}`}
                width={36}
                height={36}
              />
            )}
            <Flex
              direction="column"
              css={{
                ml: '$2',
                overflow: 'hidden',
                minWidth: 0,
              }}
            >
              <Text style="subtitle3" ellipsify color="subtle">
                {token?.token?.collection?.name}
              </Text>
              <Text style="subtitle2" ellipsify>
                {token?.token?.name || `#${token?.token?.tokenId}`}
              </Text>
            </Flex>
          </Flex>
        </Link>
        <Flex justify="between" css={{ width: '100%', gap: '$3' }}>
          <Flex direction="column" align="start" css={{ width: '100%' }}>
            <Text style="subtitle3" color="subtle">
              Floor
            </Text>
            <FormatCryptoCurrency
              amount={token?.token?.collection?.floorAskPrice?.amount?.decimal}
              address={
                token?.token?.collection?.floorAskPrice?.currency?.contract
              }
              decimals={
                token?.token?.collection?.floorAskPrice?.currency?.decimals
              }
              textStyle="subtitle2"
              logoHeight={14}
            />
          </Flex>
          <Flex direction="column" align="start" css={{ width: '100%' }}>
            <Text style="subtitle3" color="subtle">
              Top Offer
            </Text>
            <FormatCryptoCurrency
              amount={token?.token?.topBid?.price?.amount?.decimal}
              address={token?.token?.topBid?.price?.currency?.contract}
              decimals={token?.token?.topBid?.price?.currency?.decimals}
              textStyle="subtitle2"
              logoHeight={14}
            />
          </Flex>
        </Flex>
        <Flex css={{ gap: '$2', width: '100%' }}>
          {token?.token?.topBid?.price?.amount?.decimal && isOwner ? (
            <AcceptBid
              tokenId={token.token.tokenId}
              collectionId={token?.token?.contract}
              mutate={mutate}
              openState={[
                acceptBidModalOpen,
                (open) => {
                  if (open !== acceptBidModalOpen) {
                    onAcceptBidModalOpened(open as boolean)
                  }
                  setAcceptBidModalOpen(open)
                },
              ]}
              buttonCss={{
                width: '100%',
                maxWidth: '300px',
                justifyContent: 'center',
                px: '20px',
                backgroundColor: '$primary9',
                color: 'white',
                '&:hover': {
                  backgroundColor: '$primary10',
                },
              }}
              buttonChildren={
                <Flex align="center" css={{ gap: '$2' }}>
                  <FontAwesomeIcon icon={faBolt} />
                  Sell
                </Flex>
              }
            />
          ) : null}
          {isOwner ? (
            <>
              {/* 2 step listing with custom fee: (MOBILE) */}
              <div
                className="px-5 py-1 bg-neutral-700 font-bold rounded-lg flex items-center cursor-pointer"
                onClick={() => setOpenHeart(true)}
              >
                List
              </div>

              {/* {openHeart && (
                
              )} */}
              <Modal
                open={openHeart}
                onClose={() => setOpenHeart(false)}
                classNames={{
                  modal: 'customModal',
                  // modalContainer: 'customModal',
                }}
                center
              >
                <div className="flex flex-col items-center justify-center px-6 pt-16 pb-8 gap-4 bg-slate-600 ">
                  <div className="flex flex-col gap-3">
                    <div className="">
                      Would you like to set a percentage of your sale to be
                      donated to{' '}
                      <span className="font-bold">
                        The Sphere Common Treasury
                      </span>{' '}
                      multisig, so we can continue funding live art?
                    </div>
                    <div className="">
                      If YES, select the percentage using the slider, then click
                      "Next". The donation will be deducted from the total price
                      you set.
                    </div>
                    <div className="">
                      If NOT, that's ok - you can click "Next" and proceed to
                      your listing.
                    </div>
                  </div>
                  <form className="mt-4 flex flex-col gap-6">
                    <div className="text-center bg-white/20 rounded-lg p-6 pt-10 px-10 pb-10 flex flex-col gap-6 items-center">
                      <div className="text-center text-neutral-300 flex">
                        Your donation:{' '}
                        <div className=" font-bold w-[3rem]">{heartValue}%</div>
                      </div>
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="duration-300 ease-in-out"
                        color="purple"
                        size={
                          ((heartValue + 10 - (heartValue % 10)) / 10 +
                            'x') as SizeProp
                        }
                      />

                      <input
                        type="range"
                        name="percentage"
                        id="percentage"
                        placeholder="0"
                        defaultValue="0"
                        max={
                          token?.token?.chainId == 1 ||
                          token?.token?.chainId == 5
                            ? 90
                            : 80
                        }
                        className="w-[260px]"
                        onChange={(e) => setHeartValue(+e.target.value)}
                      />
                    </div>
                    <div className="mt-6 flex gap-4 justify-around">
                      <button
                        className="py-2 px-3 rounded-lg bg-[#2c2c59]"
                        onClick={() => {
                          setOpenHeart(false)
                        }}
                      >
                        Cancel
                      </button>
                      {/* regular List button: */}
                      <List
                        token={token as ReturnType<typeof useTokens>['data'][0]}
                        mutate={mutate}
                        buttonCss={{
                          width: '100%',
                          maxWidth: '300px',
                          justifyContent: 'center',
                          px: '20px',
                          backgroundColor: '$gray9',
                          border: '1px solid white',
                          color: '$gray12',
                          '&:hover': {
                            backgroundColor: '$gray4',
                          },
                        }}
                        buttonChildren={
                          <span className="flexjustify-betweenw-full">
                            <FontAwesomeIcon
                              className="mr-3"
                              icon={faAngleDoubleRight}
                            />
                            Next
                          </span>
                        }
                      />
                    </div>
                  </form>
                </div>
              </Modal>
            </>
          ) : null}

          <Dropdown
            modal={false}
            trigger={
              <Button
                color="gray3"
                size="xs"
                css={{
                  width: 44,
                  height: 44,
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </Button>
            }
            contentProps={{ asChild: true, forceMount: true }}
          >
            <DropdownMenuItem
              css={{ py: '$3', width: '100%' }}
              onClick={(e) => {
                if (isRefreshing) {
                  e.preventDefault()
                  return
                }
                setIsRefreshing(true)
                fetcher(
                  `${window.location.origin}/${proxyApi}/tokens/refresh/v1`,
                  undefined,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      token: `${contract}:${token.token?.tokenId}`,
                    }),
                  }
                )
                  .then(({ data, response }) => {
                    if (response.status === 200) {
                      addToast?.({
                        title: 'Refresh token',
                        description:
                          'Request to refresh this token was accepted.',
                      })
                    } else {
                      throw data
                    }
                    setIsRefreshing(false)
                  })
                  .catch((e) => {
                    const ratelimit = DATE_REGEX.exec(e?.message)?.[0]

                    addToast?.({
                      title: 'Refresh token failed',
                      description: ratelimit
                        ? `This token was recently refreshed. The next available refresh is ${timeTill(
                            ratelimit
                          )}.`
                        : `This token was recently refreshed. Please try again later.`,
                    })

                    setIsRefreshing(false)
                    throw e
                  })
              }}
            >
              <Flex align="center" css={{ gap: '$2' }}>
                <Box
                  css={{
                    color: '$gray10',
                    animation: isRefreshing
                      ? `${spin} 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite`
                      : 'none',
                  }}
                >
                  <FontAwesomeIcon icon={faRefresh} width={16} height={16} />
                </Box>
                <Text>Refresh</Text>
              </Flex>
            </DropdownMenuItem>

            {isOracleOrder &&
            token?.ownership?.floorAsk?.id &&
            token?.token?.tokenId &&
            token?.token?.collection?.id ? (
              <EditListingModal
                trigger={
                  <Flex
                    align="center"
                    css={{
                      gap: '$2',
                      px: '$2',
                      py: '$3',
                      borderRadius: 8,
                      outline: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '$gray5',
                      },
                      '&:focus': {
                        backgroundColor: '$gray5',
                      },
                    }}
                  >
                    <Box css={{ color: '$gray10' }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Box>
                    <Text>Edit Listing</Text>
                  </Flex>
                }
                listingId={token?.ownership?.floorAsk?.id}
                tokenId={token?.token?.tokenId}
                collectionId={token?.token?.collection?.id}
                onClose={(data, currentStep) => {
                  if (mutate && currentStep == EditListingStep.Complete)
                    mutate()
                }}
              />
            ) : null}

            {token?.ownership?.floorAsk?.id ? (
              <CancelListing
                listingId={token.ownership.floorAsk.id as string}
                mutate={mutate}
                trigger={
                  <Flex
                    css={{
                      px: '$2',
                      py: '$3',
                      borderRadius: 8,
                      outline: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '$gray5',
                      },
                      '&:focus': {
                        backgroundColor: '$gray5',
                      },
                    }}
                  >
                    {!isOracleOrder ? (
                      <Tooltip
                        content={
                          <Text style="body2" as="p">
                            Cancelling this order requires gas.
                          </Text>
                        }
                      >
                        <Flex align="center" css={{ gap: '$2' }}>
                          <Box css={{ color: '$gray10' }}>
                            <FontAwesomeIcon icon={faGasPump} />
                          </Box>
                          <Text color="error">Cancel</Text>
                        </Flex>
                      </Tooltip>
                    ) : (
                      <Text color="error">Cancel</Text>
                    )}
                  </Flex>
                }
              />
            ) : null}
          </Dropdown>
        </Flex>
      </Flex>
    )
  }

  return (
    <TableRow
      key={token?.token?.tokenId}
      css={{
        gridTemplateColumns: isOwner
          ? ownerDesktopTemplateColumns
          : desktopTemplateColumns,
      }}
    >
      <TableCell css={{ minWidth: 0, overflow: 'hidden' }}>
        <Flex align="center" css={{ gap: '$3' }}>
          {isOwner ? (
            <Checkbox
              checked={isSelectedItem(token)}
              onCheckedChange={(checked) => {
                if (checked) {
                  addSelectedItem(token)
                } else {
                  removeSelectedItem(token)
                }
              }}
            />
          ) : null}
          <Link
            href={`/${routePrefix}/asset/${token?.token?.contract}:${token?.token?.tokenId}`}
          >
            <Flex align="center">
              {imageSrc && (
                <Image
                  style={{
                    borderRadius: '4px',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                  }}
                  loader={({ src }) => src}
                  src={imageSrc}
                  alt={`${token?.token?.name}`}
                  width={48}
                  height={48}
                />
              )}
              <Flex
                direction="column"
                css={{
                  ml: '$2',
                  overflow: 'hidden',
                }}
              >
                <Flex justify="between" align="center" css={{ gap: '$2' }}>
                  <Text style="subtitle3" ellipsify color="subtle">
                    {token?.token?.collection?.name}
                  </Text>
                  {token?.token?.kind === 'erc1155' &&
                    token?.ownership?.tokenCount && (
                      <Flex
                        justify="center"
                        align="center"
                        css={{
                          borderRadius: 9999,
                          backgroundColor: '$gray4',
                          maxWidth: '50%',
                        }}
                      >
                        <Text
                          ellipsify
                          style="subtitle3"
                          css={{ px: '$2', fontSize: 10 }}
                        >
                          x{formatNumber(token?.ownership?.tokenCount, 0, true)}
                        </Text>
                      </Flex>
                    )}
                  <OpenSeaVerified
                    openseaVerificationStatus={
                      token?.token?.collection?.openseaVerificationStatus
                    }
                  />
                </Flex>
                <Text style="subtitle2" ellipsify>
                  {token?.token?.name || `#${token?.token?.tokenId}`}
                </Text>
              </Flex>
            </Flex>
          </Link>
        </Flex>
      </TableCell>
      <TableCell>
        <Tooltip
          side="left"
          sideOffset="2"
          open={
            token?.ownership?.floorAsk?.price?.amount?.decimal
              ? undefined
              : false
          }
          content={
            <Flex direction="column" css={{ gap: '$2' }}>
              <Flex justify="between" css={{ gap: '$3' }}>
                <Text style="body3">Total Listed Price</Text>
                <FormatCryptoCurrency
                  amount={token?.ownership?.floorAsk?.price?.amount?.decimal}
                  address={
                    token?.ownership?.floorAsk?.price?.currency?.contract
                  }
                  decimals={
                    token?.ownership?.floorAsk?.price?.currency?.decimals
                  }
                  textStyle="subtitle3"
                  logoHeight={14}
                />
              </Flex>
              <Flex justify="between" css={{ gap: '$2' }}>
                <Text style="body3">You Get</Text>
                <FormatCryptoCurrency
                  amount={token?.ownership?.floorAsk?.price?.netAmount?.decimal}
                  address={
                    token?.ownership?.floorAsk?.price?.currency?.contract
                  }
                  decimals={
                    token?.ownership?.floorAsk?.price?.currency?.decimals
                  }
                  textStyle="subtitle3"
                  logoHeight={14}
                />
              </Flex>
            </Flex>
          }
        >
          <Flex align="center" css={{ gap: '$2' }}>
            {token.ownership?.floorAsk?.source?.icon ? (
              <img
                src={token.ownership.floorAsk.source.icon as string}
                alt="Listing Source Icon"
                style={{ height: 16, width: 16 }}
              />
            ) : null}
            <FormatCryptoCurrency
              amount={token?.ownership?.floorAsk?.price?.amount?.decimal}
              address={token?.ownership?.floorAsk?.price?.currency?.contract}
              decimals={token?.ownership?.floorAsk?.price?.currency?.decimals}
              textStyle="subtitle1"
              logoHeight={14}
            />
          </Flex>
        </Tooltip>
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={token?.token?.collection?.floorAskPrice?.amount?.decimal}
          address={token?.token?.collection?.floorAskPrice?.currency?.contract}
          decimals={token?.token?.collection?.floorAskPrice?.currency?.decimals}
          textStyle="subtitle1"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <Tooltip
          side="left"
          sideOffset="2"
          open={
            token?.token?.topBid?.price?.amount?.decimal ? undefined : false
          }
          content={
            <Flex direction="column" css={{ gap: '$2' }}>
              <Flex justify="between" css={{ gap: '$3' }}>
                <Text style="body3">Total Offer</Text>
                <FormatCryptoCurrency
                  amount={token?.token?.topBid?.price?.amount?.decimal}
                  address={token?.token?.topBid?.price?.currency?.contract}
                  decimals={token?.token?.topBid?.price?.currency?.decimals}
                  textStyle="subtitle3"
                  logoHeight={14}
                />
              </Flex>
              <Flex justify="between" css={{ gap: '$2' }}>
                <Text style="body3">You Get</Text>
                <FormatCryptoCurrency
                  amount={token?.token?.topBid?.price?.netAmount?.decimal}
                  address={token?.token?.topBid?.price?.currency?.contract}
                  decimals={token?.token?.topBid?.price?.currency?.decimals}
                  textStyle="subtitle3"
                  logoHeight={14}
                />
              </Flex>
            </Flex>
          }
        >
          <Flex direction="column" align="start">
            <Flex css={{ gap: '$2' }} align="center">
              {/* TODO: Replace this when the api is patched */}
              {(token.token?.topBid as any)?.source?.icon ? (
                <img
                  src={(token?.token?.topBid as any).source.icon as string}
                  alt="Listing Source Icon"
                  style={{ height: 16, width: 16 }}
                />
              ) : null}
              <FormatCryptoCurrency
                amount={token?.token?.topBid?.price?.amount?.decimal}
                address={token?.token?.topBid?.price?.currency?.contract}
                decimals={token?.token?.topBid?.price?.currency?.decimals}
                textStyle="subtitle2"
                logoHeight={14}
              />
            </Flex>
            {token?.token?.topBid?.price?.amount?.usd ? (
              <Text style="subtitle3" css={{ color: '$gray11' }} ellipsify>
                {formatDollar(
                  token?.token?.topBid?.price?.amount?.usd as number
                )}
              </Text>
            ) : null}
          </Flex>
        </Tooltip>
      </TableCell>
      {isOwner && (
        <TableCell>
          <Flex justify="end" css={{ gap: '$3' }}>
            {token?.token?.topBid?.price?.amount?.decimal ? (
              <AcceptBid
                openState={[
                  acceptBidModalOpen,
                  (open) => {
                    if (open !== acceptBidModalOpen) {
                      onAcceptBidModalOpened(open as boolean)
                    }
                    setAcceptBidModalOpen(open)
                  },
                ]}
                tokenId={token.token.tokenId}
                collectionId={token?.token?.contract}
                buttonCss={{
                  px: '32px',
                  backgroundColor: '$primary9',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '$primary10',
                  },
                }}
                buttonChildren={
                  <Flex align="center" css={{ gap: '$2' }}>
                    <FontAwesomeIcon icon={faBolt} />
                    Sell
                  </Flex>
                }
                mutate={mutate}
              />
            ) : null}

            <>
              {/* 2 step listing with custom fee: (medium) */}
              <div
                className="px-5 py-1 bg-neutral-700 font-bold rounded-lg flex items-center cursor-pointer"
                onClick={() => setOpenHeart(true)}
              >
                List
              </div>

              {/* {openHeart && (
                
              )} */}
              <Modal
                open={openHeart}
                onClose={() => setOpenHeart(false)}
                center
              >
                <div className="flex flex-col items-center justify-center px-6 pt-16 pb-4 gap-4 bg-slate-600 ">
                  <div className="flex flex-col gap-3">
                    <div className="">
                      Would you like to set a percentage of your sale to be
                      donated to{' '}
                      <span className="font-bold">
                        The Sphere Common Treasury
                      </span>{' '}
                      multisig, so we can continue funding live art?
                    </div>
                    <div className="">
                      If YES, select the percentage using the slider, then click
                      "Next". The donation will be deducted from the total price
                      you set.
                    </div>
                    <div className="">
                      If NOT, that's ok - you can click "Next" and proceed to
                      your listing.
                    </div>
                  </div>
                  <form className="mt-4 flex flex-col gap-6 w-full items-center">
                    <div className="text-center gap-8 bg-white/20 rounded-lg p-6 pt-10 px-10 w-fit">
                      <input
                        type="range"
                        name="percentage"
                        id="percentage"
                        placeholder="0"
                        defaultValue="0"
                        max={
                          token?.token?.chainId == 1 ||
                          token?.token?.chainId == 5
                            ? 90
                            : 80
                        }
                        className="w-[300px] mb-6"
                        onChange={(e) => setHeartValue(+e.target.value)}
                      />
                      <div className="text-center pb-5 text-neutral-300 flex justify-center">
                        Your donation:{' '}
                        <div className="ml-4 font-bold min-w-[3rem]">
                          {heartValue}%
                        </div>
                      </div>
                      <FontAwesomeIcon
                        icon={faHeart}
                        color="purple"
                        className="duration-300 ease-in-out"
                        size={
                          ((heartValue + 10 - (heartValue % 10)) / 10 +
                            'x') as SizeProp
                        }
                      />
                    </div>
                    <div className="flex gap-4 w-full justify-between mt-4">
                      <button
                        className="py-2 px-5 rounded-lg bg-[#2c2c59]"
                        onClick={() => {
                          setOpenHeart(false)
                        }}
                      >
                        Cancel
                      </button>

                      {/* regular List button: */}
                      <List
                        token={token as ReturnType<typeof useTokens>['data'][0]}
                        buttonCss={{
                          px: '100px',
                          backgroundColor: '$gray3',
                          color: '$gray12',
                          border: '1px solid white',
                          '&:hover': {
                            backgroundColor: '$gray4',
                          },
                        }}
                        // buttonChildren="List"
                        buttonChildren={
                          <span className="flexjustify-betweenw-full">
                            <FontAwesomeIcon
                              className="mr-3"
                              icon={faAngleDoubleRight}
                            />
                            Next
                          </span>
                        }
                        mutate={mutate}
                      />
                    </div>
                  </form>
                </div>
              </Modal>
            </>

            <Dropdown
              modal={false}
              trigger={
                <Button
                  color="gray3"
                  size="xs"
                  css={{ width: 44, justifyContent: 'center' }}
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </Button>
              }
              contentProps={{ asChild: true, forceMount: true }}
            >
              <DropdownMenuItem
                css={{ py: '$3', width: '100%' }}
                onClick={(e) => {
                  if (isRefreshing) {
                    e.preventDefault()
                    return
                  }
                  setIsRefreshing(true)
                  fetcher(
                    `${window.location.origin}/${proxyApi}/tokens/refresh/v1`,
                    undefined,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        token: `${contract}:${token.token?.tokenId}`,
                      }),
                    }
                  )
                    .then(({ data, response }) => {
                      if (response.status === 200) {
                        addToast?.({
                          title: 'Refresh token',
                          description:
                            'Request to refresh this token was accepted.',
                        })
                      } else {
                        throw data
                      }
                      setIsRefreshing(false)
                    })
                    .catch((e) => {
                      const ratelimit = DATE_REGEX.exec(e?.message)?.[0]

                      addToast?.({
                        title: 'Refresh token failed',
                        description: ratelimit
                          ? `This token was recently refreshed. The next available refresh is ${timeTill(
                              ratelimit
                            )}.`
                          : `This token was recently refreshed. Please try again later.`,
                      })

                      setIsRefreshing(false)
                      throw e
                    })
                }}
              >
                <Flex align="center" css={{ gap: '$2' }}>
                  <Box
                    css={{
                      color: '$gray10',
                      animation: isRefreshing
                        ? `${spin} 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite`
                        : 'none',
                    }}
                  >
                    <FontAwesomeIcon icon={faRefresh} width={16} height={16} />
                  </Box>
                  <Text>Refresh</Text>
                </Flex>
              </DropdownMenuItem>

              {isOracleOrder &&
              token?.ownership?.floorAsk?.id &&
              token?.token?.tokenId &&
              token?.token?.collection?.id ? (
                <EditListingModal
                  trigger={
                    <Flex
                      align="center"
                      css={{
                        gap: '$2',
                        px: '$2',
                        py: '$3',
                        borderRadius: 8,
                        outline: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '$gray5',
                        },
                        '&:focus': {
                          backgroundColor: '$gray5',
                        },
                      }}
                    >
                      <Box css={{ color: '$gray10' }}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Box>
                      <Text>Edit Listing</Text>
                    </Flex>
                  }
                  listingId={token?.ownership?.floorAsk?.id}
                  tokenId={token?.token?.tokenId}
                  collectionId={token?.token?.collection?.id}
                  onClose={(data, currentStep) => {
                    if (mutate && currentStep == EditListingStep.Complete)
                      mutate()
                  }}
                />
              ) : null}

              {token?.ownership?.floorAsk?.id ? (
                <CancelListing
                  listingId={token.ownership.floorAsk.id as string}
                  mutate={mutate}
                  trigger={
                    <Flex
                      css={{
                        px: '$2',
                        py: '$3',
                        borderRadius: 8,
                        outline: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '$gray5',
                        },
                        '&:focus': {
                          backgroundColor: '$gray5',
                        },
                      }}
                    >
                      {!isOracleOrder ? (
                        <Tooltip
                          content={
                            <Text style="body2" as="p">
                              Cancelling this order requires gas.
                            </Text>
                          }
                        >
                          <Flex align="center" css={{ gap: '$2' }}>
                            <Box css={{ color: '$gray10' }}>
                              <FontAwesomeIcon icon={faGasPump} />
                            </Box>
                            <Text color="error">Cancel</Text>
                          </Flex>
                        </Tooltip>
                      ) : (
                        <Text color="error">Cancel</Text>
                      )}
                    </Flex>
                  }
                />
              ) : null}
            </Dropdown>
          </Flex>
        </TableCell>
      )}
    </TableRow>
  )
}
const TableHeading: FC<{ isOwner: boolean }> = ({ isOwner }) => (
  <HeaderRow
    css={{
      display: 'none',
      '@md': { display: 'grid' },
      gridTemplateColumns: isOwner
        ? ownerDesktopTemplateColumns
        : desktopTemplateColumns,
      position: 'sticky',
      top: NAVBAR_HEIGHT,
      backgroundColor: '$neutralBg',
    }}
  >
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Items
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Listed Price
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Floor
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Top Offer
      </Text>
    </TableCell>
    {isOwner ? <TableCell></TableCell> : null}
  </HeaderRow>
)
