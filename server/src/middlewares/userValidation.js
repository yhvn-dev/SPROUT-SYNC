import {body, validationResult} from "express-validator"


export const insertUserValidation = [
    
    body("username").notEmpty().withMessage("Username is required"),
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").notEmpty().withMessage("Role is required"),

    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
        next();
    }
]



export const updateUserValidation = [

    body("username").notEmpty().withMessage("Username is required"),
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    body("password").optional({ checkFalsy: true }) 
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").notEmpty().withMessage("Role is required"),


    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
        next();
    }

]