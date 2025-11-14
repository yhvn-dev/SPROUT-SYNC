import express from "express"
import * as bedController from "../../controllers/bed.Controller.js"

const router = express.Router()

router.get("/get/beds",bedController.selectBeds)
router.get("/get/beds/:bed_id",bedController.selectBed)
router.post("/post/beds",bedController.insertBeds)
router.put("/put/beds",bedController.updateBeds)
router.delete("/delete/beds/:bed_id",bedController.deleteBeds)

export default router