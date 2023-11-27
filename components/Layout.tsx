import { Box } from 'components/primitives'
import { FC, ReactNode } from 'react'
import Navbar from './navbar'
import { Footer } from './home/Footer'
import { useRouter } from 'next/router'

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const router = useRouter()
  return (
    <>
      <Box
        css={{
          background: '$neutralBg',
          height: '100%',
          minHeight: '100vh',
          pt: 80,
        }}
      >
        <Box css={{ maxWidth: 4500, mx: 'auto' }}>
          <Navbar />
          <main>{children}</main>
          {!router.pathname.includes('/portfolio') && <Footer />}
        </Box>
        <div className="site-background">
          <div className="star-container">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>
      </Box>
    </>
  )
}

export default Layout
