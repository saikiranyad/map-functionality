// Backend (server.js)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'https://map-functionality-maps.onrender.com' } });

let users = {}; // Store user locations

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('updateLocation', (data) => {
        users[socket.id] = data;
        io.emit('locationUpdate', users);
    });
    
    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('locationUpdate', users);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));