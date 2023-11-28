const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { cadastrarUsuario, realizarLogin, buscarUsuario } = require('./controllers/usuarioController');
const autenticacaoMiddleware = require('./middlewares/autenticacaoMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Verifica se a conexão foi concluída com sucesso
mongoose.connection.on('connected', () => {
  console.log('Conexão com o MongoDB deu certa');
});

mongoose.connection.on('error', (error) => {
  console.error('erro na conexão com o banco:', error);
});

app.use(bodyParser.json());

app.post('/usuarios', cadastrarUsuario);
app.post('/login', realizarLogin)

app.get('/usuario', autenticacaoMiddleware, buscarUsuario);

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
