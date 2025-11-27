import {body,validationResult} from "express-validator"



export const bedValidation = [
    body("bed_code").notEmpty().withMessage("Bed Code is Required"),
    body("bed_name").notEmpty().withMessage("Bed Name is Required"),
    body("location").notEmpty().withMessage("Location  is Required"),  
    body("min_moisture").notEmpty().withMessage("Min Mousture is Required"),  
    body("max_moisture").notEmpty().withMessage("Max Moisture is Required"),

    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
        next();
    }
    
]
