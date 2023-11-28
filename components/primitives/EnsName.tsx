import { useEnsName } from 'wagmi'
import { useMounted } from 'hooks'
import { useMediaQuery } from 'react-responsive'

interface EnsNameProps {
  address: `0x${string}`
}

const EnsName: React.FC<EnsNameProps> = ({ address }) => {
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 }) && isMounted
  const { data } = useEnsName({ address, chainId: 1 })

  if (!isSmallDevice) return <>{data ? data : address}</>
  if (isSmallDevice)
    return (
      <>
        {data
          ? data
          : address.slice(0, 6) + '...' + address.slice(-6, address.length - 1)}
      </>
    )
  return null
}

export default EnsName
