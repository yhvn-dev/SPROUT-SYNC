import * as Logos from "./logo"
import { Nav } from "./nav"
import { useState,useEffect} from "react";
import {Leaf} from "lucide-react";


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
      <div className="rounded-[10px  h-full w-full max-w-full mx-auto px-6  py-2">
        <div className="flex items-center justify-between rounded-[10px]">

          {/* Logo Section */}
          <div className="flex items-center justify-start w-full h-full ">    
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#027c68] to-[#009983] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
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