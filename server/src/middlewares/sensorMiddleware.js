import {body,validationResult} from "express-validator";


export const validateSensors = [
    body("tray_id").notEmpty().withMessage("Tray Id Is Required"),        
    body("sensor_type").notEmpty().withMessage("Sensor Type is Required"),
    body("status").notEmpty().withMessage("Status Type is Required"),

    (req,res,next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]


