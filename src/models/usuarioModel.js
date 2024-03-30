const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const usuarioSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: { type: String, required: true},
  data_criacao: { type: Date, default: Date.now },
  data_atualizacao: { type: Date, default: Date.now },
  ultimo_login: { type: Date, default: null },
  token: { type: String, default: null },
});

usuarioSchema.methods.generateAuthToken = function () {
  try {
    const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    this.token = token;
    return token;
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    return null;
  }
};

usuarioSchema.methods.verifyAuthToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
