import {body,validationResult} from "express-validator"



export const sensorValidation = [
    body("sensor_code").notEmpty().withMessage("Sensor Code is Required"),
    body("sensor_type").notEmpty().withMessage("Sensor Type is Required"),
    body("unit").notEmpty().withMessage("Sensor Unit is Required"),
    body("min_value").notEmpty().withMessage("Mininum Threshold is Required"),
    body("max_value").notEmpty().withMessage("Maxninum Threshold is Required"),
 
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
        next();
    }
    
]
