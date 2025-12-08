import { body, validationResult } from "express-validator";

export const validateTrays = [
    body("tray_group_id")
        .notEmpty()
        .withMessage("Please select a Tray Group."),
    body("batch_id")
        .notEmpty()
        .withMessage("Please select the Plant Batch."),
    body("plant")
        .notEmpty()
        .withMessage("Please enter the name of the plant."),
    body("date_planted")
        .notEmpty()
        .withMessage("Please provide the planting date.")
        .isDate()
        .withMessage("Date Planted must be a valid date."),
    body("is_alive")
        .notEmpty()
        .withMessage("Please indicate whether the plant is alive."),
    body("is_harvested")
        .notEmpty()
        .withMessage("Please indicate whether the plant has been harvested."),
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
