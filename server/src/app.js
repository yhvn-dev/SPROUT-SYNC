    // ===== ROUTES =====
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
    import esp32Routes from "./routes/ProtectedRoutes/esp32.Routes.js";

    // ===== CORE =====
    import express from "express";
    import cors from "cors";
    import dotenv from "dotenv";
    import cookieParser from "cookie-parser";
    import path from "path";
    import { fileURLToPath } from "url";
    import http from "http";

    // ===== SOCKETS =====
    import { server as WebSocketServer } from "websocket"; // ESP32
    import { Server as SocketIOServer } from "socket.io"; // USERS

    dotenv.config();

    // ===== ES MODULE FIX =====
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ===== CORS =====
    app.use(cors({
    origin: process.env.ORIGIN_URL || "http://localhost:3000",
    credentials: true
    }));

    app.use(cookieParser());

    // ===== ROUTES =====
    app.use('', userRoutes);
    app.use('/trays', traysRoutes);
    app.use('/tg', trayGroupRoutes);
    app.use('/pb', plantBatchRoutes);
    app.use('/pbh', platBatchHistroyRoutes);
    app.use('/sensors', sensorRoutes);
    app.use('/readings', readingRoutes);
    app.use('/notif', notifificationRoutes);
    app.use('/auth', publicRoutes);
    app.use("/esp32", esp32Routes);

    // ===== TEST =====
    app.get("/", (req, res) => res.send("Serving is Running"));
    app.get("/api/hello", (req, res) => {
    res.json({ success: true, message: "Hello from Node.js" });
    });

    // ===== HTTP SERVER =====
    const port = process.env.PORT || 5000;
    const server = http.createServer(app);



    // =====================================================
    // 🔥 SOCKET.IO — USER PUSH NOTIFICATIONS
    // =====================================================
    export const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.ORIGIN_URL || "http://localhost:3000",
        credentials: true
    }
    });

    io.on("connection", (socket) => {
    console.log("🟢 User socket connected:", socket.id);

    // User joins their own room
    socket.on("join", (userId) => {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log("🔴 User socket disconnected:", socket.id);
    });
    });



    // =====================================================
    // 🔌 RAW WEBSOCKET — ESP32 (UNCHANGED)
    // =====================================================
    const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
    });

    export const clients = [];

    wsServer.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    console.log("🟢 ESP32 WebSocket connected");

    clients.push(connection);

    connection.on("message", (message) => {
        if (message.type === "utf8") {
        console.log("ESP32 WS Message:", message.utf8Data);

        if (message.utf8Data === "ESP32_CONNECTED") {
            console.log("✅ ESP32 is connected");
        }

        // Broadcast ESP32 data to all listeners
        clients.forEach(client => {
            if (client.connected) {
            client.sendUTF(message.utf8Data);
            }
        });
        }
    });

    connection.on("close", () => {
        console.log("🔴 ESP32 WebSocket disconnected");
        const index = clients.indexOf(connection);
        if (index !== -1) clients.splice(index, 1);
    });
    });

    // ===== ESP32 STATUS =====
    app.get("/esp32/status", (req, res) => {
    const esp32Connected = clients.some(client => client.connected);
    res.json({
        connected: esp32Connected,
        message: esp32Connected ? "ESP32 is online ✅" : "ESP32 is offline ❌"
    });
    });

    // ===== START SERVER =====
    server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔌 ESP32 Status: http://localhost:${port}/esp32/status`);
    });
