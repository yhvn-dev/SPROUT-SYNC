import {body,validationResult} from "express-validator"



export const authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        const userRole = req.user.role
        if(!roles.includes(userRole)){
            return res.status(403).json({message: "Access Denied Insufficient permissions"})
        }
        next();   
    }
}


