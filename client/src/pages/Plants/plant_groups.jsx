"use client";
import { useEffect, useState, useMemo, useContext,useCallback} from "react";
import { usePlantData } from "../../hooks/plantContext.jsx";
import { UserContext } from "../../hooks/userContext.jsx";
import { CircleQuestionMark } from "lucide-react";
import { MessageContext } from "../../hooks/messageHooks.jsx";

/* ─── MOISTURE BAR ───────────────────────────────────────── */
function MoistureBar({ min, max, fillColor, trackColor, small = false }) {
  return (
    <div className={`w-full ${small ? "space-y-0.5" : "space-y-1"}`}>
      <div
        className={`relative w-full rounded-full overflow-hidden ${small ? "h-1.5" : "h-2"}`}
        style={{ backgroundColor: trackColor ?? "#e5e7eb" }}>
        <div
          className="absolute top-0 h-full rounded-full"
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





/* ─── PLANT CHILD CARD ───────────────────────────────────── */
function PlantChildCard({ plant, onUpdate, onDelete}) {
  const {user} = useContext(UserContext);    
  return (
    <div className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
     <div 
        className="cursor-pointer h-24 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl">
        🌿
      </div>
      <div className="conb p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm font-semibold text-gray-800 truncate">{plant.name}</p>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
            Moisture ({plant.moisture_min}% – {plant.moisture_max}%)
          </p>
          <MoistureBar min={plant.moisture_min} max={plant.moisture_max} fillColor="#34d399" small />
        </div>

           {user?.role === "admin" && (
            <div className="flex gap-1 mt-auto pt-1">
            <button
              onClick={() => onUpdate(plant)}
              className="flex-1 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg py-1 transition-colors">
              ✏️ Update
            </button>
            <button
              onClick={() => onDelete(plant)}
              className="flex-1 text-[11px] font-medium bg-red-50 hover:bg-red-100 text-red-500 rounded-lg py-1 transition-colors">
              🗑️ Delete
              </button>
          </div>    
           )}
        
        
      </div>
    </div>
  );
}

/* ─── CATEGORY CARD ──────────────────────────────────────── */
function CategoryCard({ group, childPlants }) {
  const minMoisture = group.moisture_min ?? 0;
  const maxMoisture = group.moisture_max ?? 100;

  return (
    <div className="conb bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="h-28 bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-5xl">
        🌱
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-base font-bold text-gray-900">{group.group_name}</p>
          <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">
            Main Category
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Moisture Range</p>
          <MoistureBar min={minMoisture} max={maxMoisture} fillColor="#10b981" />
        </div>

        
        <div className="flex gap-2">
          <div className="conc flex-1 bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-sm font-bold">{minMoisture}%</p>
            <p className="text-[10px] text-gray-400">Min</p>
          </div>
          <div className="conc  flex-1 bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-sm font-bold">{maxMoisture}%</p>
            <p className="text-[10px] text-gray-400">Max</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {childPlants.length} {childPlants.length === 1 ? "plant" : "plants"}
        </p>
      </div>
    </div>
  );
}





/* ─── CATEGORY ROW ───────────────────────────────────────── */
function CategoryRow({ group, childPlants, onAdd, onUpdate, onDelete }) {
  const { user } = useContext(UserContext); 
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">{group.group_name}</span>

       {user?.role === "admin" && (
        <button
          onClick={() => onAdd(group)}
          className="flex items-center gap-1 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow-sm transition-colors"
        >
          + Add Plant
        </button>
      )}

      </div>


      <div className="flex flex-col-reverse md:grid md:grid-cols-[7fr_3fr] gap-4 rounded-2xl">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {childPlants.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No plants yet. Add one!</p>
          ) : (
            childPlants.map((plant) => (
              <PlantChildCard
                key={plant.plant_id}
                plant={plant}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
        <CategoryCard group={group} childPlants={childPlants} />
      </div>
    </div>
  );
}




/* ─── MAIN PAGE ──────────────────────────────────────────── */
export function PlantGroups({setPlantGroupModal,setInfoModalOpen,setInfoModalPurpose}) {
  const { user } = useContext(UserContext);
  const { plants, plantGroups, loadPlantGroups, loadPlants } = usePlantData();
  const [successMsg,setSuccessMsg] = useState("");

  useEffect(() => {
    loadPlantGroups();
    loadPlants();
  }, [loadPlantGroups, loadPlants]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  
  const groupsWithPlants = useMemo(() => {
    if (!Array.isArray(plantGroups) || !Array.isArray(plants)) return [];
    return plantGroups.map((group) => ({
      group,
      childPlants: plants.filter((plant) => plant.group_id === group.plant_group_id),
    }));
  }, [plantGroups, plants]);


  const unassignedPlants = useMemo(() => 
    plants.filter(p => !p.group_id || p.group_id === 0), 
  [plants]);

  const openAddModal = (group) => {
      setPlantGroupModal({ 
      isOpen: true, 
      mode: "insert_for_groups", 
      plantGroup: group, 
      plant: null,
      unassignedPlants});
  }
  
  const openUpdateModal = (plant) => {
    const plantGroup = plantGroups.find((g) => g.plant_group_id === plant.group_id);
    setPlantGroupModal({ isOpen: true, mode: "update_for_groups", plantGroup: plantGroup ?? null, plant });
  };
  const openDeleteModal = (plant) => {
    const plantGroup = plantGroups.find((g) => g.plant_group_id === plant.group_id);
    setPlantGroupModal({ isOpen: true, mode: "delete_for_groups", plantGroup: plantGroup ?? null, plant });
  }
 
  const handleOpenInfosPlants = () =>{
    setInfoModalOpen(true);
    setInfoModalPurpose("plant_groups")
  }
  
  return (
    
  <section className="con_main w-full  overflow-y-auto relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">
    <main className="conb plant_main_div bg-white rounded-2xl flex-1 h-full md:max-h-[540px] md:overflow-y-auto p-4 md:p-6"> 
    
        <div className="w-full flex items-center justify-start gap-4 mb-6"> 
          <h1 className="plants-text text-3xl font-bold text-[var(--metal-dark5)] ">Plants Groups</h1>
          <button 
            className='ml-2 mt-2s sm:ml-4 mt-2 sm:mt-0 flex-shrink-0' 
            onClick={handleOpenInfosPlants}>
            <CircleQuestionMark className='w-4 h-4 cursor-pointer' />
          </button>
        </div>
     
        <div className="flex flex-col gap-12h overflow-y-auto  md:h-full">
          {groupsWithPlants.map(({ group, childPlants }) => (
            <CategoryRow
              key={group.plant_group_id}
              group={group}
              childPlants={childPlants}
              onAdd={openAddModal}
              onUpdate={openUpdateModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>


      </main>
    </section>
  );



  
}