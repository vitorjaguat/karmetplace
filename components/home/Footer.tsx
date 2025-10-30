export const Footer = () => {
  return (
    <div
      id="footer"
      className=" 
    relative z-[1] p-6 md:p-10 flex flex-col w-full items-center md:block text-center md:text-left bg-gray-200/10"
    >
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
              href="https://uint.studio/"
              className="hover:tracking-wide duration-700"
            >
              Uint Studio
            </a>
          </div>
        </div>
        <div className="flex items-end justify-between md:justify-end gap-6">
          <div className="text-left text-[14px] text-[var(--colors-gray12)] flex flex-col justify-end mt-6 md:mt-0">
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
