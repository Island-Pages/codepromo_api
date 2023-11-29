const jwt = require('jsonwebtoken');

const autenticacaoMiddleware = (req, res, next) => {
  const token = req.header('Authentication');


  if (!token) {
    return res.status(401).json({ mensagem: 'Não autorizado - Token não fornecido' });
  }

  try {
    // Verifique o token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // Adicione o usuário autenticado ao objeto de solicitação
    req.usuario = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensagem: 'Sessão inválida - Token expirado' });
    }
    res.status(401).json({ mensagem: 'Não autorizado - Token inválido' });
  }
};

module.exports = autenticacaoMiddleware;
