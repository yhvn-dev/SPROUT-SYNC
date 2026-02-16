
import { useEffect } from "react";


export function FloatSuccessMsg({txt,clearMsg}){

  useEffect(() =>{
    if(txt){
        const timeout = setTimeout(() => clearMsg(""),5000)
        return () => clearTimeout(timeout)
    }
  },[txt,clearMsg])

  if(!txt) return null;

  return (
    <div className={`z-50 absolute succes_msg_pro pointer-events-none w-full top-[10px] left-0 p-4`}>
      <p className="full w-[90%] ">{txt}</p>
    </div>
  )

}



export function FloatErrorMsg({txt,clearMsg}){

  useEffect(() =>{
    if(txt){
        const timeout = setTimeout(() => clearMsg(""),5000)
        return () => clearTimeout(timeout)
    }
  },[txt,clearMsg])

  if(!txt) return null;

  return (
    <div className={`z-50 rounded-2xl border-2 border-[var(--color-danger-a)] absolute error_msg pointer-events-none w-full top-[10px] left-0 p-4`}>
      <p className="full w-[90%] ">{txt}</p>
    </div>
  )
}


