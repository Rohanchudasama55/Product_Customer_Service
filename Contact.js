import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import contactRoutes from "./src/routes/ContactRoutes.js"
import * as dbConnection from "./src/config/DBConfig.js";
const app = express();        

app.use(cors({
  origin: "*", 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
dbConnection.connectDB();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(contactRoutes)
  
app.listen(process.env.CONTACT_PORT || 3001, () => { 
    console.log(`Contact-svc running on port::${process.env.CONTACT_PORT}`);
});






