// context/PlantDataContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";

import * as trayGroupService from "../data/trayGroupServices";
import * as traysService from "../data/traysServices";
import * as plantBatches from "../data/batchesData";
import * as sensorService from "../data/sensorServices";
import * as readingsService from "../data/readingsServices";
import * as notifService from "../data/notifsServices";

const PlantDataContext = createContext(null);

export const PlantDataProvider = ({ children }) => {
  const [trayGroups, setTrayGroups] = useState([]);
  const [trays, setTrays] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [readings, setReadings] = useState([]);
  const [notifs, setNotifs] = useState([]);

  const loadTrayGroups = useCallback(async () => {
    try {
      const data = await trayGroupService.fetchAllTrayGroups();
      setTrayGroups(data);
    } catch (error) {
      console.error("Error loading tray groups", error);
    }
  }, []);

  const loadTrays = useCallback(async () => {
    try {
      const data = await traysService.fetchAllTrays();
      setTrays(data);
    } catch (error) {
      console.error("Error loading trays", error);
    }
  }, []);

  const loadBatches = useCallback(async () => {
    try {
      const data = await plantBatches.fetchAllBatches();
      setBatches(data);
    } catch (error) {
      console.error("Error loading batches", error);
    }
  }, []);

  const loadSensors = useCallback(async () => {
    try {
      const data = await sensorService.fetchAllSensors();
      setSensors(data);
    } catch (error) {
      console.error("Error loading sensors", error);
    }
  }, []);

  const loadReadings = useCallback(async () => {
    try {
      const data = await readingsService.fetchAllReadings();
      setReadings(data);
    } catch (error) {
      console.error("Error loading readings", error);
    }
  }, []);

  const loadNotif = useCallback(async () => {
    try {
      const data = await notifService.fetchAllNotifs();
      setNotifs(data);
    } catch (error) {
      console.error("Error loading notifications", error);
    }
  }, []);


  useEffect(() => {
    loadTrayGroups();
    loadTrays();
    loadBatches();
    loadSensors();
    loadReadings();
    loadNotif();
  }, [loadTrayGroups,loadTrays,loadBatches,loadSensors,loadReadings,loadNotif]);

 useEffect(() => {
    const interval = setInterval(() => {
        loadReadings();
        loadBatches();
    }, 5000);
    return () => clearInterval(interval);
 }, [loadReadings,loadBatches]);

return (
    <PlantDataContext.Provider
      value={{
        trayGroups,
        trays,
        batches,
        sensors,
        readings,
        notifs,
        loadTrayGroups,
        loadTrays,
        loadBatches,
        loadSensors,
        loadReadings,
        loadNotif,
      }}
    >
      {children}
    </PlantDataContext.Provider>
  );
};

export const usePlantData = () => {
  const context = useContext(PlantDataContext);
  if (!context) {
    throw new Error("usePlantData must be used within PlantDataProvider");
  }
  return context;
};
