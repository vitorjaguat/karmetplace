import {
  faCheck,
  faEdit,
  faEllipsis,
  faGasPump,
  faHand,
  faPlus,
  faRefresh,
  faHeart,
  faAngleDoubleRight,
  faShareSquare,
} from '@fortawesome/free-solid-svg-icons'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import Modal from 'react-responsive-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  EditListingModal,
  EditListingStep,
  extractMediaType,
  TokenMedia,
  useDynamicTokens,
  useTokens,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { AcceptBid } from 'components/buttons'
import BuyNow from 'components/buttons/BuyNow'
import CancelListing from 'components/buttons/CancelListing'
import List from 'components/buttons/List'
import { spin } from 'components/common/LoadingSpinner'
import {
  Box,
  Button,
  Flex,
  FormatCryptoCurrency,
  Text,
  Tooltip,
} from 'components/primitives'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import Link from 'next/link'
import { UserToken } from 'pages/portfolio/[[...address]]'
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { MutatorCallback } from 'swr'
import { useMediaQuery } from 'react-responsive'
import fetcher from 'utils/fetcher'
import { formatNumber } from 'utils/numbers'
import { DATE_REGEX, timeTill } from 'utils/till'
import { Address } from 'wagmi'
import Image from 'next/image'
import optimizeImage from 'utils/optimizeImage'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { createWalletClient, http, custom } from 'viem'
import { mainnet, zora, goerli } from 'viem/chains'
import {
  getClient,
  Execute,
  SignatureStepItem,
  TransactionStepItem,
} from '@reservoir0x/reservoir-sdk'

type PortfolioTokenCardProps = {
  // setOpenHeart: Dispatch<SetStateAction<boolean>>
  token: ReturnType<typeof useUserTokens>['data'][0]
  address: Address
  isOwner: boolean
  rarityEnabled: boolean
  tokenCount?: string
  orderQuantity?: number
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  mutate?: MutatorCallback
  onMediaPlayed?: (
    e: SyntheticEvent<HTMLAudioElement | HTMLVideoElement, Event>
  ) => void
}

