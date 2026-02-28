import { useNavigate } from "react-router-dom";
import { UserContext } from "../hooks/userContext";
import { useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// ✅ IMPORT api from your utils
import api from "../utils/api";

import { LogOut, X } from "react-feather";

export function LogoutModal({ isOpen, onClose }) {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAllLogout = async (e) => {
    e.preventDefault();

    try {
      // ✅ USE api, not hardcoded localhost
      await api.delete("/users/logout-all", { withCredentials: true });
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.response?.data?.message || err.message);
    }
  };

  const handleDeviceLogout = async (e) => {
    e.preventDefault();
    try {
      // ✅ USE api, not hardcoded localhost
      await api.delete("/users/logout", { withCredentials: true });
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.response?.data?.message || err.message);
    }
  };

  return (
    <section className="center flex items-center justify-center h-full w-full fixed top-0 left-0 bg-transparent-[100%] backdrop-blur-[10px] z-[50]">
      <motion.div
        className="conb bg-[var(--main-whiteb)] p-4 w-[450px] h-[250px] relative rounded-[10px] shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="cursor-pointer logout-btn cancel-btn absolute top-[20px] right-[20px]"
          onClick={onClose}
        >
          <div className="transition-1s rounded-[10px] p-[1px] transition-colors duration-300 hover:bg-[var(--pal2-whiteb)]">
            <X />
          </div>
        </button>

        <ul className="flex justify-start items-center">
          <LogOut className="mr-4" strokeWidth={1.5} size={24} />
          <p className="text-[1.5rem] text-[var(--acc-darkb)]">Logout Your Account?</p>
        </ul>

        <ul className="btn_box w-full h-full flex items-center justify-around p-t">
          <button
            className="cursor-pointer px-4 py-1 logout-choices logout-all bg-[var(--color-danger-b)] rounded-[10px]"
            onClick={handleAllLogout}
          >
            To all devices
          </button>
          <button
            className="cursor-pointer px-4 py-1 logout-choices logout-device btn-a rounded-[10px]"
            onClick={handleDeviceLogout}
          >
            This device only
          </button>
        </ul>
      </motion.div>
    </section>
  );
}
