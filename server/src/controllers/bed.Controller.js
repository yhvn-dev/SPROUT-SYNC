import * as bedModel from "../models/bedModels.js"


export const selectBeds = async (req, res) => {
  try {
    const beds = await bedModel.readBeds() 
    console.log("BEDS",beds)
    res.status(200).json({message:"Beds Feteched Succesfully",data:beds})
  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: "CONTROLLER: Error Getting Beds" });
  }
};


export const selectBed = async (req, res) => {
  try {
    const {bed_id} = req.params
    const bed = await bedModel.readBed(bed_id)
    
    if(!bed) res.status(201).json({error:"Bed Doesn't Exist"})
    console.log(bed)   

    res.status(200).json({message:"Bed Feteched Succesfully",data:bed})
  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: `CONTROLLER: Error Selecting Bed` });
  }
};

export const insertBeds = async (req, res) => {
  try {
        const bedData = req.body
        const bed = await bedModel.createBed(bedData)
        console.log(bed)   
        res.status(200).json({message:"Bed Feteched Succesfully",data:bed})
  } catch (err) {
    console.error("CONTROLLER: Error Inserting Beds", err);
    res.status(500).json({ message: "Error Inserting Beds", error: err.message });
  }
};



export const updateBeds = async (req, res) => {
  try {
    const { bed_id } = req.params;
    const bedData = req.body;

    if(!bed_id) { return res.status(201).json({error:"Bed Id Doesn't Exist"})}

    const existingBed = await bedModel.readBed(bed_id)
    if(!existingBed) { return res.status(201).json({error:"Bed Doesn't Exist"})}

    const bed = await bedModel.updateBed(bedData, bed_id);
    return res.status(200).json({
      message: "Bed Updated Successfully",
      data: bed
    });

  } catch (err) {
    console.error(`CONTROLLER:`, err);
    return res.status(500).json({
      message: "CONTROLLER: Error Updating Beds",
      err
    });
  }

  
};


export const deleteBeds = async (req, res) => {
  try {
    const {bed_id} = req.params
    await bedModel.deleteBed(bed_id)
    res.status(200).json({message:"Bed Deleted Succesfully"})
    console.log("CONTROLLER: Bed Deleted Successfully");
  } catch (err) {
    console.error("CONTROLLER: Error Deleting bed", err);
    res.status(500).json({ message: "Error Deleting  bed", err });
  }
};


