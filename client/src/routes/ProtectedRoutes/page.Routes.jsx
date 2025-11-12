import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Loader from "../../components/loaders";
import api from "../../utils/api";

export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // KUHA NG TOKEN SA LOCAL STORAGE ->  
    const checkToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // IF WALA DIRETSO LOGIN
        navigate("/login", { replace: true });
        return;
      }

      try {

        // Try to fetch user info
        const userInfo = await api.get("/users/me");
        console.log("USER INFO:",userInfo)

      } catch (err) {

        // If 401/403 → interceptor will try refresh
        if (err.response?.status === 401 || err.response?.status === 403) {

          try {
            // After refresh, retry the request
            await api.get("/users/me");
          } catch {
            // If refresh also fails → force login
            navigate("/login", { replace: true });
          }

        } else {
          navigate("/login", { replace: true });
        }
        
      } finally {
        setChecking(false);
      }
    };

    checkToken();
  }, [navigate]);

  if (checking) return <Loader.CheckSession />;

  return children;
};
