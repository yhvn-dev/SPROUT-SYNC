
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
    <div className={`  fixed
            top-4
            left-1/2
            -translate-x-1/2
            z-50
            bg-emerald-500
            text-white
            text-sm
            font-medium
            px-6
            py-3
            rounded-xl
            shadow-lg`}>
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
    <div className={`
        fixed
        top-4
        left-1/2
        -translate-x-1/2
        z-50
        bg-red-500
        text-white
        text-sm
        font-medium
        px-6
        py-3
        rounded-xl
        shadow-lg
    `}>
      <p className="full w-[90%] ">{txt}</p>
    </div>
  )
}



export function FloatInfoMsg({txt,clearMsg}){

  useEffect(() =>{
    if(txt){
        const timeout = setTimeout(() => clearMsg(""),5000)
        return () => clearTimeout(timeout)
    }
  },[txt,clearMsg])

  if(!txt) return null;

  return (
    <div className={`fixed
            top-4
            left-1/2
            -translate-x-1/2
            z-50
            bg-gray-500
            text-white
            text-sm
            font-medium
            px-6
            py-3
            rounded-xl
            shadow-lg`}>
      <p className="full w-[90%] ">{txt}</p>
    </div>
  )

  
}