import { Box } from 'components/primitives'

export default function Header() {
  return (
    <Box
      css={{
        p: 24,
        height: '100%',
        '@bp800': {
          px: '$5',
        },
        '@xl': {
          px: '$6',
        },
      }}
    >
      <div className="relative z-10 w-full h-fit">
        <div className="w-full relative text-4xl text-right text-white z-[100] flex justify-end my-4">
          <div className="max-w-[700px] text-[#edeeef]">
            <div className="">Experiment, Trade, and Collect Live Art</div>
            {/* <div className="text-3xl">
              A Platform for Live Art and Choreographed Value Distribution
            </div> */}
          </div>
        </div>
      </div>
    </Box>
  )
}
