import userRoutes from "./routes/ProtectedRoutes/user.Routes.js";
import pageRoutes from "./routes/ProtectedRoutes/page.Routes.js";
import publicRoutes from "./routes/UnprotectedRoutes/public.Routes.js";
import trayGroupRoutes from "./routes/ProtectedRoutes/trayGroup.Routes.js";
import plantBatchRoutes from "./routes/ProtectedRoutes/plantBatch.Routes.js";
import platBatchHistroyRoutes from "./routes/ProtectedRoutes/plantBatchHistory.Routes.js";
import traysRoutes from "./routes/ProtectedRoutes/tray.Routes.js";
import sensorRoutes from "./routes/ProtectedRoutes/sensor.Routes.js";
import readingRoutes from "./routes/ProtectedRoutes/readings.Routes.js";
import notifificationRoutes from "./routes/ProtectedRoutes/notification.Routes.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { server as WebSocketServer } from "websocket"; // WebSocket import
import http from "http"; // For attaching WebSocket

dotenv.config();


// Needed for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// ===== HTTP ROUTES =====
app.use('', userRoutes);
app.use('/trays', traysRoutes);
app.use('/tg', trayGroupRoutes);
app.use('/pb', plantBatchRoutes);
app.use('/pbh', platBatchHistroyRoutes);
app.use('/sensors', sensorRoutes);
app.use('/readings', readingRoutes);
app.use('/notif', notifificationRoutes);
app.use('/auth', publicRoutes);
app.use('/page', pageRoutes);




app.get("/hello", (req, res) => {
    res.send("<p>Hello World</p>");
});
app.get("/", (req, res) => {
    res.send("Serving is Running");
});

// ===== TEST API =====
app.get("/api/hello", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello from Node.js"
  });
});







// ===== CREATE HTTP SERVER (for WebSocket) =====
const port = process.env.PORT || 5000;
const server = http.createServer(app);

// ===== WEBSOCKET SERVER =====
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});






// Store connected clients (optional)
const clients = [];
wsServer.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    console.log("🟢 WebSocket connected");

    // Add to clients array
    clients.push(connection);

    connection.on("message", (message) => {
        if (message.type === "utf8") {
            console.log("WS Message received:", message.utf8Data);

            // Echo back (or broadcast to all clients)
            clients.forEach(client => {
                if (client.connected) {
                    client.sendUTF(message.utf8Data);
                }
            });
        }
    });

    connection.on("close", () => {
        console.log("🔴 WebSocket disconnected");
        // Remove from clients array
        const index = clients.indexOf(connection);
        if (index !== -1) clients.splice(index, 1);
    });
});



// ===== START SERVER =====
server.listen(port, '0.0.0.0', () => {
    console.log(`Listening to Port ${port}`);
});
