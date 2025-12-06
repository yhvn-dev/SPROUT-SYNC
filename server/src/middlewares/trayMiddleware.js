import {body,validationResult} from "express-validator";



export const validateTrays = [
    body("tray_group_id").notEmpty().withMessage("Tray Group Id is required"),        
    body("status").notEmpty().withMessage("Status is Required"),

    (req,res,next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        next();
    }
]


