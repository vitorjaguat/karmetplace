import { Box, Button } from 'components/primitives'
import {
  DropdownMenuItem,
  DropdownMenuContent,
} from 'components/primitives/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { faChevronDown, faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMounted } from 'hooks'
import { useMediaQuery } from 'react-responsive'
import { CSS } from '@stitches/react'

type Options =
  | 'Price low to high'
  | 'Price high to low'
  | 'Rare to common'
  | 'Common to rare'
  | 'Token ID'

const options: { [x: string]: { sortBy: string; sortDirection: string } } = {
  'Token ID': { sortBy: 'tokenId', sortDirection: 'asc' },
  'Price low to high': { sortBy: 'floorAskPrice', sortDirection: 'asc' },
  'Price high to low': { sortBy: 'floorAskPrice', sortDirection: 'desc' },
  'Rare to common': { sortBy: 'rarity', sortDirection: 'asc' },
  'Common to rare': { sortBy: 'rarity', sortDirection: 'desc' },
}

type Props = {
  css?: CSS
}

export const SortTokens: FC<Props> = ({ css }) => {
  const router = useRouter()
  const [sortSelection, setSortSelection] = useState<Options>('Token ID')

  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 }) && isMounted

  useEffect(() => {
    const sortBy = router?.query['sortBy']?.toString()
    const sortDirection = router?.query['sortDirection']?.toString()

    if (sortBy === 'rarity' && sortDirection === 'desc') {
      setSortSelection('Common to rare')
      return
    }
    if (sortBy === 'rarity' && sortDirection === 'asc') {
      setSortSelection('Rare to common')
      return
    }
    if (sortBy === 'floorAskPrice' && sortDirection === 'desc') {
      setSortSelection('Price high to low')
      return
    }
    if (sortBy === 'floorAskPrice' && sortDirection === 'asc') {
      setSortSelection('Price low to high')
      return
    }
    if (sortBy === 'tokenId' && sortDirection === 'asc') {
      setSortSelection('Token ID')
      return
    }
    // setSortSelection('Token ID')
  }, [router.query])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          color="gray3"
          css={{
            ...css,
          }}
        >
          {isSmallDevice ? (
            <FontAwesomeIcon icon={faSort} width={16} height={16} />
          ) : (
            <>
              <span>{sortSelection}</span>
              <Box
                css={{
                  transition: 'transform',
                  '[data-state=open] &': { transform: 'rotate(180deg)' },
                }}
              >
                <FontAwesomeIcon icon={faChevronDown} width={16} />
              </Box>
            </>
          )}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenuContent css={{ width: '220px', mt: '$2', zIndex: 1000 }}>
        {Object.keys(options).map((key) => (
          <DropdownMenuItem
            key={key}
            css={{ py: '$3' }}
            onClick={() => {
              router.push(
                {
                  query: {
                    ...router.query,
                    ['sortBy']: options[key].sortBy,
                    ['sortDirection']: options[key].sortDirection,
                  },
                },
                undefined,
                {
                  shallow: true,
                }
              )
            }}
            aria-label={`Sort by ${key}`}
          >
            {key}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu.Root>
  )
}
