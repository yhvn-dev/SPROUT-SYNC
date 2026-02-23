"use client";
import { useEffect, useState, useMemo } from "react";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { usePlantData } from "../../hooks/plantContext.jsx";

/* ─── MOISTURE BAR ───────────────────────────────────────── */
function MoistureBar({ min, max, fillColor, trackColor, small = false }) {
  return (
    <div className={`w-full ${small ? "space-y-0.5" : "space-y-1"}`}>
      <div
        className={`relative w-full rounded-full overflow-hidden ${
          small ? "h-1.5" : "h-2"
        }`}
        style={{ backgroundColor: trackColor ?? "#e5e7eb" }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            left: `${min}%`,
            width: `${max - min}%`,
            backgroundColor: fillColor ?? "#22c55e",
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}


function PlantChildCard({ plant }) {
  return (
    <div className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      
      {/* IMAGE / ICON */}
      <div className="h-24 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl">
        🌿
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        
        {/* ✅ ACTUAL PLANT NAME */}
        <p className="text-sm font-semibold text-gray-800 truncate">
          {plant.name}
        </p>

        {/* MOISTURE */}
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
            Moisture ({plant.moisture_min}% – {plant.moisture_max}%)
          </p>

          <MoistureBar
            min={plant.moisture_min}
            max={plant.moisture_max}
            fillColor="#34d399"
            small
          />
        </div>

      </div>
    </div>
  );
}



/* ─── CATEGORY CARD (RIGHT SIDE) ─────────────────────────── */
function CategoryCard({ group, childPlants }) {
  const minMoisture = group.moisture_min ?? 0;
  const maxMoisture = group.moisture_max ?? 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="h-28 bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-5xl">
        🌱
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-base font-bold text-gray-900">
            {group.group_name}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">
            Main Category
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Moisture Range</p>
          <MoistureBar
            min={minMoisture}
            max={maxMoisture}
            fillColor="#10b981"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-sm font-bold">{minMoisture}%</p>
            <p className="text-[10px] text-gray-400">Min</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-sm font-bold">{maxMoisture}%</p>
            <p className="text-[10px] text-gray-400">Max</p>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          {childPlants.length}{" "}
          {childPlants.length === 1 ? "plant" : "plants"}
        </p>
      </div>
    </div>
  );
}



/* ─── CATEGORY ROW ───────────────────────────────────────── */
function CategoryRow({ group, childPlants }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col-reverse md:grid md:grid-cols-[7fr_3fr] gap-4">
        {/* LEFT – plants */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {childPlants.map((plant) => (
            <PlantChildCard key={plant.plant_id} plant={plant} />
          ))}
        </div>

        {/* RIGHT – group */}
        <CategoryCard group={group} childPlants={childPlants} />
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function Plants() {
  const { plants, plantGroups, loadPlantGroups, loadPlants } = usePlantData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    loadPlantGroups();
    loadPlants();
  }, [loadPlantGroups, loadPlants]);

  
  
  useEffect(() =>{
    console.log("PLANTS",plants)
    console.log("PLANT GROUPS",plantGroups)
  })



  
  /* ─── FIXED MAPPING (NO EXTRA GROUPS) ─── */
  const groupsWithPlants = useMemo(() => {
    if (!Array.isArray(plantGroups) || !Array.isArray(plants)) return [];

    return plantGroups.map((group) => ({
      group,
      childPlants: plants.filter(
        (plant) => plant.group_id === group.plant_group_id
      ),
    }));
  }, [plantGroups, plants]);

  return (
    <div className="h-screen w-screen overflow-hidden grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] bg-gray-50">
      <div className="row-span-full hidden md:block">
        <Sidebar />
      </div>

      <div className="col-start-1 md:col-start-2 col-end-[-1] row-start-1">
        <Db_Header notifOpen={notifOpen} setNotifOpen={setNotifOpen}>
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            ☰
          </button>
        </Db_Header>
      </div>

      <main className="col-start-1 md:col-start-2 col-end-[-1] row-start-2 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Plant Monitor</h1>
        <p className="text-sm text-gray-500 mb-8">
          Groups = rows | Plants = cards
        </p>

        <div className="flex flex-col gap-12">
          {groupsWithPlants.map(({ group, childPlants }) => (
            <CategoryRow
              key={group.plant_group_id}
              group={group}
              childPlants={childPlants}
            />
          ))}
        </div>
      </main>
    </div>
  );
}