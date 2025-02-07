import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import templateRoutes from "./src/routes/TemplateRoutes.js"
import * as dbConnection from "./src/config/DBConfig.js";
const app = express();        

app.use(cors({
  origin: "*", 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
dbConnection.connectDB();

app.use(templateRoutes)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

  
app.listen(process.env.WHATSAPP_PORT || 3002, () => { 
    console.log(`Whatsapp-service running on port::${process.env.WHATSAPP_PORT}`);
});






