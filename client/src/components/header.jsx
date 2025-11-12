import * as Logos from "./logo"
import { useState,useEffect} from "react";



export function Header({navChildren}) {
  const [isScrolled, setIsScrolled] = useState(false);


   useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  

  return (

    <nav
      className={`fixed top-0  w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
      <div className="rounded-[10px h-full w-full max-w-full mx-auto px-6 py-2">
        <div className="flex items-center justify-between rounded-[10px] ">

          {/* Logo Section */}
          <div className="flex items-center justify-start w-full h-full ">    
            <Logos.Img_Logo/>
          </div>

          <div className="flex flex-col items-end justify-start h-full w-full ">
              {navChildren}
          </div>
          
        </div>
      </div>
    </nav>

  )
}