import express from "express"
import * as bedController from "../../controllers/bed.Controller.js"

const router = express.Router()

router.get("/get/sensors",bedController.selectBeds)
router.get("/get/sensors/:sensor",bedController.selectBed)
router.post("/post/sensors",bedController.insertBeds)
router.put("/put/sensors/:bed_id",bedController.updateBeds)
router.delete("/delete/sensors/:bed_id",bedController.deleteBeds)

export default router