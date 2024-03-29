const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usuarioRoutes = require('./routes/usuarioRoutes');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Conexão com o MongoDB deu certo');
});

mongoose.connection.on('error', (error) => {
  console.error('Erro na conexão com o banco:', error);
});

app.use(bodyParser.json());

app.use('/', usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
