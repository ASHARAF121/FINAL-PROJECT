const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const socketInit = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  // 🔐 JWT Authentication for sockets
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, role }
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.user.id}`);

    // Join personal room
    socket.join(socket.user.id);

    // 📩 Send message
    socket.on("sendMessage", ({ to, message }) => {
      io.to(to).emit("receiveMessage", {
        from: socket.user.id,
        message,
        timestamp: new Date()
      });
    });

    // 🔔 Service request status updates
    socket.on("requestUpdate", ({ userId, status }) => {
      io.to(userId).emit("requestStatus", {
        status,
        timestamp: new Date()
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.user.id}`);
    });
  });
};

module.exports = socketInit;
