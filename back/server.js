const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],  // Allow both localhost and 127.0.0.1
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

let users = {};

// Fichiers statiques
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/game.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'game.html'));
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Enregistrement du pseudo de l'utilisateur
  socket.on('setUsername', (username) => {
    users[socket.id] = username;
    io.emit('updateUserList', Object.values(users));
    console.log(`${username} has connected`);
  });

  // Envoi de message
  socket.on('sendMessage', (message) => {
    if (users[socket.id]) {  // Assure que l'utilisateur est identifié
        io.emit('newMessage', { user: users[socket.id], message });
    }
  });

  // Déconnexion de l'utilisateur
  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} has disconnected`);
    delete users[socket.id];
    io.emit('updateUserList', Object.values(users));
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
