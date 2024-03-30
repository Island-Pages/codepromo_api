const Cupom = require('../models/cupomModel');
const qrcode = require('qrcode');

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
}



async function createCupom(req, res) {
    try {
        const { nome, cpf, valor, formaPagamento, tempoDuracao } = req.body;

        const codigo = generateCode();
        const qrCode = await qrcode.toDataURL('http://localhost:3000/cupons/' + codigo);

        const cupomData = {
            nome,
            cpf,
            valor,
            formaPagamento,
            qrCode,
            codigo,
            tempoDuracao 
        };

        const cupom = new Cupom(cupomData);
        await cupom.save();

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
            cupom = await Cupom.findOne({ codigo });
        } else if (qrCode && !codigo) {
            cupom = await Cupom.findOne({ qrCode });
        } else {
            return res.status(400).json({ message: 'Forneça um código ou um QR code' });
        }

        if (!cupom) {
            return res.status(404).json({ message: 'Cupom não encontrado' });
        }

        if (cupom.validado) {
            return res.status(400).json({ message: 'Este cupom já foi validado' });
        }

        if (cupom.tempoDuracao && new Date(cupom.tempoDuracao) < new Date()) {
            return res.status(400).json({ message: 'Este cupom expirou' });
        }

        res.json(cupom);
    } catch (error) {
        console.error('Erro ao validar cupom:', error);
        res.status(500).json({ message: 'Erro ao validar cupom' });
    }
}

async function validarCupomById(req, res) {
    try {
        const { id } = req.params;

        const cupom = await Cupom.findById(id);

        if (!cupom) {
            return res.status(404).json({ message: 'Cupom não encontrado' });
        }

        if (cupom.validado) {
            return res.status(400).json({ message: 'Cupom já validado' });
        }

        if (cupom.tempoDuracao && new Date(cupom.tempoDuracao) < new Date()) {
            return res.status(400).json({ message: 'Este cupom expirou' });
        }

        const updatedCupom = await Cupom.findByIdAndUpdate(id, { validado: true }, { new: true });

        res.json(updatedCupom);
    } catch (error) {
        console.error('Erro ao validar cupom:', error);
        res.status(500).json({ message: 'Erro ao validar cupom' });
    }
}

async function pegarCuponsValidos(req, res) {
    try {
        const cupons = await Cupom.find({ validado: true }).sort({ createdAt: -1 });

        res.status(200).json(cupons);
    } catch (error) {
        console.error('Erro ao buscar cupons validados:', error);
        res.status(500).json({ message: 'Erro ao buscar cupons validados' });
    }
}

module.exports = { createCupom, dadosCupom, validarCupomById, pegarCuponsValidos };
