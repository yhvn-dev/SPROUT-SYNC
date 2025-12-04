import {body,validationResult} from "express-validator";


export const validateTrays = [
    body("tray_group_id").notEmpty().withMessage("Tray Group Name Is Required"),        
    body("plant_type").notEmpty().withMessage("Plant Type is Required"),
    body("soil_type").notEmpty().withMessage("Soil Type is Required"),

    (req,res,next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        next();
    }
]


