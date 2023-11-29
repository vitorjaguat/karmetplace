import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { Head } from 'components/Head'
import { useMediaQuery } from 'react-responsive'

const AboutPage: NextPage = () => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  return (
    <Layout>
      <Head />
      <Flex
        direction="column"
        align="center"
        justify="center"
        css={{
          py: '$3',
          px: '$3',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          width: '100%',
          // maxWidth: '1000px',
        }}
      >
        <div className="max-w-[1000px] flex flex-col items-center">
          <div className="w-full flex flex-col md:flex-row md:justify-between items-center gap-4 md:gap-20 mt-3">
            <Box css={{ color: '$gray11', my: '60px' }}>
              {/* <FontAwesomeIcon icon={faFolderOpen} size="2xl" /> */}
              {/* <div id="logoAnimation" className="mr-7 scale-[1.3]">
                <div className="logo-animation"></div>
              </div> */}
              <div className="">
                <img
                  src="/assets/karmetplace_logo.png"
                  width={isSmallDevice ? 400 : 500}
                  // height={36}
                  alt="The Sphere Karmetplace"
                />
              </div>
            </Box>
            <div className="text-center md:text-right">
              <div className="text-2xl">
                The Sphere Karmetplace: A Platform for Live Art and
                Choreographed Value Distribution
              </div>
            </div>
          </div>
          <div className="text-lg mt-8 max-w-[800px]">
            <div className="">
              Launched in December 2023, The Sphere Karmetplace emerges as a
              unique platform, fostering the connection between live art, its
              creators, and the audiences that support them.
            </div>
            <div className="">
              Developed by Vitor Butkus (Uint Studio) and powered by the
              Reservoir Protocol, this marketplace is dedicated to the
              circulation of live art seeds and derivatives within a
              collaborative spirit of art creation.
            </div>
          </div>
          <div className="py-6 mt-20 mb-10 text-left flex flex-col md:grid md:grid-cols-3 gap-8">
            <div className="">
              <div className="font-bold text-2xl mb-3">Onchain Royalties</div>
              <div className="">
                The Karmetplace ensures that artists continue to receive
                royalties from secondary sales, thanks to its onchain
                enforcement mechanism. This approach guarantees ongoing support
                for creators even after their initial distribution or sale.
                Listings made on other marketplaces also appear here.{' '}
              </div>
            </div>
            <div className="">
              <div className="font-bold text-2xl mb-3">Artistic Support</div>
              <div className="">
                The Sphere Karmetplace encourages sellers to direct a part of
                their sale proceeds to The Sphere Commons Treasury. This
                collective fund plays a crucial role in sustaining the
                platform's ecosystem. Once the treasury reaches a milestone of
                10,000€ equivalent in cryptocurrencies and/or stablecoins, it
                triggers a new call for artistic submissions, initiating another
                cycle of creative projects and audience participation.
              </div>
            </div>
            <div className="mb-20">
              <div className="font-bold text-2xl mb-3">
                Showcasing Diverse Art Collections
              </div>
              <div className="">
                At its launch, the Karmetplace features the Karmic Objects and
                The Anarchiving Game collections, setting the stage for a
                diverse range of artistic endeavors within The Sphere's
                ecosystem. These collections represent the initial foray into
                fostering a vibrant network of live art, characterized by
                collaborative interactions among artists, audiences, collectors,
                and curators.
              </div>
            </div>
          </div>
        </div>
      </Flex>
    </Layout>
  )
}

export default AboutPage
