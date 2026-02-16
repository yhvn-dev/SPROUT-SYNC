import api from "../utils/api";


export const registerDevice = async (deviceTokenData) => {
  try {
     const res = await api.post("/deviceToken/post/deviceToken/register",deviceTokenData);
     return res
  } catch (err) {
    throw err
  }
};


export const fetchUserDevices = async ({user_id}) => {
  try {
     const res = await api.get(`/deviceToken/get/deviceToken/${user_id}`);
     return res
  } catch (err) {
    throw err
  }
};


export const removeDevice = async ({loggedUser}) => {
  try {
     const res = await api.delete(`/deviceToken/delete/deviceToken/${loggedUser}`);
     return res
  } catch (err) {
    throw err
  }
};
