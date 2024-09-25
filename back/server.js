const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Guess the Picture Game Server is running');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Envoyer une image à deviner
  socket.emit('newImage', { imageUrl: 'http://example.com/image.jpg' });

  // Recevoir une réponse de l'utilisateur
  socket.on('guess', (data) => {
    console.log(`User ${socket.id} guessed: ${data.guess}`);
    // Logique pour vérifier la réponse et envoyer un retour
    if (data.guess === 'correctAnswer') {
      socket.emit('result', { correct: true });
    } else {
      socket.emit('result', { correct: false });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});