import {useState,useRef,useContext} from "react"
import { UserContext } from "../../hooks/userContext.jsx"
import api from "../../utils/api"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Form } from "./form.jsx"
import { Header } from "../../components/header.jsx" 
import * as validate from "../../utils/userValidations"
import { fetchLoggedUser } from "../../data/userService.jsx"


function Login() {
  const loginInputRef = useRef(null)
  const passwordRef = useRef(null)
  const [errorMsg,setErrorMsg] = useState({});
  const [successMsg,setsuccessMsg] = useState("")
  const [status,setStatus] = useState("notLoggedIn");
  const {setUser} = useContext(UserContext)

  const navigate = useNavigate(); 
  
  const handleSubmit = async (e) =>{
    e.preventDefault()

    const loginInput = loginInputRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    
    const errors = validate.loginValidation({loginInput,password}) || {};
    if(Object.keys(errors).length > 0){
      setErrorMsg(errors)
      return
    }
    
    try{

      const { data } = await api.post("http://localhost:5000/auth/login",{
        loginInput,
        password
      });
 
      localStorage.setItem("accessToken",data.accessToken)
      const loggedUser = await fetchLoggedUser()
      setUser(loggedUser)

      setsuccessMsg("Login Sucessfull!");
      setStatus("loggingIn")

      setTimeout(() => {
        navigate("/dashboard")       
      }, 1500);
 
      setErrorMsg({}) 
    }catch(err){

      if(err.response){
        setErrorMsg({server: err.response.data.message || "Invalid username or password"});
      }else if(err.request){      
        setErrorMsg({server: "Login failed or server is not reachable!"})
      }else{
        setErrorMsg({server: "An Unexpected Error Occured"})
        }
      setsuccessMsg("") 
    }
  }
    
  return (
    <section className="page login grid grid-cols-1 grid-rows-[8vh_92vh] h-[100vh] w-full bg-white">

        <Header navChildren={
            <>
              <Link to="/" className="text-[#5A8F73] border-2 rounded-2xl px-4 py-[1px]">Home</Link>
            </>
        }/>
        <section className="center row-start-2 row-end-3 col-start-1 col-end-2 w-full h-full ">
            <Form 
            handleSubmit={handleSubmit} 
            errorMsg={errorMsg} 
            successMsg={successMsg} 
            loginInputRef={loginInputRef} 
            passwordRef={passwordRef}
            status={status} /> 
        </section>
            
    </section>


  )
  
  
  
}

export default Login