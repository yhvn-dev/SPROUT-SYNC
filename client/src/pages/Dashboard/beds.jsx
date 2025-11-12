import { Droplet, Activity,SquarePen } from "lucide-react";
import { useState } from "react";

export function BedMonitor({ bedNum = "bed_1", bedName = "Bed 1" ,setOpenTModal}) {
  const [threshold, setThreshold] = useState(60);


  
  // Sample data for multiple beds
  const sensorData = {
    bed_1: [
      { zone: "A1", moisture: 65, ph: 6.5 },
      { zone: "A2", moisture: 72, ph: 6.8 },
      { zone: "A3", moisture: 58, ph: 6.3 },
      { zone: "A4", moisture: 68, ph: 6.7 },
      { zone: "A5", moisture: 75, ph: 7.0 },
      { zone: "A6", moisture: 62, ph: 6.4 },
    ],
    bed_2: [
      { zone: "B1", moisture: 55, ph: 6.2 },
      { zone: "B2", moisture: 63, ph: 6.6 },
      { zone: "B3", moisture: 60, ph: 6.8 },
    ],
    bed_3: [
      { zone: "C1", moisture: 70, ph: 6.9 },
      { zone: "C2", moisture: 73, ph: 7.0 },
    ],
  };

  const handleOpenModal = () =>{
      

  }

  

  const bedData = sensorData[bedNum] || [];
  const avgMoisture = (bedData.reduce((sum, s) => sum + s.moisture, 0) / bedData.length).toFixed(1);
  const avgPh = (bedData.reduce((sum, s) => sum + s.ph, 0) / bedData.length).toFixed(2);

  // const handleThresholdChange = () => {
  //   const newThreshold = prompt(`Set new moisture threshold for ${bedName}`, threshold);
  //   if (newThreshold && !isNaN(newThreshold)) {
  //     setThreshold(parseFloat(newThreshold));
  //   }
  // };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-max px-6 py-8">
        <div
          className="relative rounded-xl p-6 shadow-lg bg-[var(--sage-lighter)] border-[var(--sage-light)]">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center justify-start">
              <h3 className="text-sm font-semibold tracking-wide text-[var(--sancga)]">
                {bedName.toUpperCase()} - MONITORING
              </h3>
              <div className="text-sm px-3 py-1 mx-4 rounded-full bg-[var(--sage-medium)] text-[var(--sage-dark)]">
                {bedData.length} Zones Active
              </div>
            </div>
            <button
              onClick={() => setOpenTModal(true)}
              className="center border-1 border-[var(--sage)] text-[var(--accd-darkb)] rounded-lg px-4 py-2 hover:bg-[var(--sancgb)] hover:text-white transition"
            > 
              <SquarePen size={18} className="mr-2"/>
              Modify
            </button>
          </div>




          {/* Average Readings */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            
            <div className="rounded-lg p-4 shadow-md bg-white border-2 border-[var(--sage)]">
              <div className="flex items-center gap-2 mb-2">
                <Droplet size={18} style={{ color: "var(--sancgb)" }} />
                <span className="text-sm font-medium text-[var(--acc-darka)]">
                  Avg Moisture
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[var(--sancgb)]">
                  {avgMoisture}
                </span>
                <span className="text-lg text-[var(--acc-darkb)]">%</span>
              </div>
            </div>

            <div className="rounded-lg p-4 shadow-md bg-white border-2 border-[var(--sage-light)]">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} style={{ color: "var(--sancgd)" }} />
                <span className="text-sm font-medium text-[var(--acc-darka)]">
                  Avg pH
                </span>
              </div>
              <div className="text-3xl font-bold text-[var(--sancgd)]">{avgPh}</div>
            </div>

            <div className="rounded-lg p-4 shadow-md bg-white border-2 border-[var(--sage-lighter)]">
              <div className="text-sm font-medium text-[var(--acc-darka)] mb-2">Threshold</div>
              <div className="text-3xl font-bold text-[var(--sage-dark)]">
                {threshold}%
              </div>
            </div>
          </div>

          {/* Sensor Cards */}
          <div className="grid grid-cols-6 gap-4">
            {bedData.map((sensor, index) => (
              <div
                key={index}
                className="relative rounded-lg p-4 shadow-lg transition-all hover:shadow-xl bg-white border border-[var(--sage-light)]"
              >
                <div className="absolute -top-3 left-3 px-2 py-1 rounded text-sm font-semibold bg-[var(--sancgb)] text-white">
                  {sensor.zone}
                </div>
                <div className="mt-4 space-y-3">
                  {/* Moisture */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Droplet size={14} style={{ color: "var(--sancgb)" }} />
                      <span className="text-sm font-medium text-[var(--acc-darka)]">
                        Moisture
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[var(--sancgb)]">
                        {sensor.moisture}
                      </span>
                      <span className="text-sm text-[var(--acc-darkb)]">%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--sage-lighter)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${sensor.moisture}%`,
                          backgroundColor: "var(--sancgb)",
                        }}
                      />
                    </div>
                  </div>

                  {/* pH */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Activity size={14} style={{ color: "var(--sancgd)" }} />
                      <span className="text-sm font-medium text-[var(--acc-darka)]">
                        pH Level
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--sancgd)]">
                      {sensor.ph}
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(14)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-1.5 rounded-sm"
                          style={{
                            backgroundColor:
                              i < Math.round(sensor.ph)
                                ? "var(--sancgd)"
                                : "var(--sage-lighter)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-3 pt-3 border-t border-[var(--sage-light)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--acc-darkc)]">Status</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            sensor.moisture > threshold
                              ? "var(--sancgc)"
                              : "#f59e0b",
                        }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{
                          color:
                            sensor.moisture > threshold
                              ? "var(--sage-dark)"
                              : "#f59e0b",
                        }}
                      >
                        {sensor.moisture > threshold ? "Optimal" : "Low"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[var(--sage-light)]">
            <div className="h-3 rounded-full bg-[var(--sage-dark)] opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
}

