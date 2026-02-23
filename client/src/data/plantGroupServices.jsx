import api from '../utils/api';

/* =========================
   CREATE PLANT
========================= */
export const createPlantGroup = async (plantData) => {
  try {
    const res = await api.post('plant_groups/post/plant_groups', plantData);
    return res.data;
    
  } catch (error) {
    console.derror('Error creating plant', error);
    throw error;
  }
};

/* =========================
   GET ALL PLANTS
========================= */
export const fetchAllPlantGroups = async () => {
  try {
    const res = await api.get('plant_groups/get/plant_groups');
    return res.data.groups
  } catch (error) {
    console.error('Error fetching all plants', error);
    throw error;
  }
};



/* =========================
   UPDATE PLANT
========================= */
export const updatePlantGroup = async (plant_id, plantData) => {
  try {
    const res = await api.put(`plant_groups/update/plant_groups/${plant_id}`, plantData);
    return res.data;
  } catch (error) {
    console.error('Error updating plant', error);
    throw error;
  }
};

/* =========================
   DELETE PLANT
========================= */
export const deletePlantGroup = async (plant_id) => {
  try {
    const res = await api.delete(`plant_groups/delete/plant_groups/${plant_id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting plant', error);
    throw error;
  }
};