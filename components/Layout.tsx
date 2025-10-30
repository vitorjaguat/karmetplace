import { Box } from 'components/primitives'
import { FC, ReactNode } from 'react'
import Navbar from './navbar'
import { Footer } from './home/Footer'
import { useRouter } from 'next/router'
import Header from './home/Header'

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
        className=""
      >
        <Box
          css={{ maxWidth: 4500, mx: 'auto', minHeight: 'calc(100vh - 77px)' }}
          className="flex flex-col justify-between"
        >
          <Navbar />
          {!router.pathname.includes('/portfolio') &&
            !router.pathname.includes('/collection') && <Header />}
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
