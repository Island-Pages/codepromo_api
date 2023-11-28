const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurando o Mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Verifica se a conexão foi concluída com sucesso
mongoose.connection.on('connected', () => {
  console.log('Conexão com o MongoDB deu certa');
});

mongoose.connection.on('error', (error) => {
  console.error('erroro na conexão com o banco:', error);
});

app.get('/', (req, res) => {
  res.json({ message: 'HELLO WORLD' });
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
