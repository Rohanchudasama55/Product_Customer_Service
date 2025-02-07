import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import * as dbConnection from "./src/config/DBConfig.js";
import { routes } from "./src/routes/index.js";
const app = express();        

app.use(cors({
  origin: "*", 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

dbConnection.connectDB();

app.use(routes)
app.listen(process.env.USER_PORT || 3000, () => { 
    console.log(`User-svc running on port::${process.env.USER_PORT}`);
});






