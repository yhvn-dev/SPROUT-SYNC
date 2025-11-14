import userRoutes from "./routes/ProtectedRoutes/user.Routes.js";
import bedRoutes from "./routes/ProtectedRoutes/bed.Routes.js"
import pageRoutes from "./routes/ProtectedRoutes/page.Routes.js"
import publicRoutes from "./routes/UnprotectedRoutes/public.Routes.js"
import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config()


// Needed for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(cors({ origin: "http://localhost:3000",credentials: true }));


app.use(cookieParser());
app.use("/uploads",express.static(path.join(__dirname, "./../uploads")));;

app.use('/beds',bedRoutes)
app.use('',userRoutes)
app.use('/auth',publicRoutes)
app.use('/page',pageRoutes)
 


app.get("/hello",(req,res)=>{
    res.send("<p>Hello World</p>")
})

app.get("/",(req,res) =>{
    res.send("Serving is Running")
})

const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Listening to Port, ${port}`)
})

