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




export const countBeds = async (req,res) => {
  try {
  
      const count = await bedModel.countTotalBeds()
      res.status(200).json({message:"Total Bed Retreived!",data:count})  

  } catch (err) {
    console.error(`CONTROLLER:`, err);
    res.status(500).json({ message: `CONTROLLER: Error Counting Beds By Bed` });
  }
}



export const insertBeds = async (req, res) => {
  try {
      const bedData = req.body
      console.log("Bed Data",bedData)

    if (!bedData.bed_code) {
      return res.status(400).json({ 
        errors: [{ path: "bed_code", msg: "Bed code is required" }] 
      });
    }

    const existingBed = await bedModel.readBedByCode(bedData.bed_code);
    if (existingBed) { 
      return res.status(409).json({ 
        errors: [{ path: "bed_code", msg: "Bed with this code already exists" }] 
      });
    }

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
    console.log("BED DATA FROM BACKEND",bedData)

    if (!bedData.bed_code) {
      return res.status(400).json({ 
        errors: [{ path: "bed_code", msg: "Bed code is required" }] 
      });
    }
   
    const existingBed = await bedModel.readBedByCode(bedData.bed_code);
    if (existingBed && existingBed.bed_id !== parseInt(bed_id)) { 
      return res.status(409).json({ 
        errors: [{ path: "bed_code", msg: "Bed with this code already exists" }] 
      });
    }

    const updatedBed = await bedModel.updateBed(bedData,bed_id);
    res.status(200).json({ message: "Bed Updated Successfully", data: updatedBed });



  } catch (err) {
    console.error("CONTROLLER: Error Updating Bed", err);
    res.status(500).json({ 
      errors: [{ path: "general", msg: "Error Updating Bed" }] 
    });
  }
};






export const deleteBeds = async (req, res) => {
  try {
    
    const { bed_id } = req.params;

    const deleted = await bedModel.deleteBed(bed_id);
    if (!deleted) {
      return res.status(404).json({ message: "Bed does not exist or already deleted" });
    }

    return res.status(200).json({
      message: "Bed Deleted Successfully",
      data: deleted
    });

  } catch (err) {
    console.error("CONTROLLER: Error Deleting bed", err);
    return res.status(500).json({ message: "Error Deleting bed", err });
  }
};