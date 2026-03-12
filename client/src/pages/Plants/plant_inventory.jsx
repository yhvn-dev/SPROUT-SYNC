import { usePlantData } from "../../hooks/plantContext"
import { useEffect,useContext} from "react"
import { UserContext } from "../../hooks/userContext";
import { Trash2, Sprout } from "lucide-react";



/* ─────────────────────────────────────────────────────────── */
export function Plant_Inventory({setPlantModal}) {
    const {user} = useContext(UserContext)     
    const {plants,loadPlants} = usePlantData();
    

    const handleOpenAddPlants = () => {
        setPlantModal(prev => {
        if (prev.isOpen) return prev; 
        return { isOpen: true, mode: "insert", plant: null };
    });
    }
    
    const handleOpenUpdatePlants = (plant) => {
        setPlantModal(prev => {
        if (prev.isOpen) return prev;  
        return { isOpen: true, mode: "update",plant };
     });
    
    }
    const handleOpenDeletePlants = (plant) => {
        setPlantModal(prev => {
        if (prev.isOpen) return prev;  
        return { isOpen: true, mode: "delete", plant };
         });
    }

  return (
    <section>

      {/* TABLE SECTION */}
      <div className="batch_history_table rounded-2xl shadow-lg h-screen  bg-white overflow-y-auto">

        {/* ── DESKTOP TABLE ─────────────────────────────────── */}
        <div className="hidden md:block overflow-x-auto overflow-y-auto">
         <div className="w-full p-4 flex items-center justify-start ">
            <div className="w-1/2">
                <span className="text-2xl ">Plants Inventory</span>
            </div>
            <div className="flex items-center flex-row-reverse justify-send w-1/2">

                <button
                    onClick={handleOpenAddPlants}
                    className="cursor-pointer
                    rounded-lg sm:rounded-xl
                    px-3 py-1.5 sm:px-4 sm:py-2
                    text-xs sm:text-sm
                    shadow-md
                    bg-[var(--sancgb)]
                    text-[var(--main-white)]
                    w-full ml-4 sm:w-auto
                    ">
                    Add Plants
                </button>
          
                <select name="Filter Plant Data">
                    <option value="">Filter Plant Data</option>
                    <option value="name">Plant Name</option>
                    <option value="min_moisture">Min Miosture</option>
                    <option value="max_moisture">Max Moisture</option>
                    <option value="created_at">Date</option>
                </select>
            </div>
            
         </div>


          <table className="w-full overflow-y-auto">

            <thead className="overflow-y-auto">
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
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">
                  Actions
                </th>
              </tr>            
            </thead>


            <tbody className="divide-y divide-gray-200">
                {plants.map((p, index) => (
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
                    
                    <td className="px-4 py-3 text-sm text-center">
                        <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => handleOpenUpdatePlants(p)}
                            className="
                            cursor-pointer
                            text-xs
                            px-2.5 py-1
                            rounded-md
                            bg-[var(--purpluish--)]
                            text-white
                            shadow
                            hover:shadow-md
                            transition
                            "
                            >
                            UPDATE
                        </button>
                    
                    
                            <button
                            onClick={() => handleOpenDeletePlants(p)}
                            className="
                                cursor-pointer
                                text-xs
                                px-2.5 py-1
                                rounded-md
                                bg-[var(--color-danger-a)]
                                text-white
                                shadow
                                hover:shadow-md
                                transition">
                            DELETE
                            </button>
                        </div>
                      


                    </td>                
                </tr>
                ))}
            </tbody>

            
          </table>
        </div>


        {/* ── MOBILE LIST ────────────────────────────────────── */}
        <div className="md:hidden">
          {plants.map((p,index) => (
            <div
              key={p.plant_id}
              className="batch_history_table_mobile_box border-b border-gray-200 p-4 hover:bg-[#E8F3ED] transition-colors">                

                {/* Plant Name */}
                <td className="px-4 py-3 text-sm font-medium text-[#027c68] flex">
                    <p>{p.name}</p>
                </td>

            </div>
          ))}
        </div>


        {/* ── EMPTY STATE ────────────────────────────────────── */}
        {plants.length === 0 && (
          <div className="text-center flex items-center flex-col justify-center  py-12 text-gray-500">
            <Sprout size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No plants found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}

      </div>

      
    </section>
  );
}