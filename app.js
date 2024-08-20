const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

// Create an HTTP server and bind Socket.io to it
const server = http.createServer(app);
const io = socketio(server);

// Socket.io connection
io.on("connection", function(socket) {
    console.log("New connection:", socket.id);

    // Handle 'send-location' event
    socket.on("send-location", function(data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    // Handle 'disconnect' event
    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
    });
});

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define the main route
app.get("/", (req, res) => {
    res.render("index");
});

// Listen on the specified port (PORT) or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
