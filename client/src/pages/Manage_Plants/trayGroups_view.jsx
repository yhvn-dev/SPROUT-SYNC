import { Sprout, ChevronDown, ChevronUp, Plus, Pencil, Trash2, Droplet, Wifi } from "lucide-react";
import { getSensorStatus } from "../../utils/colors";

function TrayGroups_View({
  sortedTrayGroups,
  expandedZones,
  toggleZone,
  trays,
  batches,
  sensors,
  latestReadings,
  handleAddTrayGroup,
  handleUpdateTrayGroup,
  handleDeleteTrayGroup,
  handleAddTray,
  handleUpdateTray,
  handleDeleteTray,
  handleAddBatch,
}) {
    
  const getTraySensors = (tray_id) =>
    sensors.filter(s => s.tray_id === tray_id);
  const getSensorReading = (sensor_id) =>
    latestReadings.find(r => r.sensor_id === sensor_id);

  const groupHasSensors = (tray_group_id) => {
    const groupTrays = trays.filter(t => t.tray_group_id === tray_group_id);
    return groupTrays.some(tray => sensors.some(s => s.tray_id === tray.tray_id));
  };

  return (
    <section className="rounded-2xl overflow-y-hidden grid grid-cols-1 gap-4">
      {sortedTrayGroups.length === 0 && (
        <div className="conb flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-3xl shadow-sm">
          <Sprout size={48} className="mb-3 opacity-50" />
          <p className="text-lg font-medium">No Tray Groups found</p>
          <p className="text-sm mb-4">Create a tray group to get started</p>
          <button
            onClick={handleAddTrayGroup}
            className="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-xl bg-[#7BA591] text-white text-sm font-semibold shadow hover:opacity-90 transition">
            <Plus size={14} /> Add Tray Group
          </button>
        </div>
      )}

      {sortedTrayGroups.map((group) => {
        const isExpanded = expandedZones[group.tray_group_id];
        const groupTrays = trays.filter(t => t.tray_group_id === group.tray_group_id);

        return (
          <div key={group.tray_group_id} className="conb bg-white rounded-3xl shadow-lg overflow-hidden w-full">

            {/* TG Header */}
            <div
              className="tg_data_main p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors "
              onClick={() => toggleZone(group.tray_group_id)}>          
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A8C7B8] to-[#7BA591] flex items-center justify-center flex-shrink-0">
                    <Sprout className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      [{group.group_number}] {group.tray_group_name} Group
                    </h2>
                    <div className="flex gap-3 flex-wrap">
                      <span className="text-xs text-gray-500">{group.location}</span>
                      <span className="text-xs text-gray-500">Trays: {groupTrays.length}</span>
                      <span className="text-xs text-gray-500">Moisture: {group.min_moisture}% – {group.max_moisture}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleAddTray(e, group)}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--sage)] hover:bg-[var(--sancgb)] text-white text-xs font-semibold shadow hover:opacity-90 transition">
                    <Plus size={12} /> Tray
                  </button>
                  <button
                    onClick={(e) => handleUpdateTrayGroup(e, group)}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--purpluish--)]  hover:bg-[var(--bluis--)] text-white text-xs font-semibold shadow hover:opacity-90 transition">
                    <Pencil size={12} /> Update
                  </button>

                  {/* DELETE TRAY GROUP — hidden if any tray inside has a sensor */}
                  {!groupHasSensors(group.tray_group_id) && (
                    <button
                      onClick={(e) => handleDeleteTrayGroup(e, group)}
                      className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-danger-a)] hover:bg-red-500 text-white text-xs font-semibold shadow hover:opacity-90 transition">
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                                      
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleZone(group.tray_group_id);
                      }}
                      className="cursor-pointer traygroups-dropdown w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center ml-1 hover:bg-gray-200 transition">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                    </div>


                </div>
              </div>
            </div>





            {/* Trays List */}
            {isExpanded && (
              <div className="px-4 sm:px-6 pb-5 pt-1">
                {groupTrays.length === 0 ? (
                  <div className="no_trays_div flex flex-col items-center justify-center py-8 text-gray-400 bg-[#f9fdfb] rounded-2xl border border-dashed border-[#A8C7B8]">
                    <Sprout size={32} className="mb-2 opacity-40" />
                    <p className="text-sm font-medium">No trays yet</p>
                    <button
                      onClick={(e) => handleAddTray(e, group)}
                      className="cursor-pointer mt-3 flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#7BA591] hover:bg-[var(--sancgb)] text-white text-xs font-semibold shadow hover:opacity-90 transition">
                      <Plus size={12} /> Add Tray
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groupTrays.map((tray, index) => {
                      const trayBatches = batches.filter(b => b.tray_id === tray.tray_id);
                      const traySensors = getTraySensors(tray.tray_id);

                      return (
                        <div key={tray.tray_id} className="con_c tray_list_div bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] rounded-2xl p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">
                                Tray {index + 1} - [{tray.tray_number}] {tray.plant}
                              </h3>
                              <p className="text-xs text-gray-600">{tray.status}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {trayBatches.length} batch{trayBatches.length !== 1 ? "es" : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                              <button
                                onClick={() => handleAddBatch(tray)}
                                title="Add Batch"
                                className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-br from-[#92e6a7] to-[#25a244] text-white text-xs font-semibold shadow hover:opacity-90 transition">
                                <Plus size={11} /> Batch
                              </button>
                              <button
                                onClick={() => handleUpdateTray(tray)}
                                title="Update Tray"
                                className="cursor-pointer p-1.5 rounded-lg bg-[var(--purpluish--)] hover:bg-[var(--bluis--)] text-white shadow hover:opacity-90 transition">
                                <Pencil size={12} />
                              </button>

                              {/* DELETE TRAY — hidden if tray has sensors linked to it */}
                              {traySensors.length === 0 && (
                                <button
                                  onClick={() => handleDeleteTray(tray)}
                                  title="Delete Tray"
                                  className="cursor-pointer p-1.5 rounded-lg bg-[var(--color-danger-a)] hover:bg-[var(--color-danger-b)] text-white shadow hover:opacity-90 transition">
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>

                          {traySensors.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {traySensors.map((sensor) => {
                                const reading = getSensorReading(sensor.sensor_id);
                                const isActive = sensor.status === "Active";
                                const rawValue = reading?.value ?? null;

                                // Status based on group thresholds
                                const getStatus = () => {
                                  if (!isActive) return { label: "Inactive", color: "#9CA3AF"};
                                  if (rawValue === null) return { label: "No Reading", color: "#9CA3AF"};
                                  if (sensor.sensor_type === "moisture") {
                                    if (rawValue < group.min_moisture) return { label: "Dry", color: "#EF4444" };
                                    if (rawValue > group.max_moisture) return { label: "Wet", color: "#F59E0B" };
                                    return { label: "Optimal", color: "#22C55E", emoji: "🌿" };
                                  }
                                  return { label: "Active", color: "#3B82F6", emoji: "✅" };
                                };

                                const status = getStatus();
                                // Droplet icon color follows moisture status
                                const getMoistureIconColor = () => {
                                  if (sensor.sensor_type !== "moisture") return "#6B7280";
                                  if (!isActive || rawValue === null) return "#9CA3AF";
                                  if (rawValue < group.min_moisture) return "#EF4444"; // red — dry
                                  if (rawValue > group.max_moisture) return "#F59E0B"; // amber — wet
                                  return "#22C55E"; // green — optimal
                                };

                                const iconColor = getMoistureIconColor();

                                const sensorConfig = {
                                  moisture: {
                                    icon: <Droplet className="w-5 h-5" />,
                                    unit: "%",
                                    label: "Moisture Sensor",
                                  }
                                };

                                const config = sensorConfig[sensor.sensor_type] ?? {
                                  icon: <Wifi className="w-5 h-5" />,
                                  unit: "",
                                  label: sensor.sensor_type.replace(/_/g, " "),
                                };

                                return (
                                  <div
                                    key={sensor.sensor_id}
                                    className="sensor_div bg-white rounded-xl p-3 shadow-sm w-full">
                                    <div className="flex items-center justify-between">

                                      {/* Icon — color follows moisture status */}
                                      <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${iconColor}18` }}>
                                        <span style={{ color: iconColor }}>
                                          {config.icon}
                                        </span>
                                      </div>

                                      {/* Label + Value */}
                                      <div className="flex-1 mx-3">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">{config.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                          {rawValue !== null ? `${rawValue}${config.unit}` : "—"}
                                        </p>
                                      </div>

                                      {/* Status pill with emoji */}
                                      <div
                                        className="px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 flex items-center gap-1"
                                        style={{ backgroundColor: `${status.color}18`, color: status.color }}>
                                        <span>{status.emoji}</span>
                                        <span>{status.label}</span>
                                      </div>

                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default TrayGroups_View;