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
  const [batchTotal, setBatchTotal] = useState({});
  const [sensors, setSensors] = useState([]);
  const [readings, setReadings] = useState([]);
  const [notifs, setNotifs] = useState([]);

  // ------------------- LOAD FUNCTIONS -------------------
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

  const loadBatchTotal = useCallback(async () => {
    try {
      const data = await plantBatches.fetchTotalBatchesData();
      setBatchTotal(data);
    } catch (error) {
      console.error("Error loading batch totals", error);
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

  const loadNotifs = useCallback(async () => {
    try {
      const data = await notifService.fetchAllNotifs();
      setNotifs(data);
    } catch (error) {
      console.error("Error loading notifications", error);
    }
  }, []);

  // ------------------- INITIAL LOAD -------------------
  useEffect(() => {
    loadTrayGroups();
    loadTrays();
    loadBatches();
    loadBatchTotal(); 
    loadSensors();
    loadReadings();
    loadNotifs();
  }, [loadTrayGroups, loadTrays, loadBatches, loadBatchTotal, loadSensors, loadReadings, loadNotifs]);

  // ------------------- INTERVAL UPDATES -------------------
  useEffect(() => {
    const interval = setInterval(() => {
      loadReadings(); // frequent updates for sensors
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [loadReadings]);

  return (
    <PlantDataContext.Provider
      value={{
        trayGroups,
        trays,
        batches,
        batchTotal,
        sensors,
        readings,
        notifs,
        loadTrayGroups,
        loadTrays,
        loadBatches,
        loadBatchTotal,
        loadSensors,
        loadReadings,
        loadNotifs,
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
