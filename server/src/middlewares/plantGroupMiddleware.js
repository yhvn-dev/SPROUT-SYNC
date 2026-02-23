import { body, validationResult } from "express-validator";

export const validatePlantGroups = [

    body("group_name")
        .notEmpty()
        .withMessage("Please enter a name for the Tray Group."),
    body("moisture_min")
        .notEmpty()
        .withMessage("Please provide the minimum moisture level.")
        .isNumeric()
        .withMessage("Minimum moisture must be a number."),
    body("moisture_max")
        .notEmpty()
        .withMessage("Please provide the maximum moisture level.")
        .isNumeric()
        .withMessage("Maximum moisture must be a number."),      
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {return res.status(400).json({ errors: errors.array() });}
        next();
    }


];
