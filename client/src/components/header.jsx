import * as Logos from "./logo"

export function Header({isScrolled,navChildren}) {
  return (

    <nav
      className={`fixed top-0  w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-2xl' : 'bg-transparent'
      }`}>
      <div className="rounded-[10px h-full w-full max-w-full mx-auto px-6 py-2">
        <div className="flex items-center justify-between rounded-[10px] ">

          {/* Logo Section */}
          <div className="flex items-center justify-start w-full h-full ">    
            <div className="flex items-center justify-center w-[3rem] h-[3rem] rounded-full bg-[var(--sancga)] border-white border-[1px]">
               <Logos.Img/>       
            </div>
          </div>

          <div className="flex flex-col items-end justify-start h-full w-full ">
              {navChildren}
          </div>
          
        </div>
      </div>
    </nav>

  )
}