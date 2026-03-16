import api from '../utils/api';


/* =========================
   CREATE PLANT
========================= */
export const createPlant = async (plantData) => {
  try {
    const res = await api.post('plants/post/plants', plantData)
    return res.data;
  } catch (error) {
    console.error('Error creating plant', error);
    throw error;
  }
};


/* =========================
   GET ALL PLANTS
========================= */
export const fetchAllPlants = async () => {
  try {
    const res = await api.get('plants/get/plants');
    return res.data.data
  } catch (error) {
    console.error('Error fetching all plants', error);
    throw error;
  }
};



/* =========================
   UPDATE PLANT
========================= */
export const updatePlant = async (plant_id, plantData) => {
  try {
    const res = await api.put(`plants/put/plants/${plant_id}`, plantData);
    return res.data;
  } catch (error) {
    console.error('Error updating plant', error);
    throw error;
  }
};

/* =========================
   DELETE PLANT
========================= */
export const deletePlant = async (plant_id) => {
  try {
    const res = await api.delete(`plants/delete/plants/${plant_id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting plant', error);
    throw error;
  }
};