import CryptoCurrencyIcon from 'components/primitives/CryptoCurrencyIcon'
import {
  Box,
  Button,
  Flex,
  FormatCrypto,
  FormatCurrency,
  Text,
} from 'components/primitives'
import { mainnet, polygon, optimism, zora, goerli } from 'wagmi/chains'
import { useAccount, useContractReads, erc20ABI, useBalance } from 'wagmi'
import { useMemo, useState, useContext, useEffect } from 'react'
import { zeroAddress, formatUnits } from 'viem'
import { useCoinConversion } from '@reservoir0x/reservoir-kit-ui'
import { ChainContext } from 'context/ChainContextProvider'

//CONFIGURABLE: Here you may configure currencies that you want to display in the wallet menu. Native currencies,
//like ETH/MATIC etc need to be fetched in a different way. Configure them below
const allCurrencies = [
  {
    address: zeroAddress,
    symbol: 'ETH',
    decimals: mainnet.nativeCurrency.decimals,
    chain: {
      id: mainnet.id,
      name: mainnet.name,
    },
    coinGeckoId: 'ethereum',
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: mainnet.nativeCurrency.decimals,
    chain: {
      id: mainnet.id,
      name: mainnet.name,
    },
    coinGeckoId: 'weth',
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    decimals: mainnet.nativeCurrency.decimals,
    chain: {
      id: mainnet.id,
      name: mainnet.name,
    },
    coinGeckoId: 'usd-coin',
  },
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    decimals: mainnet.nativeCurrency.decimals,
    chain: {
      id: mainnet.id,
      name: mainnet.name,
    },
    coinGeckoId: 'tether',
  },
  {
    address: zeroAddress,
    symbol: 'ETH',
    decimals: zora.nativeCurrency.decimals,
    chain: {
      id: zora.id,
      name: zora.name,
    },
    coinGeckoId: 'ethereum',
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: zora.nativeCurrency.decimals,
    chain: {
      id: zora.id,
      name: zora.name,
    },
    coinGeckoId: 'weth',
  },
  {
    address: zeroAddress,
    symbol: 'ETH',
    decimals: goerli.nativeCurrency.decimals,
    chain: {
      id: goerli.id,
      name: goerli.name,
    },
    coinGeckoId: 'ethereum',
  },
  {
    address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    symbol: 'WETH',
    decimals: goerli.nativeCurrency.decimals,
    chain: {
      id: goerli.id,
      name: goerli.name,
    },
    coinGeckoId: 'weth',
  },
  // {
  //   address: zeroAddress,
  //   symbol: 'MATIC',
  //   decimals: polygon.nativeCurrency.decimals,
  //   chain: {
  //     id: polygon.id,
  //     name: polygon.name,
  //   },
  //   coinGeckoId: 'matic-network',
  // },
  // {
  //   address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  //   symbol: 'WETH',
  //   decimals: polygon.nativeCurrency.decimals,
  //   chain: {
  //     id: polygon.id,
  //     name: polygon.name,
  //   },
  //   coinGeckoId: 'weth',
  // },
  // {
  //   address: '0x4200000000000000000000000000000000000006',
  //   symbol: 'WETH',
  //   decimals: optimism.nativeCurrency.decimals,
  //   chain: {
  //     id: optimism.id,
  //     name: optimism.name,
  //   },
  //   coinGeckoId: 'weth',
  // },
]

type EnhancedCurrency = (typeof allCurrencies)[0] & {
  usdPrice: number
  balance: string | number | bigint
}

type Currency = {
  address: string
  symbol: string
  decimals: number
  chain: {
    id: number
    name: string
  }
  coinGeckoId: string
}

// const nonNativeCurrencies = currencies.filter(
//   (currency) => currency.address !== zeroAddress
// )

// const currencySymbols = currencies.map((currency) => currency.symbol).join(',')
// const currencyCoingeckoIds = currencies
//   .map((currency) => currency.coinGeckoId)
//   .join(',')

