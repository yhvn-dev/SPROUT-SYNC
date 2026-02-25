import { motion } from "framer-motion";
import { X, BellRing } from "lucide-react";
import { registerDevice } from "../../../data/deviceTokenServices";
import { getDeviceInfo } from "../../../utils/getDeviceInfo";
import { getPushToken } from "../../../utils/firebase";
import { useState, useEffect, useContext } from "react";
import { Img_Logo } from "../../../components/logo";
import { UserContext } from "../../../hooks/userContext";


function RegisterDeviceModal({ onClose, userData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});
  const { setUser } = useContext(UserContext);
  const { setSkippedRegister } = useContext(UserContext);

  // Always run hooks at top level
  useEffect(() => {
    const device_Info = getDeviceInfo();
    setDeviceInfo(device_Info);
  }, []);

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
        device_info: JSON.stringify(deviceInfo),
      };

      await registerDevice(payload);

      setUser(prev => ({ ...prev, first_time_login: false }));

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Device Registration Failed", error);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setSkippedRegister(true); 
    onClose();                
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="conb relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden bg-white">
          
        {/* Close button */}
        <button
          onClick={handleSkip}
          disabled={isLoading}
          className={`cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}>

          <X className="w-5 h-5" />
        </button>



        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BellRing className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              Welcome, {userData?.username}!
            </h2>

            <span className="text-sm text-gray-500">
              to <Img_Logo />
            </span>
          </div>

          {/* Description */}
          <p className="text-center text-gray-600 mb-8">
            Register your device to receive important notifications and updates
            about your plants.
          </p>

          {/* Device Info */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">
                Device Type
              </span>
              <span>
                {deviceInfo.device_type
                  ? deviceInfo.device_type.charAt(0).toUpperCase() +
                    deviceInfo.device_type.slice(1)
                  : "Unknown"}
              </span>
            </div>
          </div>

          

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className={`cursor-pointer w-full py-4 bg-[var(--sancgb)] text-white font-semibold rounded-2xl transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
              }`}
            >
              {isLoading ? "Registering..." : "Register Device"}
            </button>

            <button
              onClick={handleSkip}
              disabled={isLoading}
              className="cursor-pointer registert-modal-skip-button w-full py-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition"
            >
              Skip for Now
            </button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-6">
            You can always register your device later in settings.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}



export default RegisterDeviceModal;