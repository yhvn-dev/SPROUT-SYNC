
import { useEffect  } from "react";

export function SucessMsgs({txt,clearMsg}) {

  useEffect(() =>{
    if(txt){
        const timeout = setTimeout(() => clearMsg(""),5000)
        return () => clearTimeout(timeout)
    }
  },[txt,clearMsg])

  if(!txt) return null;

  return (
      <div className={` center w-[100%] succes_msg_pro p-4`}>
        <p className="full center">{txt}</p>
      </div>
  )
  
}

export function FloatSuccessMsg({txt,clearMsg}){

  useEffect(() =>{
    if(txt){
        const timeout = setTimeout(() => clearMsg(""),5000)
        return () => clearTimeout(timeout)
    }
  },[txt,clearMsg])

  if(!txt) return null;

  return (
    <div className={`absolute succes_msg_pro pointer-events-none w-full top-[10px] left-0 p-4`}>
      <p className="full w-[90%] ">{txt}</p>
    </div>
  )

  
}


