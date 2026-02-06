
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
      <div className={`success_msg center w-[100%] succes_msg_pro p-4`}>
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
    <div className={`absolute pointer-events-none w-full top-[0px] left-0 p-4`}>
      <p className="full w-[90%] succes_msg_pro_b">{txt}</p>
    </div>
  )

}