const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");

// DB
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clientRoutes = require("./routes/clientRoutes");
const providerRoutes = require("./routes/providerRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Socket
const socketInit = require("./sockets/chatSocket");

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/service-request", serviceRequestRoutes);
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Services Management API is running");
});

// Initialize Socket.IO
socketInit(server);

// Server listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

