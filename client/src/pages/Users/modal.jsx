import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { validateUserEmptyFields } from "../../utils/userValidations"; 
import { X, UserPen, UserPlus, Trash2 } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  mode,
  handleSubmit,      // expects payload as JSON
  userData,
  backendError,
  setBackendError
}) {
  if (!isOpen) return null;

  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setFullname(userData.fullname || "");
      setEmail(userData.email || "");
      setPhoneNumber(userData.phone_number || "");
      setRole(userData.role || "");
    }
  }, [userData]);

  const onFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: username.trim(),
      fullname: fullname.trim(),
      email: email.trim(),
      phone_number: phoneNumber.trim(),
      role: role.trim(),
    };

    // Include password if adding or updating with a new one
    if (mode === "insert" || password.trim() !== "") {
      payload.password = password.trim();
    }

    // Validate fields
    const { errors: validationErrors } = validateUserEmptyFields(payload, password, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Send JSON payload directly
      await handleSubmit(payload);
      setErrors({});
      onClose();
    } catch (err) {
      console.error("User Error", err);
      // Optionally set backend errors
      setBackendError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    setErrors({});
    setBackendError("");
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`user_modal bg-white rounded-2xl shadow-2xl relative ${mode === "delete" ? "w-[520px]" : "w-[800px]"}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={handleClose}
        >
          <X size={20} className="text-gray-600" />
        </button>

        {mode === "delete" ? (
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="icon_box p-3 bg-red-50 rounded-xl">
                <Trash2 size={24} className="trash_icon text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Delete User</h2>
            </div>
            <p className="text-gray-600 text-lg mb-8">
              Are you sure you want to delete user <span className="font-semibold text-gray-900">{fullname}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="cancel_button px-6 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(userData)}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                Delete User
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="icon_box p-3 bg-blue-50 rounded-xl">
                {mode === "insert" ? <UserPlus size={24} className="add_icon text-blue-600" /> : <UserPen size={24} className="update_icon text-blue-600" />}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">{mode === "insert" ? "Add User" : "Update User"}</h2>
            </div>

            <form onSubmit={onFormSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Enter username"
                    />
                    {errors.username && <h6 className="text-red-600 text-sm mt-1">{errors.username}</h6>}
                    {backendError && backendError.toLowerCase().includes("username") && <p className="text-red-600 text-sm mt-1">{backendError}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Enter full name"
                    />
                    {errors.fullname && <h6 className=" text-red-600 text-sm mt-1">{errors.fullname}</h6>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Enter email address"
                    />
                    {errors.email && <h6 className="text-red-600 text-sm mt-1">{errors.email}</h6>}
                    {backendError && backendError.toLowerCase().includes("email") && <h6 className="text-red-600 text-sm mt-1">{backendError}</h6>}
                  </div>
                </div>



                {/* Right Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password {mode === "update" && <p className="text-gray-400 text-xs">(leave blank to keep current)</p>}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Enter password"
                    />
                    {errors.password && <h6 className=" text-red-600 text-sm mt-1">{errors.password}</h6>}
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white"
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    {errors.role && <h6 className=" text-red-600 text-sm mt-1">{errors.role}</h6>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="cursor-pointer cancel_button px-6 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium">
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`cursor-pointer px-6 py-2.5 text-white rounded-xl transition-colors duration-200 font-medium 
                    ${mode === "update" ? "bg-[var(--white-blple--)] hover:bg-[var(--bluis--)]" : "bg-green-600 hover:bg-green-700"}`}>
                  {mode === "update" ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        )}


      </motion.div>
    </motion.div>
  );
}
