import {User,Lock} from "lucide-react"
import { colors } from "./../../utils/colors"
import * as Logo from "../../components/logo"

export function Form({handleSubmit,errorMsg,successMsg,loginInputRef,passwordRef,status}) {

  return (  

    <form onSubmit={handleSubmit} className="h-[80%] w-[90%] md:w-[35%]  bg-[var(--main-whiteb)] rounded-[10px] shadow-xl">

        {/* right */}                            
        <div className="flex items-center flex-col h-[20%] w-full ">
            <div className='center mt-4'>
                <Logo.Img/>
                <span className="title form_title" >LOGIN</span>
            </div>
            <p className="descrp ">Water Your Plants Login Here</p>
        </div>

        <ul className="flex items-center justify-start flex-col w-full h-[80%]">

            {/* username */}
            <div className="form_box input_box w-1/2 relative mt-14">
                <input ref={loginInputRef} className="px-2 py-1 border-2 border-[var(--acc-darkc)]" name="username-email-inp" placeholder=""/>
                <label>Username or Email</label>
                <User size={16}  className='mt-[1px]' color={colors.accDarkc}/>                     
            </div>
            <ol className="center  flex mt-4">
                {errorMsg.loginInput && <p className="bg-red-50 border-1 border-red-200 px-4 py-1 rounded-lg text-sm">{errorMsg.loginInput}</p>} 
            </ol>
            

            {/* password */}
            <div className="form_box input_box w-1/2 relative mt-4">
                <input ref={passwordRef} className="px-2 py-1 border-2  border-[var(--acc-darkc)]" type="text" name="password-inp" placeholder=""/>
                <label>Password</label>
                <Lock size={8} className='mt-[1px]' color="var(--acc-darkc)"/>
            </div>
            <ol className="center flex mt-4">
                {errorMsg.password && <p className=" bg-red-50 border-1 border-red-200 px-4 py-1 rounded-lg text-sm">{errorMsg.password}</p>} 
            </ol>
        
            
            <div className="w-1/2 mt-12">
                <button  className="btn-p-full" type="submit">{status === "loggingIn" ? "Logging In" : "Login"}</button>
            </div>

            <ol className="successMsgBox mt-4">
                {errorMsg.server && <p className="justify-start text-sm bg-red-50 border-1 border-red-200 px-4 py-1 rounded-lg">{errorMsg.server}</p>}
                {errorMsg.message && <p className="justify-start text-sm bg-red-50 border-1 border-red-200 px-4 py-1 rounded-lg">{errorMsg.message}</p>}
                {successMsg && <p className="formMsg succMsg text-sm  bg-green-50 border-1 border-green-200 px-4 py-1 rounded-lg">{successMsg}</p>}
            </ol>            
        </ul>
    

    </form>
  )


}

