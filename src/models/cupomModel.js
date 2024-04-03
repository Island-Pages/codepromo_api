const mongoose = require('mongoose');

const cupomSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true
  },
  valor: {
    type: String,
    required: true
  },
  formaPagamento: {
    type: String,
    enum: ['reais', 'porcentagem', 'cupomEspecial'],
    default: 'reais'
  },
  qrCode: {
    type: String,
    required: true
  },
  codigo: {
    type: String,
    required: true
  },
  validado: {
    type: Boolean,
    default: false
  },
  tempoDuracao: {
    type: Date,
    default: null,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now // Adiciona a data de criação
  }
});

const Cupom = mongoose.model('Cupom', cupomSchema);

module.exports = Cupom;
