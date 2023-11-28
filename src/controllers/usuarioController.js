const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

// 1. Cadastro do usuário
const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, telefones } = req.body;

    // Verificar se o e-mail já existe no banco de dados
    // Se sim, retornar erro de já existente
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'E-mail já existente.' });
    }

    // Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criando um novo usuário no banco utilizando a model
    const novoUsuario = new Usuario({
      nome,
      email,
      senha: hashedPassword, // Salvar a senha criptografada
      telefones,
    });

    // Gerando um token e atribuindo ao usuário
    const token = novoUsuario.generateAuthToken();

    // Save do usuário no banco de dados.
    await novoUsuario.save();

    // Retornando os dados desejados no JSON de resposta
    res.json({
      usuario: {
        id: novoUsuario.id,
        data_criacao: novoUsuario.data_criacao,
        data_atualizacao: novoUsuario.data_atualizacao,
        ultimo_login: novoUsuario.ultimo_login,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
};

// 2. Login do usuário
const realizarLogin = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Encontrar o usuário pelo e-mail
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    // Verificar a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    // Atualizar o último login
    usuario.ultimo_login = new Date();
    await usuario.save();

    // Gerar token de autenticação
    const token = usuario.generateAuthToken();

    // Retornar os dados desejados no JSON de resposta
    res.json({
      usuario: {
        id: usuario.id,
        data_criacao: usuario.data_criacao,
        data_atualizacao: usuario.data_atualizacao,
        ultimo_login: usuario.ultimo_login,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao realizar o login.' });
  }
};

// 3. Busca do usuário
const buscarUsuario = async (req, res) => {
  try {
    // O usuário autenticado está disponível no objeto de solicitação após passar pelo middleware de autenticação
    const usuarioAutenticado = req.usuario;
    
    // Realize a lógica necessária para buscar o usuário
    const usuarioEncontrado = await Usuario.findOne({ id: usuarioAutenticado.id });

    if (!usuarioEncontrado) {
      console.log(usuarioAutenticado)
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    // Retorne os detalhes do usuário
    res.json({
      id: usuarioEncontrado._id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
  }
};

module.exports = {
  cadastrarUsuario,
  realizarLogin,
  buscarUsuario,
};
