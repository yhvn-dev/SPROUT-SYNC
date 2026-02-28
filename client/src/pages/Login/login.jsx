import { useState, useRef, useContext } from "react";
import { UserContext } from "../../hooks/userContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import  { Form } from "./form.jsx";
import { Header } from "../../components/header.jsx";
import * as validate from "../../utils/userValidations";
import { fetchLoggedUser, loginUser } from "../../data/userService.jsx";

function Login() {
  const loginInputRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [status, setStatus] = useState("notLoggedIn");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginInput = loginInputRef.current.value.trim();
    const password = passwordRef.current.value.trim();

        // Reset messages first
        setErrorMsg({});
        setSuccessMsg("");
        const errors = validate.loginValidation({ loginInput, password }) || {};
        if (Object.keys(errors).length > 0) {
          setErrorMsg(errors);
          return;
        }

        try {
          setStatus("loggingIn");

          // 🔥 Call backend service
          const data = await loginUser({ loginInput, password });

          // Save token
          localStorage.setItem("accessToken", data.accessToken);

          // Fetch logged user
          const loggedUser = await fetchLoggedUser();
          setUser(loggedUser);

          // Success state
          setSuccessMsg("Login Successful!");
          setStatus("loggedIn");

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);

        } catch (err) {
          console.error("Login Error:", err);

          if (typeof err === "object") {
            setErrorMsg(err);  
          } else {
            setErrorMsg({ server: "An unexpected error occurred" });
          }

          setSuccessMsg("");
          setStatus("notLoggedIn");
        }
      };



  return (
    <section className="page login grid grid-cols-1 grid-rows-[8vh_92vh] h-[100vh] w-full bg-white">
      <Header
        navChildren={
          <>
            <Link
              to="/"
              className="text-[#5A8F73] border-2 rounded-2xl px-4 py-[1px]"
            >
              Home
            </Link>
          </>
        }
      />
      <section className="center row-start-2 row-end-3 col-start-1 col-end-2 w-full h-full">
        <Form
          handleSubmit={handleSubmit}
          errorMsg={errorMsg}
          successMsg={successMsg}
          loginInputRef={loginInputRef}
          passwordRef={passwordRef}
          status={status}
        />
      </section>
    </section>
  );
}





export default Login;
