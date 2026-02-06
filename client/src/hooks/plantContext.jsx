// context/PlantDataContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as trayGroupService from "../data/trayGroupServices";
import * as traysService from "../data/traysServices";
import * as plantBatches from "../data/batchesData";
import * as plantBatchHistory from "../data/plantBatchesHistory"
import * as sensorService from "../data/sensorServices";
import * as readingsService from "../data/readingsServices";
import * as notifService from "../data/notifsServices";

const PlantDataContext = createContext(null);

export const PlantDataProvider = ({ children }) => {
  const [trayGroups, setTrayGroups] = useState([]);
  const [trays, setTrays] = useState([]);

  const [batches, setBatches] = useState([]);
  const [batchHistory,setBatchHistory] = useState([]);
  const [batchTotal, setBatchTotal] = useState({});
  const [batchHistoryTotal,setBatchHistoryTotal] = useState({})
  const [growthOvertime,setGrowthOvertime] = useState([])

  const [sensors, setSensors] = useState([]);
  
  const [readings, setReadings] = useState([]);
  const [latestReadings, setLatestReadings] = useState([]);
  
  const [moistureReadingsLast24h, setMoistureReadingsLast24h] = useState([]);
  const [averageReadingsBySensor, setAverageReadingsBySensor] = useState({});

  const [notifs, setNotifs] = useState([]);
  const [notifsCount,setNotifCount] = useState([]);
  const [readNotifs,setReadNotifs] = useState([])

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
  

  // Finished
  const loadBatchHistory = useCallback(async () => {
    try {
      const data = await plantBatchHistory.fetchAllBatchHistory()
      setBatchHistory(data)
    } catch (error) {
      console.error("Error loading batch history", error);
    }
  }, []);


  const loadBatchTotalHistory = useCallback(async () =>{
    try {
      const data = await plantBatchHistory.fetchAllBatchHistoryTotal()
      setBatchHistoryTotal(data)
    } catch (error) {
      console.error("Error loading batch history", error);
    }
  },[])


  // Active
  const loadBatchTotal = useCallback(async () => {
    try {
      const data = await plantBatches.fetchTotalBatchesData();
      setBatchTotal(data);
    } catch (error) {
      console.error("Error loading batch totals", error);
    }
  }, []);
  

  
  const loadGrowthOvertime = useCallback(async () => {
    try {
      const data = await plantBatchHistory.fetchSeedlingsGrowthOvertime()
      setGrowthOvertime(data);
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


    const loadLatestReadings = useCallback(async () => {
    try {
      const data = await readingsService.fetchAllLatestReadings()
      setLatestReadings(data);
    } catch (error) {
      console.error("Error loading readings", error);
    }
  }, []);

  
  
  const loadMoistureReadingsLast24h = useCallback(async () => {
    try {
      const data = await readingsService.fetchMoistureReadingsLast24hr();
      setMoistureReadingsLast24h(data);
    } catch (error) {
      console.error("Error loading moisture readings (last 24h)", error);
    }
  }, []);

        
    const loadAverageReadingsBySensor = useCallback(async (sensorType) => {
    try {
      const data = await readingsService.fetchAverageReadingsBySensor(sensorType);
      const key = sensorType.replace(/\s+/g, "_").toLowerCase();
      setAverageReadingsBySensor(prev => ({
        ...prev,
        [key]: data
      }));
    } catch (error) {
      console.error("Error loading average readings by sensor", error);
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


  
  const loadNotifsCount = useCallback(async () => {
    try {
      const data = await notifService.fetchNotifsCount()
      setNotifCount(data);
    } catch (error) {
      console.error("Error loading total notifications ", error);
    }
  }, []);


  const markNotifsAsRead = useCallback(async () => {
    try {
        const data = await notifService.markNotifAsRead()
        setReadNotifs(data)
    } catch (error) {
      console.error("Error reading notifications ", error);
    }
  }, []);


  
  useEffect(() => {
    loadTrayGroups();
    loadTrays();
    loadBatches();
    loadBatchTotal();
    loadBatchHistory();
    loadBatchTotalHistory();
    loadGrowthOvertime();
    loadSensors();
    loadReadings();
    loadLatestReadings();
    loadMoistureReadingsLast24h();
    loadAverageReadingsBySensor("moisture");
    loadAverageReadingsBySensor("ultra_sonic");
    loadNotifs();
    loadNotifsCount(),
    markNotifsAsRead()
  }, [
    loadTrayGroups,
    loadTrays,
    loadBatches,
    loadBatchTotal,
    loadBatchHistory,
    loadBatchTotalHistory,
    loadGrowthOvertime,
    loadSensors,
    loadReadings,
    loadLatestReadings,
    loadMoistureReadingsLast24h,
    loadAverageReadingsBySensor,
    loadNotifs,
    loadNotifsCount,
    markNotifsAsRead
  ]);
  

  // ------------------- INTERVAL UPDATES -------------------
  useEffect(() => {
    const interval = setInterval(() => {
      loadReadings();
      loadLatestReadings(); 
      loadMoistureReadingsLast24h(); 
      loadAverageReadingsBySensor("moisture");
      loadAverageReadingsBySensor("ultra_sonic");
    }, 5000); 
    return () => clearInterval(interval);
  }, [loadReadings,loadLatestReadings,loadMoistureReadingsLast24h,loadAverageReadingsBySensor]);
  
  // RENDER NOTIFICATION WHEN READINGS CHANGE
  useEffect(() => {
   loadNotifsCount()
   loadNotifs()
  }, [readings,latestReadings]); 


  
  return (
    <PlantDataContext.Provider
      value={{
        trayGroups,
        trays,
        batches,
        batchTotal,
        batchHistory,
        batchHistoryTotal,
        growthOvertime,
        sensors,
        readings,
        latestReadings,
        moistureReadingsLast24h,
        averageReadingsBySensor,
        notifs,
        notifsCount,
        readNotifs,
        loadTrayGroups,
        loadTrays,
        loadBatches,
        loadBatchTotal,
        loadBatchHistory,
        loadBatchTotalHistory,
        loadGrowthOvertime,
        loadSensors,
        loadReadings,
        loadLatestReadings,
        loadMoistureReadingsLast24h,
        loadAverageReadingsBySensor,
        loadNotifs,
        loadNotifsCount,
        markNotifsAsRead
      }}>
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
