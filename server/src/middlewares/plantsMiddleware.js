import { body, validationResult } from "express-validator";

export const validatePlants = [
    body("name")
        .notEmpty()
        .withMessage("Please enter a name for the Tray Group."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {return res.status(400).json({ errors: errors.array() });}
        next();
    }
];
