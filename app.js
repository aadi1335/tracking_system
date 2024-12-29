const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

// Creating the server
const server = http.createServer(app);

// Passing the server to socket.io
const io = socketio(server);

io.on('connection', (socket) => {
    console.log("Client connected");

    // Handle location event
    socket.on("send-location", (data) => {
        const { latitude, longitude } = data;
        console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);
        // Emit location to other clients (if needed)
        io.emit("receive-location", {id: socket.id, ...data})
        // socket.broadcast.emit("receive-location", { latitude, longitude });
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected: ",socket.id);
    });
});

// Middleware for static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware for EJS templates
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

// Starting the server
server.listen(3000, () => { 
    console.log("Hosted on: http://localhost:3000");
});
