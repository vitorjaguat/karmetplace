import { FC } from 'react'
import { Text, Box, Flex, Anchor, Button } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

type SectionTitleProps = {
  title: string
}

const SectionTitle: FC<SectionTitleProps> = ({ title }) => (
  <Text style="subtitle1" css={{ color: '$gray12', mb: 8 }}>
    {title}
  </Text>
)

type SectionLinkProps = {
  name: string
  href: string
}

const SectionLink: FC<SectionLinkProps> = ({ name, href }) => (
  <Anchor
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    weight="medium"
    css={{ fontSize: 14, mt: 16 }}
  >
    {name}
  </Anchor>
)

const developerSectionLinks = [
  {
    name: 'Docs',
    href: 'https://www.thesphere.as/',
  },
  // {
  //   name: 'API Reference',
  //   href: 'https://docs.reservoir.tools/reference/overview',
  // },
  {
    name: 'Github',
    href: 'https://github.com/thesphere',
  },
  // {
  //   name: 'Testnets',
  //   href: 'https://testnets.reservoir.tools',
  // },
]

const companySectionLinks = [
  // {
  //   name: 'Jobs',
  //   href: 'https://jobs.ashbyhq.com/reservoir',
  // },
  {
    name: 'Website',
    href: 'https://www.thesphere.as/',
  },
  {
    name: 'Docs',
    href: 'https://docs.thesphere.as/',
  },
]

export const Footer = () => {
  return (
    <div
      className=" 
    relative z-[1] p-6 md:p-10 flex flex-col w-full items-center md:block text-center md:text-left bg-gray-200/10"
    >
      {/* <div
          id="logoAnimation"
          className="-mt-[30px] scale-[0.5] w-full flex justify-center"
        >
          <div className="logo-animation"></div>
        </div> */}
      <div className="mb-4 md:-ml-[8px]">
        <img
          src="/assets/karmetplace_logo.png"
          alt="The Sphere Karmetplace"
          width={240}
        />
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2 w-full">
        <div className="text-[14px] text-[var(--colors-gray12)] flex flex-col">
          <div className="">Regenerative Commons for Live Arts</div>
          <div className="">v0.2 / 2023-2025</div>
          <div className="">
            Developed by{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://uint.vercel.app"
              className="hover:tracking-wide duration-700"
            >
              Uint Studio
            </a>
          </div>
          {/* <div className="">
            Powered by{' '}
            <a href="https://reservoir.tools/" className="">
              Reservoir
            </a>
          </div> */}
        </div>
        <div className="flex items-end justify-between md:justify-end gap-6">
          <div className="text-left text-[14px] text-[var(--colors-gray12)] flex flex-col justify-end mt-6 md:mt-0">
            {/* <div className=" hidden md:block">.</div> */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://thesphere.as"
            >
              <div className="">Website</div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.thesphere.as/"
            >
              <div className="">Docs</div>
            </a>
          </div>
          <div className="text-[14px] text-[var(--colors-gray12)] flex flex-col justify-end text-right mt-6 md:mt-0">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/TheSphere_as"
            >
              <div className="">Twitter</div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/+o3hn1fgGsQMzZjgx"
            >
              <div className="">Telegram</div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/e8K8KPrJ49"
            >
              <div className="">Discord</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
