const express = require('express');
const router = express.Router();
const { cadastrarUsuario, realizarLogin, buscarUsuario } = require('../controllers/usuarioController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');
const { createCupom, validarCupomById, dadosCupom, pegarCuponsValidos } = require('../controllers/cupomController');

router.post('/cadastro', cadastrarUsuario);
router.post('/login', realizarLogin);
router.get('/buscar', autenticacaoMiddleware, buscarUsuario);
router.post('/criarCupom', createCupom)
router.post('/dadosCupom', dadosCupom)
router.patch('/:id/validarCupom', validarCupomById)
router.get('/pegarCupons', pegarCuponsValidos)

module.exports = router;
