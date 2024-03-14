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
    type: Number,
    required: true
  },
  formaPagamento: {
    type: String,
    enum: ['reais', 'porcentagem'],
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
  }
});

const Cupom = mongoose.model('Cupom', cupomSchema);

module.exports = Cupom;
