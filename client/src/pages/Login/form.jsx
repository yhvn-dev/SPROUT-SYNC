import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { colors } from "./../../utils/colors";
import * as Logo from "../../components/logo";

export function Form({
  handleSubmit,
  errorMsg,
  successMsg,
  loginInputRef,
  passwordRef,
  status,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      className="
        login_form
        h-auto sm:h-[80%]
        w-[80%] sm:w-[90%] md:w-[60%] lg:w-[35%]
        bg-[var(--main-whiteb)]
        rounded-[10px]
        shadow-xl
        mx-auto
        flex
        p-4
        flex-col
      "
    >
      {/* Header */}
      <div className="flex items-center flex-col h-auto sm:h-[20%] w-full px-4">
        <div className="center mt-4">
          <Logo.Img />
          <span className="title form_title">LOGIN</span>
        </div>
        <p className="descrp text-center text-sm sm:text-base">
          Water Your Plants Login Here
        </p>
      </div>



      {/* Inputs */}
      <ul className="flex items-center justify-start flex-col w-full flex-1 pb-6">
        {/* Username */}
        <div className="form_box center input_box w-[90%] sm:w-1/2 relative mt-10 sm:mt-14">
          <input
            ref={loginInputRef}
            className="px-1 py-1 border-2 rounded-xl border-[var(--acc-darkc)] w-full"
            name="username-email-inp"
            placeholder=""
          />
          <label>Username or Email</label>
          <User
            size={16}
            className="absolute right-0 mt-[1px]"
            color={colors.accDarkc}
          />
        </div>

        {errorMsg.loginInput && (
          <p className="message-text bg-red-50 border-1 border-red-200 px-4 py-1 rounded-lg text-sm mt-2 w-[90%] sm:w-1/2">
            {errorMsg.loginInput}
          </p>
        )}

        {/* Password */}
        <div className="form_box center input_box w-[90%] sm:w-1/2 relative mt-4">
          <input
            ref={passwordRef}
            className="py-1 px-1 border-2 rounded-xl border-[var(--acc-darkc)] transition-all duration-300 w-full"
            type={showPassword ? "text" : "password"}
            name="password-inp"
            placeholder=""
          />
          <label>Password</label>

          <Lock
            size={8}
            className="mt-[1px] absolute right-0"
            color="var(--acc-darkc)"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              cursor-pointer
              absolute
              right-8
              top-[6px]
              -translate-y-1/2
              p-1
              rounded-full
              transition-all
              duration-300
              hover:bg-gray-200
              active:scale-90
            "
          >
            {showPassword ? (
              <EyeOff size={16} className="animate-fadeIn" color="var(--acc-darkc)" />
            ) : (
              <Eye size={16} className="animate-fadeIn" color="var(--acc-darkc)" />
            )}
          </button>
        </div>

        {errorMsg.password && (
          <p className="message-text bg-red-50 border-1 border-red-200 px-4 py-1 rounded-lg text-sm mt-2 w-[90%] sm:w-1/2">
            {errorMsg.password}
          </p>
        )}

        {/* Submit */}
        <div className="w-[90%] sm:w-1/2 mt-10 sm:mt-12">
          <button className="btn-p-full w-full" type="submit">
            {status === "loggingIn" ? "Logging In" : "Login"}
          </button>
        </div>

        {/* Server errors & success */}
        <div className="successMsgBox mt-4 flex flex-col items-start gap-2 w-[90%] sm:w-1/2">
          {errorMsg.server && (
            <p className="message-text bg-red-50 border-1 border-red-200 px-4 py-1 rounded-lg text-sm w-full">
              {errorMsg.server}
            </p>
          )}

          {errorMsg.message && (
            <p className="message-text bg-red-50 border-1 border-red-200 px-4 py-1 rounded-lg text-sm w-full">
              {errorMsg.message}
            </p>
          )}

          
        

          {successMsg && (
            <p className="message-text bg-green-50 border-1 border-green-200 px-4 py-1 rounded-lg text-sm w-full">
              {successMsg}
            </p>
          )}
        </div>
      </ul>
    </form>
  );


  
}
