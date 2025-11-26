import {body,validationResult} from "express-validator"



export const sensorValidation = [
    body("sensor_code").notEmpty().withMessage("Sensor Code is Required"),
    body("sensor_type").notEmpty().withMessage("Sensor Type is Required"),
    body("unit").notEmpty().withMessage("Sensor Unit"),
 
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
        next();
    }
    
]
