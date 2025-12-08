import {body,validationResult} from "express-validator";


export const validatePlantBatch = [
    body("tray_group_id").notEmpty().withMessage("Tray Group Id is Required"),        
    body("plant_name").notEmpty().withMessage("Plant Name is Required"),
    body("total_seedlings").notEmpty().withMessage("Total Seedlings is Required"),        
    body("date_planted").notEmpty().withMessage("Date Planted is Required"),
    body("expected_harvest_days").notEmpty().withMessage("Expected Harvest Day is Required"),        
    body("status").notEmpty().withMessage("Status is Requiured "),

    (req,res,next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }

]


