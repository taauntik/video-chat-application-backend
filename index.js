const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

app.use(cors());
const io = require("socket.io")(server, {
  cors: {
    origin: "https://video-chat-project.netlify.app/",
    methods: ["GET", "POST"],
  },
});


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running now");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("call ended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