const Wallet = () => {
  const { chain } = useContext(ChainContext)
  const [viewAll, setViewAll] = useState(false)
  const { address } = useAccount()
  const [currencies, setCurrencies] = useState<any[]>([])
  const [nonNativeCurrencies, setNonNativeCurrencies] = useState<Currency[]>([])
  const [currencySymbols, setCurrencySymbols] = useState<string>('')
  const [currencyCoingeckoIds, setCurrencyCoingeckoIds] = useState<string>('')

  // let nonNativeCurrencies: Currency[]
  // let currencySymbols: any
  // let currencyCoingeckoIds: any

  useEffect(() => {
    let allCurrs: Currency[] = allCurrencies
    let currs: Currency[]
    if (chain.id === 1) {
      currs = allCurrs.filter(
        (currency: Currency) => currency.chain.id === mainnet.id
      )
    } else if (chain.id === 7777777) {
      currs = allCurrs.filter(
        (currency: Currency) => currency.chain.id === zora.id
      )
    } else {
      currs = allCurrs.filter(
        (currency: Currency) => currency.chain.id === goerli.id
      )
    }
    setCurrencies(currs)
    const nonNativeCurrs = currs.filter(
      (currency: Currency) => currency.address !== zeroAddress
    )
    setNonNativeCurrencies(nonNativeCurrs)

    const currencySymbs = currs
      .map((currency: Currency) => currency.symbol)
      .join(',')
    setCurrencySymbols(currencySymbs)

    const currencyCoingeckoIdss = currs
      .map((currency: Currency) => currency.coinGeckoId)
      .join(',')
    setCurrencyCoingeckoIds(currencyCoingeckoIdss)
  }, [chain.name])

  const { data: nonNativeBalances } = useContractReads({
    contracts: nonNativeCurrencies.map((currency) => ({
      abi: erc20ABI,
      address: currency.address as `0x${string}`,
      chainId: currency.chain.id,
      functionName: 'balanceOf',
      args: [address as string],
    })),
    watch: true,
    enabled: address ? true : false,
    allowFailure: false,
  })

  //CONFIGURABLE: Configure these by just changing the chainId to fetch native balance info, in addition to changing this
  // also make sure you change the enhancedCurrencies function to take into account for these new balances
  const ethBalance = useBalance({
    address,
    chainId: mainnet.id,
  })
  const zoraBalance = useBalance({
    address,
    chainId: zora.id,
  })
  // const maticBalance = useBalance({
  //   address,
  //   chainId: polygon.id,
  // })

  const usdConversions = useCoinConversion(
    'USD',
    currencySymbols,
    currencyCoingeckoIds
  )

  const enhancedCurrencies = useMemo(() => {
    const currencyToUsdConversions = usdConversions.reduce((map, data) => {
      map[data.symbol] = data
      map[(data as any).coinGeckoId] = data
      return map
    }, {} as Record<string, (typeof usdConversions)[0]>)

    return currencies.map((currency, i) => {
      let balance: string | number | bigint = 0n
      if (currency.address === zeroAddress) {
        //CONFIGURABLE: Configure these to show the fetched balance results configured above in the useBalance hooks
        switch (currency.chain.id) {
          // case polygon.id: {
          //   balance = maticBalance.data?.value || 0n
          //   break
          // }
          case mainnet.id: {
            balance = ethBalance.data?.value || 0n
            break
          }
          case zora.id: {
            balance = zoraBalance.data?.value || 0n
            break
          }
        }
      } else {
        const index = nonNativeCurrencies.findIndex(
          (nonNativeCurrency) =>
            nonNativeCurrency.chain.id === currency.chain.id &&
            nonNativeCurrency.symbol === currency.symbol &&
            nonNativeCurrency.coinGeckoId === currency.coinGeckoId
        )
        balance =
          nonNativeBalances &&
          nonNativeBalances[index] &&
          (typeof nonNativeBalances[index] === 'string' ||
            typeof nonNativeBalances[index] === 'number' ||
            typeof nonNativeBalances[index] === 'bigint')
            ? (nonNativeBalances[index] as string | number | bigint)
            : 0n
      }

      const conversion =
        currencyToUsdConversions[
          currency.coinGeckoId.length > 0
            ? currency.coinGeckoId
            : currency.symbol.toLowerCase()
        ]
      const usdPrice =
        Number(formatUnits(BigInt(balance), currency?.decimals || 18)) *
        (conversion?.price || 0)
      return {
        ...currency,
        usdPrice,
        balance,
      }
    }) as EnhancedCurrency[]
    //CONFIGURABLE: Configure these to regenerate whenever a native balance changes, non native balances are already handled
  }, [usdConversions, nonNativeBalances, ethBalance, zoraBalance])

  const totalUsdBalance = useMemo(() => {
    return enhancedCurrencies.reduce(
      (total, { usdPrice }) => total + usdPrice,
      0
    )
  }, [enhancedCurrencies])

  const visibleCurrencies = viewAll
    ? enhancedCurrencies
    : enhancedCurrencies.slice(0, 3)

  return (
    <Flex
      direction="column"
      align="center"
      css={{
        background: '$gray2',
        border: '1px solid $gray3',
        borderRadius: 8,
        mt: '$3',
      }}
    >
      <Box css={{ width: '100%', height: 1, background: '$gray1' }}></Box>
      <Flex direction="column" align="center" css={{ p: '$4', width: '100%' }}>
        <Text style="body2" color="subtle" css={{ mb: '$2', mt: '$2' }}>
          Total Balance
        </Text>
        <FormatCurrency
          style="h4"
          amount={totalUsdBalance}
          css={{ mb: '$4' }}
        />
        <Button
          css={{ width: '100%', justifyContent: 'center' }}
          onClick={() => {
            window.open('https://app.uniswap.org/', '_blank')
          }}
        >
          Add Funds
        </Button>
        {visibleCurrencies.map((currency, i) => {
          return (
            <Flex
              key={i}
              css={{ width: '100%', mt: 28, gap: '$3' }}
              align="center"
            >
              <Flex
                css={{
                  width: 40,
                  height: 40,
                  background: '$gray3',
                  borderRadius: 4,
                  flexShrink: 0,
                }}
                align="center"
                justify="center"
              >
                <CryptoCurrencyIcon
                  address={currency.address}
                  chainId={currency.chain.id}
                  css={{ height: 24 }}
                />
              </Flex>
              <Flex direction="column" justify="center" css={{ width: '100%' }}>
                <Flex justify="between">
                  <Text style="body1">{currency.symbol}</Text>
                  <FormatCrypto
                    amount={currency.balance}
                    decimals={currency.decimals}
                    textStyle="body1"
                  />
                </Flex>
                <Flex justify="between">
                  <Text style="body2" color="subtle">
                    {currency.chain.name}
                  </Text>
                  <Text style="body2" color="subtle"></Text>
                  <FormatCurrency amount={currency.usdPrice} />
                </Flex>
              </Flex>
            </Flex>
          )
        })}
        <Button
          css={{
            width: '100%',
            justifyContent: 'center',
            mt: 24,
            mb: '$3',
          }}
          color="gray3"
          onClick={() => {
            setViewAll(!viewAll)
          }}
        >
          View {viewAll ? 'Fewer' : 'All'} Tokens
        </Button>
      </Flex>
    </Flex>
  )
}

export default Wallet
