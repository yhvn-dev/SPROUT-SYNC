import {body,validationResult} from "express-validator";



export const validateTrayGroup = [
    body("tray_group_name").notEmpty().withMessage("Tray Group Name Is Required"),        
    body("is_watering").notEmpty().withMessage("Is Watering Required"),

    (req,res,next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        next();
    }
]


