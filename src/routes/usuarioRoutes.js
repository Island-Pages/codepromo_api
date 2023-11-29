const express = require('express');
const router = express.Router();
const { cadastrarUsuario, realizarLogin, buscarUsuario } = require('../controllers/usuarioController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

router.post('/cadastro', cadastrarUsuario);
router.post('/login', realizarLogin);
router.get('/buscar', autenticacaoMiddleware, buscarUsuario);

module.exports = router;
