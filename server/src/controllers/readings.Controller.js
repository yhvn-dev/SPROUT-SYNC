import * as readingModel from "../models/readingsModel.js"

export const selectReadings = async (req, res) => {
  try {

    const readings = await readingModel.readSensorReadings()
    res.status(200).json({message:"Readings Feteched Succesfully",data:readings})

  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: "CONTROLLER: Error Getting Readings" });
  }
};


export const selectReading = async (req, res) => {
  try {
    const {reading_id} = req.params
    const reading = await readingModel.readSensorReadingsByReadingId(reading_id)
    
    if(!reading) res.status(201).json({error:"Reading Doesn't Exist"})
    console.log(reading)   

    res.status(200).json({message:"Readings Feteched Succesfully",data:reading})
  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: `CONTROLLER: Error Selecting Reading` });
  }
};


export const selectReadingsBySensorId = async (req, res) => {
  try {
    const {sensor_id} = req.params

  
    const reading = await readingModel.readSensorReadingsBySensorId(sensor_id)
      

    if(!reading) res.status(201).json({error:`Readings of this ${sensor_id} Doesn't Exist`})
 
    res.status(200).json({message:"Sensor's Readings Fetched Succesfully",data:reading})

    
    console.log(reading.value)

  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: `CONTROLLER: Error Selecting Sensor's readings` });
  }
};






export const countReadings = async (req,res) => {
  try {
  
      const count = await readingModel.countTotalReadings()
      res.status(200).json({message:"Total Readings Retreived!",data:count})  

  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: `CONTROLLER: Error Counting Readings` });
  }
}


export const insertReadings = async (req, res) => {
  try {

      const readingsData = req.body
      const {sensor_id} = req.body
      console.log("Readings Data",readingsData)

      if (!readingsData.sensor_id) {
        return res.status(400).json({ error: "Readings Sensor Id is required" });
      }

      const existingSensor = await readingModel.findSensor(sensor_id)
      console.log("SENSOR ID",existingSensor)

      if(existingSensor){
        const readings = await readingModel.createReadings(readingsData)
        res.status(200).json({message:"Readings Feteched Succesfully",data:readings})
      }else{
          res.status(200).json({message:"Sensor with that Sensor Id doesn't exist"})
      }
      

  } catch (err) {
    console.error("CONTROLLER: Error Inserting Readings", err);
    res.status(500).json({ message: "Error Inserting Readings", error: err.message });
  }
};


export const updateReadings = async (req, res) => {
  try {
    const { reading_id } = req.params;
    const readingsData = req.body;

    if (!reading_id) {
      return res.status(400).json({ error: "Reading ID is required" });
    }

    // 1. Check if reading exists
    const existingReading = await readingModel.readSensorReadingsByReadingId(reading_id);
    if (!existingReading || existingReading.length === 0) {
      return res.status(404).json({ error: "Reading with that ID does not exist" });
    }

    // 2. Update only if found
    const updated = await readingModel.updateReadings(readingsData, reading_id);

    return res.status(200).json({
      message: "Readings Updated Successfully",
      data: updated
    });

  } catch (err) {
    console.error(`CONTROLLER:`, err);
    return res.status(500).json({
      message: "CONTROLLER: Error Updating Readings",
      err
    });
  }
};



export const removeReadings = async (req, res) => {
  try {
    const {reading_id} = req.params
    await readingModel.deleteReadings(reading_id)
    res.status(200).json({message:"Readings Deleted Succesfully"})
    
    console.log("CONTROLLER: Readings Deleted Successfully");
    
  } catch (err) {
    console.error("CONTROLLER: Error Deleting readings", err);
    res.status(500).json({ message: "Error Deleting  readings", err });
  }
};


