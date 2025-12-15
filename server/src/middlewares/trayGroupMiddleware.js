import { body, validationResult } from "express-validator";


export const validateTrayGroups = [
    body("tray_group_name")
        .notEmpty()
        .withMessage("Please enter a name for the Tray Group."),
    body("min_moisture")
        .notEmpty()
        .withMessage("Please provide the minimum moisture level.")
        .isNumeric()
        .withMessage("Minimum moisture must be a number."),
    body("max_moisture")
        .notEmpty()
        .withMessage("Please provide the maximum moisture level.")
        .isNumeric()
        .withMessage("Maximum moisture must be a number."),
    body("is_watering")
        .optional()
        .isBoolean()
        .withMessage("Is Watering must be true or false."),
    body("location")
    .optional()
    .isBoolean()
    .withMessage("Location is Required"),
        
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {return res.status(400).json({ errors: errors.array() });}
        next();
    }
];
