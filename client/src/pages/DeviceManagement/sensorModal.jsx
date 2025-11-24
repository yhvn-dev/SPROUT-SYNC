import { useState, useEffect } from "react";
import { X, Plus, Edit, Delete, Droplet, Activity } from "lucide-react";
import * as sensorServices from "../../data/sensorServices";

function SensorModal({ isSensorOpen, onSensorClose, sensorMode, selectedBed, selectedSensor, loadBedData,scsMsg }) {
  const [formDataSensor, setFormDataSensor] = useState({
    bed_id: 0,
    sensor_type: "",
    sensor_name: "",
    sensor_code: "",
    unit: ""
  });
  
  
  useEffect(() => {
    try {
      const sensor = Array.isArray(selectedSensor) ? selectedSensor[0] : selectedSensor;

      if (sensorMode === "insert") {
        setFormDataSensor({
          bed_id: selectedBed?.bed_id,
          sensor_type: "",
          sensor_name: "",
          sensor_code: "",
          unit: ""
        });
      } else if (sensorMode === "update") {
        setFormDataSensor({
          bed_id: sensor?.bed_id,
          sensor_type: sensor?.sensor_type || "",
          sensor_name: sensor?.sensor_name || "",
          sensor_code: sensor?.sensor_code || "",
          unit: sensor?.unit || ""
        });
      } else if (sensorMode === "delete") {
        setFormDataSensor({
          bed_id: sensor?.bed_id,
          sensor_type: sensor?.sensor_type || "",
          sensor_name: sensor?.sensor_name || ""
        });
      }
    } catch (error) {
      console.error("Error Displaying Sensor Data to the Input", error);
    }
  }, [sensorMode, isSensorOpen, selectedBed, selectedSensor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataSensor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (sensorMode === "insert") {
          await sensorServices.insertSensors(formDataSensor);
          loadBedData();
          onSensorClose(true);
          scsMsg(`${capitalizeFirstLetter(formDataSensor.sensor_type)} Added Successfully`);
      } else if (sensorMode === "update") {
          await sensorServices.updateSensors(formDataSensor,selectedSensor.sensor_id);
          onSensorClose(true);
          scsMsg(`${capitalizeFirstLetter(formDataSensor.sensor_type)} Updated Successfully`);
      } else {
          await sensorServices.deleteSensors(selectedSensor.sensor_id);
          loadBedData();
          onSensorClose(true);
          scsMsg(`${capitalizeFirstLetter(formDataSensor.sensor_type)} Deleted Successfully`);
      }

    } catch (error) {
      console.error("Error Submitting Sensor Data", error);
    }

  };

  const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

  if (!isSensorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-2xl">
      <main className="rounded-xl overflow-hidden w-[45%] bg-white">
        {/* Header */}
        <header className={`flex items-center justify-between p-6 rounded-t-xl ${
          sensorMode === "insert"
            ? "bg-[var(--sage-light)]"
            : sensorMode === "update"
            ? "bg-[var(--white-blple--)]"
            : "bg-red-100"
        }`}>
          <div className="flex items-center gap-3">
            {sensorMode === "insert" ? <Plus stroke="white" /> : sensorMode === "update" ? <Edit stroke="white" /> : <Delete fill="rgb(53,53,53,0.2)" stroke="white" />}
            <h2 className={`text-xl font-semibold ${sensorMode === "delete" ? "text-[var(--metal-dark4)]" : "text-white"}`}>
              {sensorMode === "insert" ? "Add New Sensor" : sensorMode === "update" ? "Update Sensor" : "Delete Sensor"}
            </h2>
          </div>
          <button onClick={onSensorClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>

        {sensorMode === "delete" ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-xl">
            <p className="text-2xl mt-12 mb-6">Are you sure?</p>
            <p className="text-sm mb-12 text-[var(--metal-dark4)]">Are you sure you want to delete {selectedSensor.sensor_code}?</p>
            <div className="flex w-full justify-center gap-4">
              <button onClick={onSensorClose} className="flex-1 px-4 py-2.5 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] font-semibold text-[0.9rem]">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-[var(--color-danger-b)] text-white rounded-lg hover:shadow-lg font-semibold text-[0.9rem]">Delete</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-6">
            
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="bed_id"
                placeholder="Bed ID"
                value={formDataSensor.bed_id}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
                required
              />
              <input
                type="text"
                name="sensor_name"
                placeholder="Sensor Name"
                value={formDataSensor.sensor_name}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
              <input
                type="text"
                name="sensor_code"
                placeholder="Sensor Code"
                value={formDataSensor.sensor_code}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              <select
                name="sensor_type"
                value={formDataSensor.sensor_type}
                onChange={handleChange}
                className="px-4 py-2 shadow-lg bg-gray-200 w-full rounded-lg">
                  
              <option value="">Sensor Type</option>
              {["ph", "moisture", "humidity", "temperature"].map((type) => (
                <option key={type} value={type}>
                  {capitalizeFirstLetter(type)}
                </option>
              ))}
              
            </select>
              <select
                name="unit"
                value={formDataSensor.unit}
                onChange={handleChange}
                className="px-4 py-2 shadow-lg bg-gray-200 w-full rounded-lg"
              >
                <option value="">Unit</option>
                <option value="%">Moisture / Humidity - %</option>
                <option value="°C">Temperature - °C</option>
                <option value="cm">Water Level - cm</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={onSensorClose} className="px-4 py-2.5 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] font-semibold">Cancel</button>
              <button type="submit" className={`px-4 py-2.5 rounded-lg hover:shadow-lg font-semibold text-white ${sensorMode === "insert" ? "bg-gradient-to-r from-[var(--ptl-greenb)] to-[var(--ptl-greenc)]" : "bg-[var(--white-blple--)] text-black"}`}>
                {sensorMode === "insert" ? "Add Sensor" : "Update Sensor"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default SensorModal;
