
import { useEffect } from "react";

export function SucessMsgs({txt,clearMsg}) {

  useEffect(() =>{
    if(txt){
        const timeout = setTimeout(() => clearMsg(""),5000)
        return () => clearTimeout(timeout)
    }
  },[txt,clearMsg])

  if(!txt) return null;

  return (
      <div className={`center w-[95%] succes_msg_pro`}>{txt}</div>
  )
  
}

