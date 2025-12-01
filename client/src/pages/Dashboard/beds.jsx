import { useState,useEffect } from "react";
import { Droplet, Activity } from "lucide-react";
import * as readingService from "../../data/readingsServices"



export function BedLayout({ beds, sensors }) {
   const [readings,setReadings] = useState([]);

    useEffect(() =>{
         const loadReadings = async () => {
            try {
            const data = await readingService.fetchAllReadings(); 
            setReadings(data); 
            } catch (err) {
            console.error("Error loading readings", err);
            }
         };

        loadReadings()
    },[])

    const readingsMap = readings.reduce((acc, r) => {
        acc[r.sensor_id] = r.value;
        return acc;
    }, {});


  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-max px-6 py-8 ">
        <div className="flex flex-col justify-start w-full relative rounded-xl shadow-lg bg-[var(--main-whiteb)] border-[var(--sage-light)] my-4">

          {/* BEDS MAIN */}
          <main className="flex flex-col items-start justify-center ">

            {beds?.length > 0 && beds.map((b) => (
              <ol key={b.bed_id} className="flex flex-col items-start justify-start w-full  my-4  p-4   rounded-xl overflow-hidden shadow-2xl bg-[var(--sage-lighter)]">

               <div className="my-10 flex items-center justify-between w-full">
                <div className="flex items-center justify-start">
                  <h3 className="text-sm font-semibold tracking-wide text-[var(--sancga)]">
                    {b.bed_code} - MONITORING
                  </h3>
                  <div className="text-sm px-3 py-1 mx-4 rounded-full bg-[var(--sage-medium)] text-[var(--sage-dark)]">
                    {b.sensorCount} Zones Active
                  </div>
                  {/* AVERAGE READING */}
                  <div className="text-sm px-3 py-1 mx-2 rounded-full bg-[var(--acc-light)] text-[var(--acc-darkc)]">
                    Avg: {(
                      sensors
                        .filter(s => s.bed_id === b.bed_id)
                        .reduce((sum, s) => sum + (readingsMap[s.sensor_id] ?? 0), 0) /
                      sensors.filter(s => s.bed_id === b.bed_id).length
                    ).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center justify-end flex-row-reverse">
                  <button className="mx-8 text-sm px-3 py-1 rounded-full cursor-pointer border-1  text-[var(--sage-dark)]">
                    Modify
                  </button>

                  <p className="text-sm bg-amber-100 text-[var(--acc-darkc)] font-medium px-3 py-1 rounded-2xl">
                    {b.bed_name}
                  </p>
                </div>



              </div>

                {/* SENSOR GRID */}
                <div className="grid grid-cols-1 gap-6 w-full">

                  {/* ✅ NON-PH SENSORS */}
                  <div className="flex items-center justify-start gap-4 flex-wrap">
                    {sensors
                      ?.filter(s => s.bed_id === b.bed_id && s.sensor_type !== "ph")
                      .map((s) => (
                        <div
                          key={s.sensor_id}
                          className="relative rounded-lg p-4 shadow-lg bg-white border border-[var(--sage-light)] w-40"
                        >
                          {/* SENSOR LABEL */}
                          <div className="absolute -top-3 left-3 px-2 py-1 rounded text-sm font-semibold bg-[var(--sancgb)] text-white">
                            {s.sensor_code}
                          </div>

                          {/* SENSOR DATA */}
                          <div className="mt-4 space-y-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Droplet size={14} />
                                <span className="text-sm font-medium text-[var(--acc-darka)]">
                                  {s.sensor_type}
                                </span>
                              </div>

                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-[var(--sancgb)]">
                                 {readingsMap[s.sensor_id] ?? "--"}
                                </span>
                                <span className="text-sm text-[var(--acc-darkb)]">
                                  {s.unit}
                                </span>
                              </div>

                              <div className="w-full h-1.5 rounded-full bg-[var(--sage-lighter)] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[var(--sancgb)]"
                                  style={{ width: "65%" }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* STATUS */}
                          <div className="mt-3 pt-3 border-t border-[var(--sage-light)]">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[var(--acc-darkc)]">Status</span>
                              <span className="text-sm font-medium text-[var(--sage-dark)]">
                                {s.status} 
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* ✅ PH SENSOR */}
                  <div className="flex items-center justify-center w-full p-4 rounded-xl shadow-lg bg-white">
                    {sensors
                      ?.filter(s => s.bed_id === b.bed_id && s.sensor_type === "ph")
                      .map(ph => (
                        <div
                          key={ph.sensor_id}
                          className="relative flex flex-col items-center justify-center shadow-lg border-2 border-[#009983] p-4 rounded-2xl"
                        >
                                                
                          {/* SENSOR LABEL */}
                          <div className="absolute -top-3 left-3 px-2 py-1 rounded text-sm font-semibold bg-[var(--sancgb)] text-white">
                              {ph.sensor_code}
                          </div>
                      
                          <ul className="center-l mt-2">
                              <Activity size={14}/>                                                          
                              <li className="mx-2">{ph.sensor_type}</li>
                          </ul>
                        
                          <span className="text-2xl font-bold text-[var(--sancgb)]">
                            {readingsMap[ph.sensor_id] ?? "--"}
                          </span>

                          {/* pH RANGE BAR */}
                          <div className="w-full h-1.5 rounded-full bg-[var(--sage-lighter)] overflow-hidden mt-2">
                              <div className="h-full rounded-full transition-all bg-[var(--sancgd)] w-[65%]" />
                          </div>
            



                        </div>
                      ))}
                  </div>

                </div>

              </ol>
            ))}

          </main>
        </div>
      </div>
    </div>
  );
}
