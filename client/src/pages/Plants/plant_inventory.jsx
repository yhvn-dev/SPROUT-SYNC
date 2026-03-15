import { usePlantData } from "../../hooks/plantContext"
import { useEffect, useContext, useState } from "react"
import { UserContext } from "../../hooks/userContext";
import { Sprout, Search } from "lucide-react";

/* ─────────────────────────────────────────────────────────── */
export function Plant_Inventory({setPlantModal}) {
    const {user} = useContext(UserContext)     
    const {plants,sensors} = usePlantData();
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState("");

    const handleOpenAddPlants = () => {
        setPlantModal(prev => {
            if (prev.isOpen) return prev; 
            return { isOpen: true, mode: "insert", plant: null };
        });
    }
    
    const handleOpenUpdatePlants = (plant) => {
        setPlantModal(prev => {
            if (prev.isOpen) return prev;  
            return { isOpen: true, mode: "update", plant };
        });
    }

    const handleOpenDeletePlants = (plant) => {
        setPlantModal(prev => {
            if (prev.isOpen) return prev;  
            return { isOpen: true, mode: "delete", plant };
        });
    }

    // SEARCH — filter by name
    const searchedPlants = plants.filter((p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // SORT — sort based on selected category
    const filteredPlants = [...searchedPlants].sort((a, b) => {
        if (!sortBy) return 0;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "min_moisture") return a.moisture_min - b.moisture_min;
        if (sortBy === "max_moisture") return a.moisture_max - b.moisture_max;
        if (sortBy === "created_at") return new Date(a.created_at) - new Date(b.created_at);
        return 0;
    });



    
  return (
    <>
      <div className="plant_main_div rounded-2xl shadow-lg  h-full md:h-[95%] overflow-y-auto">

        <div className="conb hidden md:flex items-center  rounded-2xl justify-center flex-col overflow-x-auto overflow-y-auto">
         <div className="conb plant_invent_header w-full p-4 flex items-center justify-start">
            <div className="w-1/2">
                <span className="plants-text text-3xl font-bold text-[var(--metal-dark5)]">Plants Inventory</span>
            </div>

            <div className="flex items-center justify-end w-1/2 gap-2">
                <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search plant..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-48"
                    />
                </div>


                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm">
                    <option value="">Sort By</option>
                    <option value="name">Plant Name (A-Z)</option>
                    <option value="min_moisture">Min Moisture</option>
                    <option value="max_moisture">Max Moisture</option>
                    <option value="created_at">Date Added</option>
                </select>

                <button
                    onClick={handleOpenAddPlants}
                    className="cursor-pointer
                    rounded-lg sm:rounded-xl
                    px-3 py-1.5 sm:px-4 sm:py-2
                    text-xs sm:text-sm
                    shadow-md
                    bg-[var(--sancgb)]
                    text-[var(--main-white)]
                    whitespace-nowrap">
                    Add Plants
                </button>
            </div>

         </div>


         

          <table className="conb pi_table w-full overflow-y-auto">
            <thead className="plant_invent_tb_header overflow-y-auto">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">
                  Plant Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">
                   Minimum Moisture
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">
                    Maximum Moisture
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">
                    Created At
                </th>           

                {user?.role === "admin" && (                 
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">
                    Actions
                </th>         
                )}   
          
              </tr>            
            </thead>

            <tbody className="conb divide-y divide-gray-200">
                {filteredPlants.map((p, index) => (
                    <tr
                    key={p.plant_id}
                    className={`pbh_tr hover:bg-[#E8F3ED] transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    >
                    <td className="px-4 py-3 text-sm font-medium text-[#027c68]">
                        {p.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#027c68]">
                        {p.moisture_min}%
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#027c68]">
                        {p.moisture_max}%
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#027c68]">
                       {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    {user.role === "admin" && (        
                      <div className="flex items-center justify-center gap-4 mt-2">
                        <button
                            onClick={() => handleOpenUpdatePlants(p)}
                            className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--purpluish--)] text-white shadow hover:shadow-md transition">
                            UPDATE
                        </button>
                        <button
                          onClick={() => handleOpenDeletePlants(p)}
                          className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--color-danger-a)] text-white shadow hover:shadow-md transition">
                          DELETE
                        </button>
                      </div>               
                    )}     
                    
                </tr>
                ))}
            </tbody>    
          </table>
        </div>




        {/* ── MOBILE LIST ────────────────────────────────────── */}
        <div className="conb md:hidden">

            {/* Mobile Search + Sort */}
            <div className=" p-4 flex flex-col gap-2">
                <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search plant..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-full"
                    />
                </div>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm w-full">
                    <option value="">Sort By</option>
                    <option value="name">Plant Name (A-Z)</option>
                    <option value="min_moisture">Min Moisture</option>
                    <option value="max_moisture">Max Moisture</option>
                    <option value="created_at">Date Added</option>
                </select>
                <button
                    onClick={handleOpenAddPlants}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-sm shadow-md bg-[var(--sancgb)] text-[var(--main-white)] w-full">
                    Add Plants
                </button>
            </div>

          {filteredPlants.map((p, index) => (
            <div
              key={p.plant_id}
              className="batch_history_table_mobile_box border-b border-gray-200 p-4 hover:bg-[#E8F3ED] transition-colors">                
                <p className="text-sm font-medium text-[#027c68]">{p.name}</p>
                <p className="text-sm font-medium text-[#027c68]">Min: {p.moisture_min}%</p>
                <p className="text-sm font-medium text-[#027c68]">Max: {p.moisture_max}%</p>
                <p className="text-sm font-medium text-[#027c68]">{new Date(p.created_at).toLocaleDateString()}</p>


                {user.role === "admin" && (        
                    <div className="flex items-end justify-end md:items-center md:justify-center gap-4 mt-2">
                      <button
                          onClick={() => handleOpenUpdatePlants(p)}
                          className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--purpluish--)] text-white shadow hover:shadow-md transition">
                          UPDATE
                      </button>
                      <button
                        onClick={() => handleOpenDeletePlants(p)}
                        className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--color-danger-a)] text-white shadow hover:shadow-md transition">
                        DELETE
                      </button>
                    </div>               
                 )}

                
            </div>
          ))}
        </div>

        {/* ── EMPTY STATE ────────────────────────────────────── */}
        {filteredPlants.length === 0 && (
          <div className="conb h-full  flex items-center flex-col justify-center  text-gray-500">
            <Sprout size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No plants found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}

      </div>    
    </>
  );
}