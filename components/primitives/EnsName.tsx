import { useEnsName } from 'wagmi'

interface EnsNameProps {
  address: `0x${string}`
}

const EnsName: React.FC<EnsNameProps> = ({ address }) => {
  const { data } = useEnsName({ address, chainId: 1 })

  return <>{data ? data : address}</>
}

export default EnsName
