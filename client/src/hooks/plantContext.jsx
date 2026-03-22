// PlantDataContext.jsx
import { createContext, useContext, useEffect, useState, useCallback, useRef} from "react";
import * as trayGroupService from "../data/trayGroupServices";
import * as traysService from "../data/traysServices";
import * as plantBatches from "../data/batchesData";
import * as plantBatchHistory from "../data/plantBatchesHistory";
import * as sensorService from "../data/sensorServices";
import * as readingsService from "../data/readingsServices";
import * as notifService from "../data/notifsServices";
import * as plantGroupService from "../data/plantGroupServices";
import * as plantService from "../data/plantServices";
import { playNotifSound } from "../utils/notificationSounds";


const PlantDataContext = createContext(null);




export const PlantDataProvider = ({ children }) => {
  // ------------------- STATES -------------------
  const [trayGroups, setTrayGroups] = useState([]);
  const [trays, setTrays] = useState([]);
  const [tgWithTrayCount,setTgWithTrayCount] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batchHistory, setBatchHistory] = useState([]);
  const [batchTotal, setBatchTotal] = useState({});
  const [batchHistoryTotal, setBatchHistoryTotal] = useState({});
  const [growthOvertime, setGrowthOvertime] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [readings, setReadings] = useState([]);
  const [latestReadings, setLatestReadings] = useState([]);
  const [averageReadingsBySensor, setAverageReadingsBySensor] = useState({});
  const [notifs, setNotifs] = useState([]);
  const [notifsCount, setNotifCount] = useState(0);
  const [readNotifs, setReadNotifs] = useState([]);

  // NEW: Plant groups and plants
  const [plantGroups, setPlantGroups] = useState([]);
  const [plants, setPlants] = useState([]);

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


   const loadTrayGroupsWithCount = useCallback(async () => {
    try {
      const data = await traysService.fetchAllTrayGroupWithCount()
      setTgWithTrayCount(data)
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

  const loadBatchHistory = useCallback(async () => {
    try {
      const data = await plantBatchHistory.fetchAllBatchHistory();
      setBatchHistory(data);
    } catch (error) {
      console.error("Error loading batch history", error);
    }
  }, []);

  const loadBatchTotalHistory = useCallback(async () => {
    try {
      const data = await plantBatchHistory.fetchAllBatchHistoryTotal();
      setBatchHistoryTotal(data);
    } catch (error) {
      console.error("Error loading batch history total", error);
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

  const loadGrowthOvertime = useCallback(async () => {
    try {
      const data = await plantBatchHistory.fetchSeedlingsGrowthOvertime();
      setGrowthOvertime(data);
    } catch (error) {
      console.error("Error loading growth over time", error);
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
      const data = await readingsService.fetchAllLatestReadings();
      setLatestReadings(data);
    } catch (error) {
      console.error("Error loading latest readings", error);
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




  const prevNotifsRef = useRef([]);
  const isFirstLoad = useRef(true); 
  const loadNotifs = useCallback(async () => {
    try {
      const data = await notifService.fetchAllNotifs();

      const prevIds = new Set(prevNotifsRef.current.map((n) => n.notification_id));
      const newNotifs = data.filter((d) => !prevIds.has(d.notification_id));

      if (newNotifs.length > 0 && !isFirstLoad.current) {
        console.log("🔔 New notifs detected:", newNotifs.length);
        playNotifSound();
      }

      isFirstLoad.current = false; 
      prevNotifsRef.current = data;
      setNotifs(data);
    } catch (error) {
      console.error('Error loading notifications', error);
    }
  }, []);


  



  const loadNotifsCount = useCallback(async () => {
    try {
      const data = await notifService.fetchNotifsCount();

      setNotifCount(data);
    } catch (error) {
      console.error("Error loading notifications count", error);
    }
  }, []);


  const markNotifsAsRead = useCallback(async () => {
    try {
      const data = await notifService.markNotifAsRead();
      setReadNotifs(data);
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  }, []);




  // NEW: Load plant groups
  const loadPlantGroups = useCallback(async () => {
    try {
      const data = await plantGroupService.fetchAllPlantGroups();
      setPlantGroups(data);
    } catch (error) {
      console.error("Error loading plant groups", error);
    }
  }, []);


  
  // NEW: Load plants
  const loadPlants = useCallback(async () => {
    try {
      const data = await plantService.fetchAllPlants();
      setPlants(data);
    } catch (error) {
      console.error("Error loading plants", error);
    }
  }, []);


  
  // ------------------- INITIAL LOAD -------------------
  useEffect(() => {
    loadTrayGroups();
    loadTrays();
    loadTrayGroupsWithCount();
    loadBatches();
    loadBatchTotal();
    loadBatchHistory();
    loadBatchTotalHistory();
    loadGrowthOvertime();
    loadSensors();
    loadReadings();
    loadLatestReadings();
    loadAverageReadingsBySensor("moisture");
    loadAverageReadingsBySensor("ultra_sonic");
    loadNotifs();
    loadNotifsCount();
    markNotifsAsRead();
    loadPlantGroups();
    loadPlants();
  }, [
    loadTrayGroups,
    loadTrays,
    loadTrayGroupsWithCount,
    loadBatches,
    loadBatchTotal,
    loadBatchHistory,
    loadBatchTotalHistory,
    loadGrowthOvertime,
    loadSensors,
    loadReadings,
    loadLatestReadings,
    loadAverageReadingsBySensor,
    loadNotifs,
    loadNotifsCount,
    markNotifsAsRead,
    loadPlantGroups,
    loadPlants
  ]);

  

  // ------------------- INTERVAL UPDATES -------------------
  useEffect(() => {
    const interval = setInterval(() => {
      loadReadings();
      loadLatestReadings();
      loadAverageReadingsBySensor("moisture");
      loadAverageReadingsBySensor("ultra_sonic");
    }, 5000);
    return () => clearInterval(interval);
  }, [loadReadings, loadLatestReadings, loadAverageReadingsBySensor]);



  
  // ------------------- NOTIFICATIONS WHEN READINGS CHANGE -------------------
  useEffect(() => {
    const notifInterval = setInterval(() => {
      loadNotifs();
      loadNotifsCount();
    }, 5000); 
    return () => clearInterval(notifInterval);
  }, [loadNotifs, loadNotifsCount]);






  return (
    <PlantDataContext.Provider
      value={{
        trayGroups,
        trays,
        tgWithTrayCount,
        batches,
        batchTotal,
        batchHistory,
        batchHistoryTotal,
        growthOvertime,
        sensors,
        readings,
        latestReadings,
        averageReadingsBySensor,
        notifs,
        notifsCount,
        readNotifs,
        plantGroups, // new
        plants,      // new
        // Load functions
        loadTrayGroups,
        loadTrays,
        loadTrayGroupsWithCount,
        loadBatches,
        loadBatchTotal,
        loadBatchHistory,
        loadBatchTotalHistory,
        loadGrowthOvertime,
        loadSensors,
        loadReadings,
        loadLatestReadings,
        loadAverageReadingsBySensor,
        loadNotifs,
        loadNotifsCount,
        markNotifsAsRead,
        loadPlantGroups, // new
        loadPlants       // new
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