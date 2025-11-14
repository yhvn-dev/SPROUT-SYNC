import express from "express"
import { verifyAccessToken } from "../../middlewares/authMiddleware.js"


const router = express.Router()
 
    router.get("/dashboard",verifyAccessToken , (req,res) => 
        {
             res.json({ message: `Welcome ${req.user.username}!` });
        }
    );

    router.get("/users",verifyAccessToken)
    router.get("/analytics",verifyAccessToken)
    router.get("/device_analytics",verifyAccessToken)


    
export default router;