export default ({
  token,
  address,
  isOwner,
  rarityEnabled = true,
  orderQuantity,
  tokenCount,
  selectedItems,
  setSelectedItems,
  mutate,
  onMediaPlayed,
}: PortfolioTokenCardProps) => {
  const { theme } = useTheme()
  const { addToast } = useContext(ToastContext)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [openHeart, setOpenHeart] = useState(false)
  const [heartValue, setHeartValue] = useState(0)

  //connecting orderFee to heartValue:
  const [orderFees, setOrderFees] = useState<string[]>([])
  useEffect(() => {
    const newOrderFee =
      '0xBFd118f0ff5d6f4D3Eb999eAF197Dbfcc421C5Ea:' +
      Math.floor(heartValue * 79.99) ///////////////////
    setOrderFees([newOrderFee])
  }, [heartValue])

  let dynamicToken = token as ReturnType<typeof useDynamicTokens>['data'][0]

  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  const mediaType = extractMediaType(dynamicToken?.token)
  const showPreview =
    mediaType === 'other' || mediaType === 'html' || mediaType === null
  const { routePrefix, proxyApi } = useMarketplaceChain()

  const collectionImage = useMemo(() => {
    return optimizeImage(token?.token?.collection?.imageUrl, 500)
  }, [token?.token?.collection?.imageUrl])

  const isOracleOrder =
    token?.ownership?.floorAsk?.rawData?.isNativeOffChainCancellable

  const contract = token.token?.collection?.id
    ? token.token?.collection.id?.split(':')[0]
    : undefined

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

  const isSelectedItem = useMemo(() => {
    return selectedItems.some(
      (selectedItem) =>
        selectedItem?.token?.tokenId === token?.token?.tokenId &&
        selectedItem?.token?.contract === token?.token?.contract
    )
  }, [selectedItems])

  // transfer modal
  const [transferModal, setTransferModal] = useState<any>(false)
  const [transferModalToken, setTransferModalToken] =
    useState<ReturnType<typeof useTokens>['data'][0]>()
  const [transferTarget, setTransferTarget] = useState('')
  const chain = useMarketplaceChain()
  const router = useRouter()
  // console.log(chain)
  const [transferStep, setTransferStep] = useState<any>('')
  const [transferProcessingModal, setTransferProcessingModal] =
    useState<any>(false)
  const [transferQuantity, setTransferQuantity] = useState(1)

  const handleTransferConfirm = async (
    token: ReturnType<typeof useTokens>['data'][0],
    target: string,
    quantity: number,
    ownership: any
  ) => {
    // console.log(+ownership, +quantity)
    if (+ownership < +quantity) {
      alert('You do not own enough of this token to transfer this quantity.')
      return
    }

    setTransferModal(false)
    setTransferProcessingModal(true)
    const address = router.query.address[0] as string

    try {
      // Check if window.ethereum exists before proceeding
      if (!window.ethereum) {
        alert('No wallet detected. Please install a wallet like MetaMask.')
        return
      }

      // Now TypeScript knows window.ethereum exists
      const wallet = createWalletClient({
        account: address as `0x${string}`,
        chain:
          chain.id === 1
            ? mainnet
            : chain.id === 5
            ? goerli
            : chain.id === 7777777
            ? zora
            : undefined,
        transport: custom(window.ethereum),
      })

      await wallet.switchChain(
        chain.id === 1 ? mainnet : chain.id === 5 ? goerli : zora
      )
      getClient().actions.transferTokens({
        to: target as `0x${string}`,
        items: [
          {
            token: (token?.token?.contract +
              ':' +
              token?.token?.tokenId) as string,
            quantity: quantity,
          },
        ],
        wallet: wallet,
        onProgress: (steps) => {
          console.log(steps)
          setTransferStep(steps as Array<object>)
        },
      })
      // console.log(address)
      // console.log(token)
      // console.log(target)
    } catch (error) {
      console.error('Failed to create wallet client:', error)
      alert('Failed to connect to wallet. Please try again.')
      setTransferProcessingModal(false)
    }
  }

  return (
    <Box
      css={{
        borderRadius: 8,
        overflow: 'hidden',
        background: '$neutralBgSubtle',
        $$shadowColor: '$colors$panelShadow',
        boxShadow: '0 8px 12px 0px $$shadowColor',
        position: 'relative',
        '&:hover > a > div > img': {
          transform: 'scale(1.1)',
        },
        '@sm': {
          '&:hover .token-button-container': {
            bottom: 0,
          },
        },
      }}
    >
      {tokenCount && (
        <Flex
          justify="center"
          align="center"
          css={{
            borderRadius: 8,
            px: '$2',
            py: '$1',
            mr: '$2',
            position: 'absolute',
            left: '$2',
            top: '$2',
            zIndex: 1,
            maxWidth: '50%',
            backgroundColor: 'rgba(	38, 41, 43, 0.3)',
          }}
        >
          <Text
            css={{
              color: '$whiteA12',
            }}
            ellipsify
          >
            x{formatNumber(tokenCount, 0, true)}
          </Text>
        </Flex>
      )}
      {/* {isOwner && !isSmallDevice ? (
        <Button
          css={{
            borderRadius: '99999px',
            width: 48,
            height: 48,
            backgroundColor: isSelectedItem ? '$primary9' : '#15171833',
            '&:hover': {
              backgroundColor: isSelectedItem ? '$primary9' : '#15171859',
            },
            opacity: isSelectedItem ? 1 : 1,
            position: 'absolute',
            right: '$2',
            zIndex: 1,
            top: '$2',
            color: 'white',
            p: 0,
            justifyContent: 'center',
          }}
          onClick={(e) => {
            e.preventDefault()

            if (!isSelectedItem) {
              addSelectedItem(token)
            } else {
              removeSelectedItem(token)
            }
          }}
        >
          <FontAwesomeIcon
            icon={isSelectedItem ? faCheck : faPlus}
            width={20}
            height={20}
          />
        </Button>
      ) : null} */}
      <Link
        passHref
        href={`/${routePrefix}/asset/${token?.token?.contract}:${token?.token?.tokenId}`}
      >
        <Box css={{ background: '$gray3', overflow: 'hidden' }}>
          <TokenMedia
            token={dynamicToken?.token}
            style={{
              width: '100%',
              transition: 'transform .3s ease-in-out',
              maxHeight: 720,
              height: '100%',
              borderRadius: 0,
              aspectRatio: '1/1',
            }}
            staticOnly={showPreview}
            audioOptions={{
              onPlay: (e) => {
                onMediaPlayed?.(e)
              },
            }}
            videoOptions={{
              onPlay: (e) => {
                onMediaPlayed?.(e)
              },
            }}
            onRefreshToken={() => {
              mutate?.()
              addToast?.({
                title: 'Refresh token',
                description: 'Request to refresh this token was accepted.',
              })
            }}
          />
        </Box>
      </Link>
      <Link
        href={`/${routePrefix}/asset/${token?.token?.contract}:${token?.token?.tokenId}`}
      >
        <Flex
          css={{ p: '$4', minHeight: 132, cursor: 'pointer' }}
          direction="column"
        >
          <Flex css={{ mb: '$4' }} align="center" justify="between">
            <Flex align="center" css={{ gap: '$2', minWidth: 0 }}>
              {collectionImage ? (
                <Image
                  style={{
                    borderRadius: '4px',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                  }}
                  loader={({ src }) => src}
                  src={collectionImage}
                  alt={`${token?.token?.name}`}
                  width={24}
                  height={24}
                />
              ) : null}
              <Text
                style="subtitle1"
                as="p"
                ellipsify
                css={{
                  pr: '$1',
                  flex: 1,
                }}
              >
                {token?.token?.name || '#' + token?.token?.tokenId}{' '}
              </Text>
            </Flex>
            {rarityEnabled &&
            token?.token?.kind !== 'erc1155' &&
            token?.token?.rarityRank ? (
              <Box
                css={{
                  px: '$1',
                  py: 2,
                  background: '$gray5',
                  borderRadius: 8,
                  minWidth: 'max-content',
                }}
              >
                <Flex align="center" css={{ gap: 5 }}>
                  <img
                    style={{ width: 13, height: 13 }}
                    src="/icons/rarity-icon.svg"
                  />
                  <Text style="subtitle3" as="p">
                    {formatNumber(token?.token?.rarityRank)}
                  </Text>
                </Flex>
              </Box>
            ) : null}
          </Flex>

          <Flex align="center" css={{ gap: '$2' }}>
            <Box
              css={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {token?.ownership?.floorAsk?.price && (
                <FormatCryptoCurrency
                  logoHeight={18}
                  amount={token?.ownership?.floorAsk?.price?.amount?.decimal}
                  address={
                    token?.ownership?.floorAsk?.price?.currency?.contract
                  }
                  textStyle="h6"
                  css={{
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    with: '100%',
                    overflow: 'hidden',
                  }}
                  maximumFractionDigits={4}
                />
              )}
            </Box>

            <>
              {token?.ownership?.floorAsk?.source?.name && (
                <img
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                  }}
                  src={`${proxyApi}/redirect/sources/${token?.ownership?.floorAsk?.source?.domain}/logo/v2`}
                />
              )}
            </>
          </Flex>
          {token?.token?.lastSale?.price?.amount?.decimal ? (
            <Flex css={{ gap: '$2', marginTop: 'auto' }}>
              <Text css={{ color: '$gray11' }} style="subtitle3">
                Last Sale
              </Text>
              <FormatCryptoCurrency
                logoHeight={12}
                amount={token.token.lastSale.price.amount?.decimal}
                address={token.token.lastSale.price.currency?.contract}
                decimals={token.token.lastSale.price.currency?.decimals}
                textStyle="subtitle3"
                maximumFractionDigits={4}
              />
            </Flex>
          ) : null}
        </Flex>
      </Link>
      {!isOwner && token?.ownership?.floorAsk?.price?.amount ? (
        <Flex
          className="token-button-container"
          css={{
            width: '100%',
            transition: 'bottom 0.25s ease-in-out',
            position: 'absolute',
            bottom: -44,
            left: 0,
            right: 0,
            gap: 1,
          }}
        >
          <BuyNow
            tokenId={token.token?.tokenId}
            collectionId={token.token?.collection?.id}
            mutate={mutate}
            buttonCss={{
              justifyContent: 'center',
              flex: 1,
            }}
            buttonProps={{
              corners: 'square',
            }}
            buttonChildren="Buy Now"
          />
        </Flex>
      ) : null}
      {isOwner ? (
        <Flex
          className="token-button-container"
          justify="between"
          css={{
            width: '100%',
            transition: 'bottom 0.25s ease-in-out',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            gap: 1,
          }}
        >
          <div className="flex gap-1">
            {/* <List
            token={token as ReturnType<typeof useTokens>['data'][0]}
            buttonCss={{
              justifyContent: 'center',
              flex: 1,
            }}
            buttonProps={{
              corners: 'square',
            }}
            buttonChildren="List"
            mutate={mutate}
          /> */}

            {/* list button + Modal */}
            <div
              className={
                'px-5 py-1 font-bold text-sm rounded-lg flex items-center cursor-pointer duration-300' +
                (theme == 'dark'
                  ? ' text-white hover:bg-neutral-700'
                  : ' text-black hover:bg-neutral-300')
              }
              onClick={() => setOpenHeart(true)}
            >
              List
            </div>

            <Modal
              open={openHeart}
              onClose={() => {
                setOpenHeart(false)
                setHeartValue(0)
              }}
              center
              closeOnEsc
              showCloseIcon={false}
              classNames={{
                modal: 'rounded-md',
              }}
            >
              <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 gap-4 bg-zinc-900 border-[1px] border-neutral-700 text-neutral-100 text-sm md:text-md text-center ">
                <div className="flex flex-col gap-3 ">
                  <div className=" text-lg font-bold">
                    Would you like to set a percentage of your sale to be
                    donated to{' '}
                    <span className="font-bold">The Sphere Common Pool</span>{' '}
                    multisig, so we can continue funding live art?
                  </div>
                  <div className="mt-3 text-sm">
                    If <span className="font-bold">YES</span>, select the
                    percentage using the slider, then click{' '}
                    <span className="font-bold">"Next"</span>.{' '}
                    <p>
                      The donation will be deducted from the total price you
                      set.
                    </p>
                  </div>
                  <div className="text-sm">
                    If <span className="font-bold">NOT</span>, that's ok - you
                    can click <span className="font-bold">"Next"</span> and
                    proceed to your listing.
                  </div>
                </div>
                <form className="mt-4 flex flex-col gap-6 w-full items-center">
                  <div className="text-center gap-8 bg-neutral-800 rounded-lg p-6 pt-10 px-10 w-fit shadow-xl shadow-black/100">
                    <input
                      type="range"
                      name="percentage"
                      id="percentage"
                      placeholder="0"
                      defaultValue="0"
                      max={
                        token?.token?.chainId == 1 || token?.token?.chainId == 5
                          ? 100 ////////////////////
                          : 80
                      }
                      className="w-[200px] md:w-[300px] mb-6"
                      onChange={(e) => {
                        // console.log(+e.target.value)
                        setHeartValue(+e.target.value)
                      }}
                    />
                    <div className="text-center pb-5 text-neutral-300 flex justify-center">
                      Your donation:{' '}
                      <div className="ml-4 font-bold min-w-[3rem]">
                        {heartValue}%
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faHeart}
                      color="#00ff00"
                      className="duration-300 ease-in-out"
                      size={
                        (((heartValue !== 100 ? heartValue : 99) +
                          10 -
                          ((heartValue !== 100 ? heartValue : 99) % 10)) /
                          10 +
                          'x') as SizeProp ////////////////
                      }
                    />
                  </div>
                  <div className="flex gap-4 w-full justify-between mt-4">
                    <button
                      className="py-2 px-5 rounded-lg bg-[#2c2c59] text-md font-bold"
                      onClick={() => {
                        setOpenHeart(false)
                      }}
                    >
                      Cancel
                    </button>

                    {/* regular List button: */}
                    <List
                      orderFees={orderFees}
                      // setOpenHeart={setOpenHeart}
                      token={token as ReturnType<typeof useTokens>['data'][0]}
                      buttonCss={{
                        px: isSmallDevice ? '40px' : '100px',
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

            <>
              {/* transfer MEDIUM/desktop */}
              <div
                className={
                  'px-5 py-1 text-sm font-bold rounded-lg flex items-center cursor-pointer duration-300' +
                  (useTheme().theme == 'dark'
                    ? ' text-white hover:bg-neutral-700'
                    : ' text-black hover:bg-neutral-300')
                }
                onClick={() => {
                  setTransferModal(token)
                  // setTransferModalToken(token)
                }}
              >
                Transfer
              </div>

              <Modal
                open={transferModal}
                onClose={() => setTransferModal(false)}
                classNames={
                  {
                    // modal: 'customModal',
                    // modalContainer: 'customModal',
                  }
                }
                center
                showCloseIcon={false}
              >
                <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 gap-4 bg-zinc-900 border-[1px] border-neutral-700 text-neutral-100 text-sm md:text-md text-center">
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="font-semibold text-base md:text-lg">
                      Transfer your token to another wallet address.
                    </div>
                    <div className="mt-3">
                      You can transfer to any address on the same chain as the
                      token.
                    </div>
                  </div>
                  <form className="mt-4 flex flex-col gap-6 w-full items-center">
                    <div className="text-center gap-8 bg-neutral-800 rounded-lg pb-6 pt-6 md:pt-10 px-2 md:px-10 text-xs md:text-md w-full shadow-xl shadow-black">
                      <label
                        className="text-neutral-300 text-sm md:text-md"
                        htmlFor="newAddress"
                      >
                        Receiver address:
                      </label>
                      <input
                        type="text"
                        name="newAddress"
                        id="newAddress"
                        required
                        placeholder="0x..."
                        className="w-full mb-6 outline-none px-0 md:px-2 py-1 rounded-md text-xs md:text-md text-center"
                        onChange={(e) => setTransferTarget(e.target.value)}
                      />
                      <div className="text-center pb-1 md:pb-2 text-neutral-300 flex flex-col justify-center">
                        Confirm receiver:{' '}
                        <div className="font-bold min-w-[3rem]">
                          {transferTarget || '0x...'}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-center">
                        <label
                          className=" text-neutral-300 text-sm md:text-md"
                          htmlFor="transferQuantity"
                        >
                          Quantity:
                        </label>
                        <input
                          type="number"
                          name="transferQuantity"
                          id="transferQuantity"
                          placeholder="1"
                          required
                          step={1}
                          className="w-12 outline-none px-0 py-1 rounded-md text-center"
                          onChange={(e) => setTransferQuantity(+e.target.value)}
                        />
                      </div>
                      {/* <div className="text-xs text-green-400 w-full flex flex-col items-center">
                      {transferStep &&
                        transferStep?.map(
                          (step: any, i: number, steps: any) => (
                            <div className="w-[80%] mb-2">
                              Your transfer is being executed. You must
                              approve the transaction in your wallet.
                            </div>
                          )
                        )}
                    </div> */}
                    </div>
                    <div className="flex gap-4 w-full justify-between mt-2">
                      <div className="flex gap-4 w-full justify-between mt-4">
                        <button
                          type="submit"
                          className="py-2 px-5 rounded-lg bg-[#2c2c59] text-sm md:text-md"
                          onClick={(e) => {
                            e.preventDefault()
                            // console.log(token)
                            setTransferModal(false)
                          }}
                        >
                          Cancel
                        </button>
                        <div
                          className="text-[#00ff00] py-2 px-5 rounded-lg bg-[#2c2c59] cursor-pointer text-sm md:text-md"
                          onClick={() =>
                            handleTransferConfirm(
                              token as ReturnType<typeof useTokens>['data'][0],
                              transferTarget,
                              transferQuantity,
                              token?.ownership?.tokenCount
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faShareSquare}
                            color="#00ff00"
                            className="mr-2 duration-300 ease-in-out "
                          />
                          Confirm
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Modal>

              {/* transferProcessingModal: */}
              <Modal
                open={transferProcessingModal}
                onClose={() => setTransferProcessingModal(false)}
                classNames={
                  {
                    // modal: 'customModal',
                    // modalContainer: 'customModal',
                  }
                }
                center // transfer modal
              >
                <div className="flex flex-col items-center justify-center px-6 pt-16 pb-6 gap-8 bg-slate-600 ">
                  <div className="flex flex-col gap-8 items-center">
                    <div className="">
                      Please follow the steps in your wallet to complete the
                      transfer.
                    </div>
                    <div
                      className="text-[#00ff00] py-2 px-5 rounded-lg bg-[#2c2c59] cursor-pointer w-fit"
                      onClick={() => setTransferProcessingModal(false)}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        color="#00ff00"
                        className="mr-2 duration-300 ease-in-out "
                      />
                      Done
                    </div>
                  </div>
                </div>
              </Modal>
            </>
            {/* )} */}
          </div>

          <Dropdown
            modal={false}
            trigger={
              <Button
                corners="square"
                size="xs"
                css={{ width: 44, justifyContent: 'center' }}
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </Button>
            }
            contentProps={{
              asChild: true,
              forceMount: true,
              align: 'start',
              alignOffset: -18,
            }}
          >
            {token?.token?.topBid?.price?.amount?.decimal && isOwner && (
              <AcceptBid
                tokenId={token.token.tokenId}
                collectionId={token?.token?.contract}
                mutate={mutate}
                buttonCss={{
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
                buttonChildren={
                  <>
                    <Box css={{ color: '$gray10' }}>
                      <FontAwesomeIcon icon={faHand} />
                    </Box>
                    <Text>Accept Best Offer</Text>
                  </>
                }
              />
            )}
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
                <Text>Refresh Token</Text>
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
                            Canceling this order requires gas.
                          </Text>
                        }
                      >
                        <Flex align="center" css={{ gap: '$2' }}>
                          <Box css={{ color: '$gray10' }}>
                            <FontAwesomeIcon icon={faGasPump} />
                          </Box>
                          <Text color="error">Cancel Listing</Text>
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
      ) : null}
    </Box>
  )
}
