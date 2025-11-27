import { useState, useEffect } from "react";
import { X, Plus, Edit, Delete, Droplet, Activity } from "lucide-react";
import * as sensorServices from "../../data/sensorServices";

function SensorModal({ isSensorOpen, onSensorClose, sensorMode, selectedBed, selectedSensor, loadBedData, scsMsg }) {
  const [formDataSensor, setFormDataSensor] = useState({
    bed_id: 0,
    sensor_type: "",
    sensor_code: "",
    unit: ""
  });

  const [formError, setFormError] = useState([]);

  // Function to extract just the number from existing sensor_code
  const extractSensorCodeNumber = (sensorCode) => {
    if (!sensorCode) return "";
    const match = sensorCode.match(/\d+/);
    return match ? match[0] : "";
  };

  // Function to format sensor code based on sensor type
  const formatSensorCode = (type, number) => {
    if (!type || !number) return "";
    
    const prefixMap = {
      'moisture': 'MOIST-',
      'temperature': 'TEMP-',
      'humidity': 'HUM-',
      'ph': 'PH-'
    };
    
    const prefix = prefixMap[type] || 'SENSOR-';
    return `${prefix}${number}`;
  };

  // Function to get prefix based on sensor type
  const getSensorPrefix = (type) => {
    const prefixMap = {
      'moisture': 'MOIST-',
      'temperature': 'TEMP-',
      'humidity': 'HUM-',
      'ph': 'PH-'
    };
    return prefixMap[type] || 'SENSOR-';
  };

  useEffect(() => {
    try {
      const sensor = Array.isArray(selectedSensor) ? selectedSensor[0] : selectedSensor;

      if (sensorMode === "insert") {
        setFormDataSensor({
          bed_id: selectedBed?.bed_id,
          sensor_type: "",
          sensor_code: "",
          unit: ""
        });
      } else if (sensorMode === "update") {
        const codeNumber = extractSensorCodeNumber(sensor?.sensor_code);
        
        setFormDataSensor({
          bed_id: sensor?.bed_id,
          sensor_type: sensor?.sensor_type || "",
          sensor_code: sensor?.sensor_code || "",
          unit: sensor?.unit || ""
        });
      } else if (sensorMode === "delete") {
        setFormDataSensor({
          bed_id: sensor?.bed_id,
          sensor_type: sensor?.sensor_type || ""
        });
      }
    } catch (error) {
      console.error("Error Displaying Sensor Data to the Input", error);
    }
  }, [sensorMode, isSensorOpen, selectedBed, selectedSensor]);

  // Special handler for sensor type change
  const handleSensorTypeChange = (e) => {
    const newType = e.target.value;
    
    
    setFormDataSensor(prev => {
      // If we have an existing sensor code, extract the number and reformat with new type
      if (prev.sensor_code) {
        const numberPart = extractSensorCodeNumber(prev.sensor_code);
        const newCode = numberPart ? formatSensorCode(newType, numberPart) : getSensorPrefix(newType);
        
        return {
          ...prev,
          sensor_type: newType,
          sensor_code: newCode
        };
      }
      
      // If no existing code, just update the type
      return {
        ...prev,
        sensor_type: newType
      };
    });
  };




  // Special handler for sensor code input
  const handleSensorCodeChange = (e) => {
    const inputValue = e.target.value;
    const currentType = formDataSensor.sensor_type;
    
    if (!currentType) {
      // If no sensor type selected yet, use generic prefix
      const prefix = "SENSOR-";
      
      // If user tries to delete prefix, prevent it
      if (inputValue === "" || inputValue === "S" || inputValue === "SE" || inputValue === "SEN" || inputValue === "SENS" || inputValue === "SENSO") {
        setFormDataSensor(prev => ({ ...prev, sensor_code: prefix }));
        return;
      }
      
      // Remove prefix to get just the number part
      const numberPart = inputValue.replace(/^SENSOR-*/i, '');
      
      // Only allow numbers
      const numbersOnly = numberPart.replace(/\D/g, '');
      
      // Combine prefix with the number
      const formattedValue = numbersOnly ? `${prefix}${numbersOnly}` : prefix;
      
      setFormDataSensor(prev => ({
        ...prev,
        sensor_code: formattedValue
      }));
    } else {
      // If sensor type is selected, use the appropriate prefix
      const prefix = getSensorPrefix(currentType);
      
      // If user tries to delete prefix, prevent it
      if (inputValue === "" || inputValue === prefix.slice(0, 1) || inputValue === prefix.slice(0, 2) || inputValue === prefix.slice(0, 3) || inputValue === prefix.slice(0, 4)) {
        setFormDataSensor(prev => ({ ...prev, sensor_code: prefix }));
        return;
      }
      
      // Remove prefix to get just the number part
      const numberPart = inputValue.replace(new RegExp(`^${prefix}*`, 'i'), '');
      
      // Only allow numbers
      const numbersOnly = numberPart.replace(/\D/g, '');
      
      // Combine prefix with the number
      const formattedValue = numbersOnly ? `${prefix}${numbersOnly}` : prefix;
      
      setFormDataSensor(prev => ({
        ...prev,
        sensor_code: formattedValue
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Skip custom handling for sensor_code since we have special handler
    if (name === "sensor_code") {
      return;
    }
    
    setFormDataSensor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Auto-set unit based on sensor type if not already set
      const unitMap = {
        'moisture': '%',
        'humidity': '%',
        'temperature': '°C',
        'ph': ''
      };

      const finalFormData = {
        ...formDataSensor,
        unit: formDataSensor.unit || unitMap[formDataSensor.sensor_type] || ''
      };

      if (sensorMode === "insert") {
        await sensorServices.insertSensors(finalFormData);
        loadBedData();
        onSensorClose(true);
        scsMsg(`${capitalizeFirstLetter(finalFormData.sensor_type)} Added Successfully`);
        setFormError([]);
      } else if (sensorMode === "update") {
        await sensorServices.updateSensors(finalFormData, selectedSensor.sensor_id);
        onSensorClose(true);
        scsMsg(`${capitalizeFirstLetter(finalFormData.sensor_type)} Updated Successfully`);
        setFormError([]);
      } else {
        await sensorServices.deleteSensors(selectedSensor.sensor_id);
        loadBedData();
        onSensorClose(true);
        scsMsg(`${capitalizeFirstLetter(formDataSensor.sensor_type)} Deleted Successfully`);
        setFormError([]);
      }
    } catch (error) {
      const sensorError = error.response.data.errors;
      setFormError(sensorError);
      console.error("Error Submitting Sensor Data", error);
    }
  };

  const getErrorMsg = (fieldName) => {
    const err = formError.find(e => e.path === fieldName);
    return err ? err.msg : "";
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
                disabled
                placeholder="Bed ID"
                value={formDataSensor.bed_id}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
                required
              />
            
              {/* Sensor Code - Updated with auto-formatting */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  name="sensor_code"
                  placeholder="Type number only (001, 002...)"
                  value={formDataSensor.sensor_code}
                  onChange={handleSensorCodeChange}
                  className="px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
                />
                {getErrorMsg("sensor_code") && (
                  <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("sensor_code")}</span>
                )}
                <span className="text-xs text-gray-500 mt-1">
                  {formDataSensor.sensor_type 
                    ? `Just type the number (001, 002...) - Prefix: ${getSensorPrefix(formDataSensor.sensor_type)}`
                    : "Select sensor type first, then type number"}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              <select
                name="sensor_type"
                value={formDataSensor.sensor_type}
                onChange={handleSensorTypeChange}
                className="px-4 py-2 shadow-lg bg-gray-200 w-full rounded-lg">
                <option value="">Sensor Type</option>
                {["ph", "moisture", "humidity", "temperature"].map((type) => (
                  <option key={type} value={type}>
                    {capitalizeFirstLetter(type)}
                  </option>
                ))}
              </select>
              {getErrorMsg("sensor_type") && (
                <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("sensor_type")}</span>
              )}

              {/* UNIT */}
              <select
                name="unit"
                value={formDataSensor.unit}
                onChange={handleChange}
                className="px-4 py-2 shadow-lg bg-gray-200 w-full rounded-lg">
                <option value="">Unit</option>
                <option value="%">Moisture / Humidity - %</option>
                <option value="°C">Temperature - °C</option>
                <option value="cm">Water Level - cm</option>
                <option value="decimal">pH - decimal</option>
              </select>

              {getErrorMsg("unit") && (
                <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("unit")}</span>
              )}
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