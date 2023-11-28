const Usuario = require('../models/usuarioModel');

const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, telefones } = req.body;

    // Verificar se o e-mail já existe no banco de dados
    //  Se sim, retornar erro de já existente
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'E-mail já existente.' });
    }

    // Criando um novo usuário no banco utilizando a model
    const novoUsuario = new Usuario({
      nome,
      email,
      senha,
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
    res.status(500).json({ mensagem : 'Erro ao cadastrar usuário.' });
  }
};

module.exports = {
  cadastrarUsuario,
};
