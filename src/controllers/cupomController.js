const Cupom = require('../models/cupomModel');
const qrcode = require('qrcode');

// Função para gerar código de 8 dígitos com letras maiúsculas e números
function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
}

// Função para gerar QR code e código, salvar os dados do cupom e retornar o QR code e o código
async function createCupom(req, res) {
    try {
        const { nome, cpf, valor, formaPagamento } = req.body;

        // Gerar código
        const codigo = generateCode();

        // Gerar QR code
        const qrCode = await qrcode.toDataURL('http://localhost:3000/cupons/' + codigo);

        // Salvar os dados do cupom no banco de dados
        const cupom = new Cupom({
            nome,
            cpf,
            valor,
            formaPagamento,
            qrCode,
            codigo
        });
        await cupom.save();

        // Retornar o QR code e o código gerado
        res.json({ qrCode, codigo });
    } catch (error) {
        console.error('Erro ao criar cupom:', error);
        res.status(500).json({ message: 'Erro ao criar cupom' });
    }
}

async function dadosCupom(req, res) {
    try {
        const { codigo, qrCode } = req.body;

        let cupom;
        if (codigo && !qrCode) {
            // Se o código foi fornecido e o qrCode não foi fornecido,
            // procurar o cupom pelo código
            cupom = await Cupom.findOne({ codigo });
        } else if (qrCode && !codigo) {
            // Se o QR code foi fornecido e o código não foi fornecido,
            // procurar o cupom pelo QR code
            cupom = await Cupom.findOne({ qrCode });
        } else {
            // Se ambos ou nenhum código ou QR code foram fornecidos,
            // retornar um erro
            return res.status(400).json({ message: 'Forneça um código ou um QR code' });
        }

        if (!cupom) {
            // Se o cupom não foi encontrado, retornar um erro
            return res.status(404).json({ message: 'Cupom não encontrado' });
        }

        if (cupom.validado){
            return res.status(400).json({ message: 'Este cupom já foi validado'})
        }

        // Cupom encontrado, retornar todos os dados do cupom
        res.json(cupom);
    } catch (error) {
        console.error('Erro ao validar cupom:', error);
        res.status(500).json({ message: 'Erro ao validar cupom' });
    }
}

async function validarCupomById(req, res) {
    try {
        const { id } = req.params;
        console.log(id)

        // Procurar o cupom pelo ID
        const cupom = await Cupom.findById(id);

        if (!cupom) {
            // Se o cupom não foi encontrado, retorne um erro
            return res.status(404).json({ message: 'Cupom não encontrado' });
        }

        // Verificar se o cupom já está validado
        if (cupom.validado) {
            // Se o cupom já estiver validado, retorne uma mensagem
            return res.status(400).json({ message: 'Cupom já validado' });
        }

        // Atualizar o cupom para validado
        const updatedCupom = await Cupom.findByIdAndUpdate(id, { validado: true }, { new: true });

        // Retorne o cupom atualizado
        res.json(updatedCupom);
    } catch (error) {
        console.error('Erro ao validar cupom:', error);
        res.status(500).json({ message: 'Erro ao validar cupom' });
    }
}

async function pegarCuponsValidos(req, res) {
    try {
        // Buscar todos os cupons validados, ordenados pela data de criação decrescente
        const cupons = await Cupom.find({ validado: true }).sort({ createdAt: -1 });

        // Retornar os cupons encontrados
        res.status(200).json(cupons);
    } catch (error) {
        console.error('Erro ao buscar cupons validados:', error);
        res.status(500).json({ message: 'Erro ao buscar cupons validados' });
    }
}


module.exports = { createCupom, dadosCupom, validarCupomById, pegarCuponsValidos };
