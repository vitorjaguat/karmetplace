import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { Head } from 'components/Head'
import Faq from 'react-faq-component'
import { useMediaQuery } from 'react-responsive'
import { title } from 'process'

const styles = {
  bgColor: 'transparent',
  titleTextColor: '#b1b1b1',
  rowTitleColor: 'white',
  titleTextSize: '2rem',
  rowTitleTextSize: '1.5rem',
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
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const data = {
    title: 'FAQ',
    rows: [
      {
        title: 'What is The Sphere Karmetplace?',
        content:
          'The Sphere Karmetplace is a 0%-fee digital platform for buying, selling, and appreciating live art seeds and derivatives minted as non-fungible tokens, leveraging blockchain technology to support artists and engage communities into a novel funding mechanism.',
      },
      {
        title: 'What is a non-fungible token (NFT)?',
        content:
          'A non-fungible token (NFT) is a type of a digital deed that is inscribed on a public internet registry. Simply put, it can be understood as a container for metadata and media content, thus being a means of artistic and financial expression that allows for the self-issuance of scarce digital objects.',
      },
      {
        title: 'How can I collect the works minted as non-fungible tokens?',
        content:
          "To collect the works, you will need a non-custodial wallet that has a balance corresponding to the price of the works in Ether, the native cryptocurrency of the Ethereum blockchain. If you don't have Ether, you can buy it on an centralized exchange like <a class='underline text-neutral-300' href='https://coinbase.com' target='_blank' rel='noopener noreferrer'>https://coinbase.com</a>, <a class='underline text-neutral-300' href='https://bitstamp.com' target='_blank' rel='noopener noreferrer'>https://bitstamp.com</a> or in a decentralized exchange like <a class='underline text-neutral-300' href='https://app.uniswap.org' target='_blank' rel='noopener noreferrer'>https://app.uniswap.org</a>.",
      },
      {
        title:
          'How can I install a non-custodial wallet? Do I need to pay for one?',
        content:
          "You can install Metamask through the website <a class='underline text-neutral-300' href='https://metamask.io' target='_blank' rel='noopener noreferrer'>https://metamask.io</a>, for free.",
      },
      {
        title: 'What is a non-custodial wallet? Is it safe?',
        content:
          "A non-custodial wallet is a digital cryptocurrency wallet that is installed in your internet browser as an extension (add-on), in which the custody of the assets is not centralized by any third party entity (like a bank, for instance), but by the person who owns the wallet itself. It is recommended to use Metamask, the most widely used wallet. When installing Metamask in your browser, you will be asked to securely note down a secret recovery phrase (seed phrase) of 12 words that gives you access to the wallet. <span class='font-bold underline'>It is very important to have a backup of this phrase, preferably physically and never share it with anyone, because with this phrase you (or anyone in possession of it) can access the wallet on any device.</span> As a browser extension, Metamask has proven to be quite secure, requiring a minimum amount of personal information sharing. For more details on its operation, visit <a class='underline text-neutral-300' href='https://metamask.io/faqs/' target='_blank' rel='noopener noreferrer'>https://metamask.io/faqs/</a>.",
      },
      {
        title:
          'Is it necessary to use the MetaMask wallet? Can I use other wallets?',
        content:
          'You can use other wallets that operate on the Ethereum blockchain to connect to the Karmetplace. We offer support Coinbase Wallet, Rainbow, WalletConnect, Rabby, Ledger, and Phantom, besides MetaMask.',
      },
      {
        title: 'Which collections are available on the Karmetplace?',
        content:
          'Initially, the Karmetplace features only one collection: The Sphere Karmic Objects ($KARMIC001).',
      },
      {
        title:
          'Which blockchain and standard are used for the collections in the Karmetplace?',
        content:
          '<span class="font-bold">THE SPHERE KARMIC OBJECTS</span> collection is minted on the Ethereum Mainnet using the ERC-1155 standard.',
      },
      {
        title: 'What are gas fees, and how are they determined?',
        content:
          "Gas fees are payments made by users to compensate for the computing energy required to process and validate transactions on the Ethereum blockchain. They vary based on network demand and transaction complexity. Live estimations can be found at <a class='underline text-neutral-300' href='https://etherscan.io/gastracker' target='_blank' rel='noopener noreferrer'>https://etherscan.io/gastracker</a>.",
      },
      {
        title: 'How does onchain royalty enforcement work?',
        content:
          "<div class='flex flex-col gap-2'><div>Onchain royalties are enforced via smart contract to ensure seed and derivative artists receive a percentage from secondary sales of their artwork, providing ongoing financial support. There’s also a cut that goes to <span class='font-bold'>The Sphere Common Pool</span>.</div><div>Within The Sphere Karmic Objects collection, there’s a 20% fee on every sale.</div><div>If a token is a <span class='font-bold'>Seed</span>, the breakdown of the distribution of secondary royalties is:</div><ul class='list-disc pl-6'><li>Seed Artist: 14%</li><li>The Sphere Common Pool: 6%</li></ul><div>If a token is a <span class='font-bold'>Derivative</span>, the distribution of secondary royalties is:</div><ul class='list-disc pl-6'><li>Seed Artist: 7%</li><li>Derivative Artist: 7%</li><li>The Sphere Common Pool: 6%</li></ul></div>",
      },
      {
        title: 'Can I contribute to The Sphere Common Pool? How?',
        content:
          'Yes. Even though we operate on a 0% fee structure, sellers on the Karmetplace can allocate up to 100% of their sales proceeds to The Sphere Common Pool, supporting the arts community and future projects.',
      },
      {
        title: 'Does The Sphere host special events or exhibitions?',
        content:
          "Yes, we participate in conferences, and host various community events, immersive virtual exhibitions, live presentations, lectures, and encounters. You can connect with us through <a class='underline text-neutral-300' href='https://twitter.com/TheSphere_as' target='_blank' rel='noopener noreferrer'>Twitter</a>, <a class='underline text-neutral-300' href='https://t.me/+o3hn1fgGsQMzZjgx' target='_blank' rel='noopener noreferrer'>Telegram</a>, <a class='underline text-neutral-300' href='https://discord.com/invite/e8K8KPrJ49' target='_blank' rel='noopener noreferrer'>Discord</a>, and <a class='underline text-neutral-300' href='https://thesphere.substack.com/' target='_blank' rel='noopener noreferrer'>Substack</a> to know about our past and upcoming events.",
      },
      {
        title:
          'I have other questions that were not addressed in this manual. What should I do?',
        content:
          "You can reach out on our <a class='underline text-neutral-300' href='https://t.me/+o3hn1fgGsQMzZjgx' target='_blank' rel='noopener noreferrer'>Telegram</a> channel and ask for support there.",
      },
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
        <div className="w-full max-w-[1000px] flex flex-col items-center px-1 md:px-0">
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 md:gap-20 "></div>
          <div className="py-6 mt-10 mb-24 text-left">
            <Faq data={data} styles={styles} config={config} />
          </div>
        </div>
      </Flex>
    </Layout>
  )
}

export default AboutPage
