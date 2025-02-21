import express from "express";
import bodyParser from "body-parser";
import http from "http";
import whatsappRoutes from "./src/routes/whatsappRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import * as dbConnection from "./src/config/DBConfig.js";
import { initializeSocket } from "./src/config/socket.js";

const app = express();
const server = http.createServer(app);

let io;

const startServer = async () => {
  io = await initializeSocket(server);

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  dbConnection.connectDB();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(whatsappRoutes);

  // Start Server
  const PORT = process.env.WHATSAPP_PORT || 3002;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Whatsapp-service running on PORT 000 :${PORT}`);
  });
};

startServer();

export { io };

// import express from "express";
// import bodyParser from "body-parser";
// import http from "http";
// import whatsappRoutes from "./src/routes/whatsappRoutes.js";
// import dotenv from "dotenv";
// dotenv.config();
// import cors from "cors";

// import * as dbConnection from "./src/config/DBConfig.js";
// import { initializeSocket } from "./src/config/socket.js";

// const app = express();
// const server = http.createServer(app);

// const io = await initializeSocket(server);
// // console.log("io",io);

// export { io };

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// dbConnection.connectDB();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(whatsappRoutes);

// const PORT = process.env.WHATSAPP_PORT || 3002;
// app.listen(PORT, () => {
//   console.log(`Whatsapp-service running on port: ${PORT}`);
// });
