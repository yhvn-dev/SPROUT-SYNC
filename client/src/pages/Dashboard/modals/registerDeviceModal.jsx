import { motion } from "framer-motion";
import { X, BellRing } from 'lucide-react';
import { registerDevice } from "../../../data/deviceTokenServices";
import { getDeviceInfo } from "../../../utils/getDeviceInfo";
import { getPushToken } from "../../../utils/firebase";
import { useState } from "react";

import {Img_Logo} from "../../../components/logo"
import { useEffect } from "react";



function RegisterDeviceModal({ onClose, isRegisterModalOpen, setMsg, userData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo,setDeviceInfo] = useState({});

  if (!isRegisterModalOpen) return null;
  

  useEffect(() => {
    const device_Info = getDeviceInfo()
    setDeviceInfo(device_Info)  
  },[])
  

  
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const pushToken = await getPushToken();
      if (!pushToken) {
        console.warn("Push notifications permission denied");
        setIsLoading(false);
        return;
      }

      const payload = {
        user_id: userData.user_id,
        push_token: pushToken,
        device_type: deviceInfo.device_type,
        device_info: JSON.stringify(deviceInfo)
      };

      console.log("Register payload:", payload);
      await registerDevice(payload);

      setMsg("Device Registered Successfully!");
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Device Registration Failed", error);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (!isLoading) onClose(); // prevent closing during registration
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop-blur-2xl animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-auto my-4 max-w-md bg-gradient-to-br from-white to-sage-lighter rounded-3xl shadow-2xl overflow-hidden animate-slideUp"
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className={`absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors duration-200 z-10 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          aria-label="Close modal"
          disabled={isLoading}
        >
          <X className="cursor-pointer w-5 h-5 text-acc-darkc" />
        </button>

        {/* Content */}
        <div className="p-8 sm:p-10">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-ptl-greenb to-ptl-greenc rounded-2xl flex items-center justify-center shadow-lg">
              <BellRing className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-acc-darka mb-2">
              Welcome, {userData.username}!
            </h2>
            <p className="text-sm text-acc-darkc">to <Img_Logo/></p>
          </div>


          {/* Description */}
          <div className="mb-8">
            <p className="text-center text-acc-darkb leading-relaxed">
              Register your device to receive important notifications and updates about your plants. Stay connected and never miss a watering reminder!
            </p>
          </div>



          {/* Device Info Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-sage-light/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-acc-darkc font-medium">Device Type</span>
              <span className="text-acc-darka">
                {deviceInfo.device_type
                  ? deviceInfo.device_type.charAt(0).toUpperCase() + deviceInfo.device_type.slice(1)
                  : "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-acc-darkc font-medium">Date</span>
              <span className="text-acc-darka">Feb 15, 2026</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 relative">
            <button
              onClick={handleRegister}
              className={`cursor-pointer w-full py-4 bg-[var(--sancgb)] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 ${isLoading ? "cursor-not-allowed opacity-70" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Registering...
                </>
              ) : (
                "Register Device"
              )}
            </button>

            <button
              onClick={handleSkip}
              className={`cursor-pointer w-full py-4 bg-white/50 text-acc-darka font-medium rounded-2xl hover:bg-white/80 active:scale-[0.98] transition-all duration-200 border border-sage-light/30 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={isLoading}
            >
              Skip for Now
            </button>
          </div>

          <p className="text-xs text-center text-acc-darkc mt-6 opacity-75">
            You can always register your device later in settings
          </p>
        </div>
        
      </motion.div>
    </motion.div>
  );
}

export default RegisterDeviceModal;
