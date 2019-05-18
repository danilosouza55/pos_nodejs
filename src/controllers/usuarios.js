const {
    Usuario
} = require('../models/index')

const {
    generateToken
} = require('../utils/token')

const {
    isCPF
} = require('../utils/customValidators')

const bcrypt = require('bcryptjs')
const saltRounds = 10

function cadastro(req, res, next) {
    const usuario = req.body;

    if (!isCPF(usuario.cpf)) {
        res.status(422).send('CPF invalido');
    }

    Usuario.create({
            nome: usuario.nome,
            email: usuario.email,
            nascimento: usuario.nascimento,
            cpf: usuario.cpf,
            senha: bcrypt.hashSync(usuario.senha, saltRounds) // estudar sobre hash de senha com bcrypt
        })
        .then(function(usuarioCriado) {
            // usuário inserido com sucesso
            const usuarioJson = usuarioCriado.toJSON()
            delete usuarioJson.senha;
            res.status(201).json(usuarioJson)
        })
        .catch(function(error) {
            // falha ao inserir o usuário
            if (Array.isArray(error.errors)) {
                const sequelizeError = error.errors[0]
                if (sequelizeError.type === 'unique violation' &&
                    sequelizeError.path === 'email') {
                    res.status(422).send('O e-mail informado já existe no banco de dados.');
                    return;
                }
            }
            res.status(422).send();
        })
}

function buscaPorId(req, res, next) {
    const usuarioId = req.params.usuarioId

    Usuario.findByPk(usuarioId)
        .then(function(usuario) {
            if (usuario) {
                const usuarioJson = usuario.toJSON()
                delete usuarioJson.senha
                res.status(200).json(usuarioJson)
            } else {
                res.status(404).send()
            }
        })
        .catch(function(error) {
            console.log(error)
            res.status(422).send()
        })
}

function edicao(req, res, next) {
    const usuarioId = req.params.usuarioId
    const body = req.body

    Usuario.findByPk(usuarioId)
        .then(function(usuario) {
            if (usuario) {
                return usuario.update({
                        nome: body.nome,
                        email: body.email,
                        nascimento: body.nascimento,
                        cpf: body.cpf,
                        senha: body.senha, // criar uma específica para alterar a senha
                    })
                    .then(function(usuarioAtualizado) {
                        const usuarioJson = usuarioAtualizado.toJSON()
                        delete usuarioJson.senha
                        res.status(200).json(usuarioJson)
                    })
            } else {
                res.status(404).send()
            }
        })
        .catch(function(error) {
            console.log(error)
            res.status(422).send()
        })
}

function login(req, res, next) {
    // recebe as credenciais do usuário e valida com as informações de
    // autenticação
    const email = req.body.email;
    const senha = req.body.senha;

    const payload = [{
        id: 1,
        nome: 'Danilo',
        email: email,
        senha: senha
    }]

    console.log(payload[0].senha)

    if (payload[0].email == 'admin@gmail.com' && payload[0].senha == 'senha123') {
        // usuário autenticado com sucesso
        const token = generateToken(payload[0])
        res.json({
            token
        })
    } else {
        // email ou senha inválidos
        res.status(401).send('E-mail ou senha incorretos')
    }
}

module.exports = {
    cadastro,
    buscaPorId,
    edicao,
    login,
};