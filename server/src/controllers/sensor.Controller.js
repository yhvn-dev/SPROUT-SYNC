import * as sensorModel from "../models/sensorModels.js"


export const selectSensors = async (req, res) => {
  try {
    const sensor = await sensorModel.readSensors()
    console.log("Sensors",sensor)
    res.status(200).json({message:"Sensors Feteched Succesfully",data:sensor})
  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: "CONTROLLER: Error Getting Sensors" });
  }
};



export const selectSensor = async (req, res) => {
  try {
    const {sensor_id} = req.params
    const sensor = await sensorModel.readSensor(sensor_id)
    
    if(!sensor) res.status(201).json({error:"Sensor Doesn't Exist"})
    console.log(sensor)   

    res.status(200).json({message:"Sensor Feteched Succesfully",data:sensor})
  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: `CONTROLLER: Error Selecting Sensor` });
  }
};

export const countSensorByBed = async (req,res) => {
  try {
      const {bed_id} = req.params;

      if(!bed_id){
        return res.status(201).json({error:"Bed Doesnt Exist!"})
      } 
      const count = await sensorModel.countSensorOnBed(bed_id)
      
      res.status(200).json({message:"Number of Sensors By Bed Retreived!",data:count})  

  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: `CONTROLLER: Error Counting Sensor By Bed` });
  }
}


export const countSensors = async (req,res) => {
  try {
      const count = await sensorModel.countSensors()
      res.status(200).json({message:"Total Sensors Retreived!",data:count})  
  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: `CONTROLLER: Error Counting Sensor By Bed` });
  }
}



export const insertSensor = async (req, res) => {
  try {
        const sensorData = req.body  
        if (!sensorData.sensor_code) {
          return res.status(400).json({ error: "Sensor code is required" });
        }
  
        const existingSensor = await sensorModel.readSensorByCode(sensorData.sensor_code)
        if (existingSensor) { 
           return res.status(409).json({ errors: [{path: "sensor_code", msg: "Sensor code is required" }]
          })
        }
     
        const sensor = await sensorModel.createSensor(sensorData)
        console.log(sensor)   
        res.status(200).json({message:"Sensor Inserted Succesfully",data:sensor})



  } catch (err) {
    console.error("CONTROLLER: Error Inserting Sensor", err);
    res.status(500).json({ message: "Error Inserting Sensor", error: err.message });
  }
};



export const updateSensor = async (req, res) => {
  try {
    const { sensor_id } = req.params
    const sensorData = req.body;

    if(!sensor_id) { return res.status(201).json({error:"Sensor Id Doesn't Exist"})}

    const existingSensor = await sensorModel.readSensor(sensor_id)
    if(!existingSensor) { return res.status(201).json({error:"Sensor Doesn't Exist"})}


    const existingSensorByCode = await sensorModel.readSensorByCode(sensorData.sensor_code)
      if (existingSensorByCode) { 
        return res.status(409).json({ errors: [{path: "sensor_code", msg: "Sensor code is required" }]
      })
    }

    const sensor = await sensorModel.updateSensor(sensorData,sensor_id);
    return res.status(200).json({
      message: "Sensor Updated Successfully",
      data: sensor
    });

  } catch (err) {
    console.error(`CONTROLLER:`, err);
    return res.status(500).json({
      message: "CONTROLLER: Error Updating Sensor",
      err
    });
  }
};




  export const deleteSensor = async (req, res) => {
    
    try {
        const { sensor_id } = req.params;
        const sensor = await sensorModel.readSensor(sensor_id);
        if (!sensor) {
          return res.status(404).json({ message: "Sensor does not exist" });
        }
        const deleted = await sensorModel.deleteSensor(sensor_id);

        return res.status(200).json({
          message: "Sensor Deleted Successfully",
          data: deleted
        });

      } catch (err) {
        console.error("CONTROLLER: Error Deleting Sensor", err);
        return res.status(500).json({
          message: "Error Deleting Sensor",
          err
        });
  }
};

