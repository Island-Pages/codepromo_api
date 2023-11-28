const Usuario = require('../models/usuarioModel');
const { cadastrarUsuario, realizarLogin, buscarUsuario } = require('../controllers/usuarioController');
const bcrypt = require('bcrypt');

jest.mock('../models/usuarioModel.js');
jest.mock('bcrypt');

describe('usuarioController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cadastrarUsuario', () => {
    test('deve cadastrar um novo usuário com sucesso', async () => {
        const req = {
          body: {
            nome: 'Teste',
            email: 'teste@example.com',
            senha: 'senha123',
            telefones: [{ numero: '123456789', ddd: '11' }],
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        bcrypt.hash.mockResolvedValue('hashedPassword');
      
        const novoUsuario = new Usuario({
          nome: 'Teste',
          email: 'teste@example.com',
          senha: 'hashedPassword',
          telefones: [{ numero: '123456789', ddd: '11' }],
        });
      
        Usuario.prototype.save.mockResolvedValue(novoUsuario);
        const token = Usuario.generateAuthToken;
        Usuario.findOne.mockResolvedValue(null);
      
        await cadastrarUsuario(req, res);
      
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          usuario: {
            id: novoUsuario.id,
            data_criacao: novoUsuario.data_criacao,
            data_atualizacao: novoUsuario.data_atualizacao,
            ultimo_login: novoUsuario.ultimo_login,
            token: token, 
          },
        });
      });
    });

    test('deve retornar erro para e-mail existente', async () => {
      const req = {
        body: {
          nome: 'Teste',
          email: 'teste@example.com',
          senha: 'senha123',
          telefones: [{ numero: '123456789', ddd: '11' }],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Usuario.findOne.mockResolvedValue({ email: 'teste@example.com' });

      await cadastrarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'E-mail já existente.' });
    });

    test('deve retornar erro interno ao cadastrar usuário', async () => {
      const req = {
        body: {
          nome: 'Teste',
          email: 'teste@example.com',
          senha: 'senha123',
          telefones: [{ numero: '123456789', ddd: '11' }],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Usuario.findOne.mockRejectedValue(new Error('Erro interno'));

      await cadastrarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao cadastrar usuário.' });
    });
  });

  describe('realizarLogin', () => {
    test('deve realizar o login com sucesso', async () => {
        const req = {
          body: {
            email: 'teste@example.com',
            senha: 'senha123',
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Simular a busca do usuário no banco de dados
        const usuario = new Usuario({
          id: 'testId',
          email: 'teste@example.com',
          senha: await bcrypt.hash('senha123', 10),
        });
      
        const token = Usuario.generateAuthToken;
        
        Usuario.findOne.mockResolvedValueOnce(usuario);
      
        bcrypt.compare.mockResolvedValueOnce(true);
      
        await realizarLogin(req, res);
      
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          usuario: {
            id: usuario.id,
            data_criacao: usuario.data_criacao,
            data_atualizacao: usuario.data_atualizacao,
            ultimo_login: expect.any(Date),
            token: token,
          },
        });
      });
    });

    test('deve retornar erro para usuário não encontrado', async () => {
      const req = {
        body: {
          email: 'teste@example.com',
          senha: 'senha123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Usuario.findOne.mockResolvedValue(null);

      await realizarLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Usuário e/ou senha inválidos' });
    });

    test('deve retornar erro para senha incorreta', async () => {
      const req = {
        body: {
          email: 'teste@example.com',
          senha: 'senha123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const usuario = new Usuario({
        id: 'testId',
        email: 'teste@example.com',
        senha: await bcrypt.hash('senha456', 10),
      });
      Usuario.findOne.mockResolvedValue(usuario);

      await realizarLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Usuário e/ou senha inválidos' });
    });

    test('deve retornar erro interno ao realizar login', async () => {
      const req = {
        body: {
          email: 'teste@example.com',
          senha: 'senha123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Usuario.findOne.mockRejectedValue(new Error('Erro interno'));

      await realizarLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao realizar o login.' });
    });

  describe('buscarUsuario', () => {
    test('deve buscar o usuário com sucesso', async () => {
      const req = {
        usuario: { userId: 'testId' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const usuarioEncontrado = new Usuario({
        _id: 'testId',
        nome: 'Teste',
        email: 'teste@example.com',
      });
      Usuario.findOne.mockResolvedValue(usuarioEncontrado);

      await buscarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: usuarioEncontrado._id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
      });
    });

    test('deve retornar erro para usuário não encontrado', async () => {
      const req = {
        usuario: { userId: 'testId' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Usuario.findOne.mockResolvedValue(null);

      await buscarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Usuário não encontrado' });
    });

    test('deve retornar erro interno ao buscar usuário', async () => {
      const req = {
        usuario: { userId: 'testId' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Usuario.findOne.mockRejectedValue(new Error('Erro interno'));

      await buscarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao buscar usuário' });
    });
  });
