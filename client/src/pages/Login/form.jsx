import React, { useState,useRef } from 'react'
import {User,Lock} from "lucide-react"
import { colors } from "./../../utils/colors"

export function Form({handleSubmit,errorMsg,successMsg,loginInputRef,passwordRef}) {

  return (

        <form onSubmit={handleSubmit} className="forms card bg-[var(--pal2-whiteb)]">

        {/* left */}
        <ul className="loginForm form_part flex down lg-form-left w-1/2 h-full relative ">
        
            <div className="m-[0.5rem] ">
                <span>LOGO</span>
                <span> GREENLINK</span>
            </div>

            <div className="text_box down items-center text-center">

                <span className="text descr font-semibold text-[1rem]">Control your garden anytime anywhere</span>
                <p className="text descrp ">
                    GREENLINK makes plant care effortless with smart, automated watering,
                    Manage your garden through simple and reliable application.
                </p>

            </div>            
        
        </ul>



        <ul className="loginForm form_part down lg-form-right  w-1/2 h-full bg-white rounded-[10px] shadow-xl">
            {/* right */}                            
            <div className="form_box title_box h-[20%] w-full">
                <span className="title form_title" >LOGIN</span>
                <p className="descrp ">Water Your Plants Login Here</p>
            </div>

            <ul className="input_box_frame down justify-center w-full h-[80%]">

                {/* username */}
                <div className="form_box input_box">

                    <input ref={loginInputRef} className="px-2 py-[1px] border-2 border-[var(--acc-darkc)]" name="username-email-inp" placeholder=""/>
                    <label>Username or Email</label>
                    <User size={16} color={colors.accDarkc}/>                     
                </div>
                <ol className="formMsg_box flex">
                    {errorMsg.loginInput && <p className="formMsg errMsg justify-start">{errorMsg.loginInput}</p>}
                </ol>
                

                {/* password */}
                <div className="form_box input_box">
                    <input ref={passwordRef} className="px-2 py-[1px] border-2  border-[var(--acc-darkc)]" type="text" name="password-inp" placeholder=""/>
                    <label>Password</label>
                    <Lock size={10} color={colors.accDarkc}/>
                </div>
                <ol className="formMsg_box flex m-t">
                    {errorMsg.password && <p className="formMsg errMsg justify-start">{errorMsg.password}</p>} 
                </ol>
            
                
                <div className="form_box btn_box">
                <button  className="btn-p-full" type="submit">Login</button>
                </div>
                <ol className="formMsg_box successMsgBox m-t">
                    {errorMsg.server && <p className="formMsg errMsg justify-start">{errorMsg.server}</p>}
                    {errorMsg.message && <p className="formMsg errMsg justify-start">{errorMsg.message}</p>}
                    {successMsg && <p className="formMsg succMsg">{successMsg}</p>}
                </ol>

                <div className="form_box social_login_box"></div>
                
            </ul>
            
        
        </ul>

    </form>
  )


}

