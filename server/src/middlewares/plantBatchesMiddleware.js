import { body, validationResult } from "express-validator";

export const validatePlantBatch = [
    // Tray ID
    body("tray_id")
        .notEmpty()
        .withMessage("Please select a Tray.")
        .isInt({ min: 1 })
        .withMessage("Tray ID must be a positive number."),

    // Plant Name
    body("plant_name")
        .notEmpty()
        .withMessage("Please enter the plant name.")
        .isString()
        .withMessage("Plant name must be a string."),

    // Total Seedlings
    body("total_seedlings")
        .notEmpty()
        .withMessage("Please specify the total number of seedlings.")
        .isInt({ min: 1 })
        .withMessage("Total seedlings must be a positive number."),

    // Alive Seedlings
    body("alive_seedlings")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Alive seedlings must be a non-negative number."),
    // Dead Seedlings
    body("dead_seedlings")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Dead seedlings must be a non-negative number."),
    // Replanted Seedlings
    body("replanted_seedlings")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Replanted seedlings must be a non-negative number."),
    // Growth Stage
    body("growth_stage")
        .optional()
        .isString()
        .isIn(["Seedling", "Vegetative", "Mature", "Ready for Harvest"])
        .withMessage("Growth stage must be one of 'Seedling', 'Vegetative', 'Mature', 'Ready for Harvest'."),
    // Date Planted
    body("date_planted")
        .notEmpty()
        .withMessage("Please enter the planting date.")
        .isDate()
        .withMessage("Invalid date format."),
    // Expected Harvest Days
    body("expected_harvest_days")
        .notEmpty()
        .withMessage("Please enter expected harvest days.")
        .isInt({ min: 1 })
        .withMessage("Expected harvest days must be a positive number."),
    // Status
    body("status")
        .optional()
        .isIn(["Growing", "Harvested", "Failed"])
        .withMessage("Status must be 'Growing', 'Harvested', or 'Failed'."),

    // Middleware to handle validation result
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
