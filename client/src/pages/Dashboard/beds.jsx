import { Droplet, Activity } from "lucide-react";

export function BedLayout() {


  
  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-max px-6 py-8">
        <div className="relative rounded-xl p-6 shadow-lg bg-[var(--sage-lighter)] border-[var(--sage-light)] my-4">
          
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center justify-start">
              <h3 className="text-sm font-semibold tracking-wide text-[var(--sancga)]">
                BED_001 - MONITORING
              </h3>
              <div className="text-sm px-3 py-1 mx-4 rounded-full bg-[var(--sage-medium)] text-[var(--sage-dark)]">
                6 Zones Active
              </div>
            </div>
            <div>
              <p className="text-sm bg-amber-100 text-[var(--acc-darkc)] font-medium px-3 py-1 rounded-2xl">Tomato Bed</p>
            </div>
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
                  68.5
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
              <div className="text-3xl font-bold text-[var(--sancgd)]">6.7</div>
            </div>

            <div className="rounded-lg p-4 shadow-md bg-white border-2 border-[var(--sage-lighter)]">
              <div className="text-sm font-medium text-[var(--acc-darka)] mb-2">Threshold</div>
              <div className="text-3xl font-bold text-[var(--sage-dark)]">
                60%
              </div>
            </div>
          </div>

          {/* Sensor Cards Grid */}
          <div className="grid grid-cols-6 gap-4">
            {/* Sensor Card 1 */}
            <div className="relative rounded-lg p-4 shadow-lg transition-all hover:shadow-xl bg-white border border-[var(--sage-light)]">
              <div className="absolute -top-3 left-3 px-2 py-1 rounded text-sm font-semibold bg-[var(--sancgb)] text-white">
                Zone A1
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
                      65
                    </span>
                    <span className="text-sm text-[var(--acc-darkb)]">%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--sage-lighter)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `65%`,
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
                    6.5
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(14)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-sm"
                        style={{
                          backgroundColor:
                            i < 7 ? "var(--sancgd)" : "var(--sage-lighter)",
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
                        backgroundColor: "var(--sancgc)",
                      }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: "var(--sage-dark)",
                      }}
                    >
                      Optimal
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sensor Card 2 */}
            <div className="relative rounded-lg p-4 shadow-lg transition-all hover:shadow-xl bg-white border border-[var(--sage-light)]">
              <div className="absolute -top-3 left-3 px-2 py-1 rounded text-sm font-semibold bg-[var(--sancgb)] text-white">
                Zone A2
              </div>
              <div className="mt-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Droplet size={14} style={{ color: "var(--sancgb)" }} />
                    <span className="text-sm font-medium text-[var(--acc-darka)]">
                      Moisture
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[var(--sancgb)]">
                      72
                    </span>
                    <span className="text-sm text-[var(--acc-darkb)]">%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--sage-lighter)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `72%`,
                        backgroundColor: "var(--sancgb)",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity size={14} style={{ color: "var(--sancgd)" }} />
                    <span className="text-sm font-medium text-[var(--acc-darka)]">
                      pH Level
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[var(--sancgd)]">
                    6.8
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(14)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-sm"
                        style={{
                          backgroundColor:
                            i < 7 ? "var(--sancgd)" : "var(--sage-lighter)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--sage-light)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--acc-darkc)]">Status</span>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: "var(--sancgc)",
                      }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: "var(--sage-dark)",
                      }}
                    >
                      Optimal
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add more sensor cards as needed */}
            {/* You can duplicate the sensor card structure above for more zones */}
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