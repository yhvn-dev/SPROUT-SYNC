import Logo from "../assets/Images/GREENLINK LOGO.png"
import Sprout from "../assets/Images/SPROUT-SYNC LOGO.png"

export function Text_Logo() {
  return (
    <>
        <span className="logo-text text-3xl text-[var(--sancgb)]">SPROUT</span>
        <span className="logo-text text-3xl">SYNC</span>
    </>    
  )
}

export function Img_Logo(){
    return (
      <>
      <div className="center mx-4">
        <img src={Logo} className="w-5 h-auto mr-2"/>
        <span className="logo-text text-3xl text-[var(--sancgb)] font-medium">SPROUT</span>
        <span className="logo-text text-3xl font-medium">SYNC</span>
      </div>
     
      </>
    )
}

export function Load_Logo() {
   return (
      <>
      <div className="center mx-4">
        <img src={Logo} className="w-10 h-auto mr-2"/>
        <span className="logo-text text-5xl text-[var(--sancgb)] font-medium">SPROUT</span>
        <span className="logo-text text-5xl font-medium">SYNC</span>
      </div>
     
      </>
    )
}

export function Img(){
    return (
      <>
      <img src={Logo} className="w-5 h-auto mr-2"/>
      </>
    )
}

export function SproutImg(){
  return (
    <>
      <img src={Sprout} className="w-5 h-auto mr-2"/>
    </>
  )
}


export function Img_Logo_BIG(){
    return (
      <>
      <div className="center mx-4">
        <img src={Logo} className="w-30 h-auto mr-2 drop-shadow-2xl"/>
        <span className="logo-text text-9xl text-[var(--sancgb)] font-medium">SPROUT</span>
        <span className="logo-text text-9xl font-medium">SNYC</span>
      </div>
     
      </>
    )
}

export function Db_Logo(){
    return (
      <>
        <div className="center mx-4">
            <img src={Logo} className="w-5 h-auto mr-2"/>
            <span className="logo-text text-3xl text-[var(--sancgb)] font-medium">SPROUT</span>
            <span className="logo-text text-3xl font-medium">SYNC</span>
        </div>
      </> 
    )
}