import jwt from "jsonwebtoken"

import dotenv from "dotenv";
dotenv.config()


export const generateAccessToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id,   
      username: user.username,
      email: user.email,              // payload
      role: user.role
    },    
     process.env.ACCESS_TOKEN_SECRET,         // secret
    { expiresIn: "60d" }                 
  );
};


export const generateRefreshToken = (user) => {
  return jwt.sign(
   {
     user_id: user.user_id ,
     username: user.username,
     email: user.email,  
     role: user.role
   }, 

     process.env.REFRESH_TOKEN_SECRET, 
   { expiresIn: "60d" }                     
  );
};



