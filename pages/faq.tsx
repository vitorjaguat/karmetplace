import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { Head } from 'components/Head'
import Faq from 'react-faq-component'

const styles = {
  bgColor: 'transparent',
  titleTextColor: '#b1b1b1',
  rowTitleColor: 'white',
  rowContentColor: '#b1b1b1',
  arrowColor: '#b1b1b1',
  // rowContentPaddingLeft: '30px',
  // rowContentPaddingRight: '70px',
  rowContentPaddingBottom: '1.5rem',
  // padding: '50px',
}

const config = {
  // animate: true,
  // arrowIcon: "V",
  // tabFocus: false,
}

const AboutPage: NextPage = () => {
  const data = {
    title: 'FAQ',
    rows: [
      {
        title: 'What is The Sphere Karmetplace?',
        content:
          'The Sphere Karmetplace is a unique 0%-fee digital platform for buying, selling, and appreciating live art seeds and derivatives minted as non-fungible tokens, leveraging blockchain technology to support artists and engage communities into a novel funding mechanism.',
      },
      {
        title: 'What is a non-fungible token (NFT)?',
        content:
          'A non-fungible token (NFT) is a type of a digital deed that is inscribed on a public internet registry. Simply put, it can be understood as a container for metadata and media content, thus being a means of artistic and financial expression that allows for the self-issuance of scarce digital objects.',
      },
      {
        title: 'How can I collect the works minted as non-fungible tokens?',
        content:
          "To collect the works, you will need a non-custodial wallet that has a balance corresponding to the price of the works in Ether, the native cryptocurrency of the Ethereum blockchain. If you don't have Ether, you can buy it on an centralized exchange like https://coinbase.com, https://bitstamp.com or in a decentralized exchange like https://app.uniswap.org",
      },
      {
        title:
          'How can I install a non-custodial wallet? Do I need to pay for one?',
        content:
          'You can install Metamask through the website https://metamask.io, for free.',
      },
      {
        title: 'What is a non-custodial wallet? Is it safe?',
        content:
          'A non-custodial wallet is a digital cryptocurrency wallet that is installed in your internet browser as an extension (add-on), in which the custody of the assets is not centralized by any third party entity (like a bank, for instance), but by the person who owns the wallet itself. It is recommended to use Metamask, the most widely used wallet. When installing Metamask in your browser, you will be asked to securely note down a secret recovery phrase (seed phrase) of 12 words that gives you access to the wallet. It is very important to have a backup of this phrase, preferably physically and never share it with anyone, because with this phrase you (or anyone in possession of it) can access the wallet on any device. As a browser extension, Metamask has proven to be quite secure, requiring a minimum amount of personal information sharing. For more details on its operation, visit https://metamask.io/faqs/.',
      },
      {
        title:
          'Is it necessary to use the MetaMask wallet? Can I use other wallets?',
        content:
          'You can use other wallets that operate on the Ethereum blockchain to connect to the Karmetplace. We offer support to Rainbow, Coinbase Wallet, and Wallet Connect, besides MetaMask, but we recommend you to use MetaMask. It is compatible with many decentralized applications, and also with most internet browsers. It is considered safe because it is frequently updated in rigorous audit processes. If you are interested in discovering other wallets that are compatible with the EVM (Ethereum Virtual Machine), visit https://ethereum.org/en/wallets/find-wallet/.',
      },
      {
        title: 'Which collections are available on the Karmetplace?',
        content:
          'Initially, the Karmetplace features two collections: The Sphere Karmic Objects ($KARMIC001) and The Anarchiving Game ($ANARCHIVE), showcasing a mix of seed-derivative iterations and collective collaboration.',
      },
      {
        title:
          'Which blockchain and standard are used for the collections in the Karmetplace?',
        content:
          'The Sphere Karmic Objects collection is featured on the Ethereum blockchain using the ERC-1155 standard, and The Anarchiving Game is hosted on Zora, also utilizing the ERC-1155 standard. These choices ensure a seamless and flexible experience for artists and collectors, and in the case of The Anarching Game, it enables us to leverage the value proposition of Zora, with their model of revenue share of protocol fees.',
      },
      {
        title:
          'Can I collect NFTs from The Anarchiving Game contract for free?',
        content:
          'Yes. Please go to the corresponding section on https://thesphere.as to find which tokens are available to be collected for free, plus a small gas fee on Zora mainnet.',
      },
      {
        title: 'How can I change the network I’m connected to?',
        content:
          'The user interface might prompt you to a network change if you need to interact with a network that your wallet is not connected to. If you want to manually add other networks, you can go to https://chainlist.org/ and add them to your wallet’s network selector area.',
      },
      {
        title: 'What are gas fees, and how are they determined?',
        content:
          'Gas fees are payments made by users to compensate for the computing energy required to process and validate transactions on the Ethereum blockchain. They vary based on network demand and transaction complexity. On Zora mainnet, these fees are considerably smaller. On Ethereum mainnet the fees can be a bit higher, but the contract we deployed have optimal gas optimization settings. You can check status of gas fees prices on https://etherscan.io/gastracker.',
      },
      {
        title: 'How does onchain royalty enforcement work?',
        content:
          'Onchain royalty enforcement automatically ensures artists receive a percentage from secondary sales of their artwork, providing ongoing financial support. Secondary royalties are distributed to the original creator of the artworks from time to time, to optimize transaction costs.',
      },
      {
        title: 'Can I contribute to The Sphere Commons Treasury? How?',
        content:
          'Yes. Even though we operate on a 0% fee structure, sellers on the Karmetplace can allocate up to 90% of their sales proceeds to The Sphere Commons Treasury, supporting the arts community and future projects.',
      },
      {
        title: 'What triggers a new open call for artistic submissions?',
        content:
          'When The Sphere Commons Treasury accumulates the equivalent of 10,000 euros in cryptocurrencies or stablecoins, a new open call for artistic seed submissions is launched, fostering continuous creative engagement. After a first governance ritual with quadratic voting, a new seed is chosen; then a new open call for artists to create derivative works from this seed is summoned, starting a new Karmic Funding Campaign.',
      },
      {
        title: 'Does the Karmetplace host special events or exhibitions?',
        content:
          'Yes, we host various community events, immersive virtual exhibitions, live presentations, lectures, and encounters. You can connect with us though Twitter, Telegram, Discord, and Substack to know about our past and upcoming events.',
      },
      {
        title:
          'I have other questions that were not addressed in this manual. What should I do?',
        content:
          'You reach out on our Telegram channel and ask for support there.',
      },
      // {
      //   title: t('faq.q13'),
      //   content: t('faq.a13'),
      // },
    ],
  }

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
          <div className="w-full flex justify-between items-center gap-20 ">
            <Box css={{ color: '$gray11', my: '60px' }}>
              {/* <FontAwesomeIcon icon={faFolderOpen} size="2xl" /> */}
              <div id="logoAnimation" className="mr-7 scale-[1.3]">
                <div className="logo-animation"></div>
              </div>
            </Box>
            <div className="text-right">
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
          <div className="py-6 mt-20 mb-20">
            <Faq data={data} styles={styles} config={config} />
          </div>
        </div>
      </Flex>
    </Layout>
  )
}

export default AboutPage
