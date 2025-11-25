import express from "express"
import * as bedController from "../../controllers/bed.Controller.js"
import { bedValidation } from "../../middlewares/bedMiddleware.js"

const router = express.Router()

    router.get("/get/beds",bedController.selectBeds)
    router.get("/get/beds/count",bedController.countBeds)
    router.get("/get/beds/:bed_id",bedController.selectBed)
    router.post("/post/beds",bedValidation,bedController.insertBeds)
    router.put("/put/beds/:bed_id",bedValidation,bedController.updateBeds)
    router.delete("/delete/beds/:bed_id",bedController.deleteBeds)

export default router   