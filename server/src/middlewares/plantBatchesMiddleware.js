import { body, validationResult } from "express-validator";

export const validatePlantBatch = [
  // Tray ID
  body("tray_id")
      .notEmpty()
      .withMessage("Please select a Tray."),

  // Plant Name
  body("plant_name")
      .notEmpty()
      .withMessage("Please enter the plant name."),

  // Total Seedlings
  body("total_seedlings")
      .notEmpty()
      .withMessage("Please specify the total number of seedlings."),

  // Alive Seedlings (optional)
  body("alive_seedlings")
      .optional(),
      
  // Dead Seedlings (optional)
  body("dead_seedlings")
      .optional(),

  // Replanted Seedlings (optional)
  body("replanted_seedlings")
      .optional(),

  body("fully_grown_seedlings")
    .optional(),

  body("growth_stage")
  .optional()
  .isIn([
    "Sprout",
    "Seedling",
    "Vegetative",
    "Budding",
    "Flowering",
    "Fruiting",
    "Ready To Harvest"
  ])
  .withMessage(
    "Growth stage must be one of 'Sprout', 'Seedling', 'Vegetative', 'Budding', 'Flowering', 'Fruiting', 'Ready To Harvest'."
  ),
  

  body("date_planted")
      .notEmpty()
      .withMessage("Please enter the planting date.")
      .isDate()
      .withMessage("Invalid date format."),
  // Expected Harvest Days
  body("expected_harvest_days")
      .notEmpty()
      .withMessage("Please enter expected harvest days."),
  // Middleware to handle validation result
  (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      next();
  }
];
