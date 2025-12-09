import { body, validationResult } from "express-validator";

export const validateTrays = [
    body("tray_group_id")
        .notEmpty()
        .withMessage("Please select a Tray."),
    body("plant")
        .notEmpty()
        .withMessage("Please enter the name of the plant."),
    body("status")
        .notEmpty()
        .withMessage("Please specify the tray status."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
