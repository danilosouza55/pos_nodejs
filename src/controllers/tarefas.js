const {
    Tarefa
} = require('../models/index')

const { Op } = require('sequelize')

function cadastro(req, res, next) {
    const tarefa = req.body;
    const usuario = req.usuarioLogado;

    Tarefa.create({
            titulo: tarefa.titulo,
            concluido: tarefa.concluido,
            usuarioId: usuario.id,
        })
        .then(function(usuarioCriado) {
            // tarefa inserido com sucesso
            res.status(201).json(usuarioCriado)
        })
        .catch(function(error) {
            res.status(422).send();
        })
}

function listagem(req, res, next) {
    const titulo = req.query.titulo;
    const concluido = req.query.concluido;
    const usuarioId = req.query.usuarioId;

    const where = {};
    if (titulo) {
        where.titulo = {
            [Op.like]: '%' + titulo + '%'
        }
    }
    if (concluido) {
        where.concluido = concluido
    }
    if (usuarioId) {
        where.usuarioId = usuarioId
    }

    Tarefa.findAll({
            attributes: ['id', 'titulo', 'concluido', 'usuarioId'],
            where
        })
        .then(function(tarefas) {
            res.status(200).json(tarefas)
        })
        .catch(function(error) {
            console.log(error)
            res.status(422).send()
        })
}

function buscaPorId(req, res, next) {
    const tarefaId = req.params.tarefaId

    Tarefa.findByPk(tarefaId)
        .then(function(tarefa) {
            if (tarefa) {
                const tarefaJson = tarefa.toJSON()
                res.status(200).json(tarefaJson)
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
    const tarefaId = req.params.tarefaId
    const body = req.body

    Tarefa.findByPk(tarefaId)
        .then(function(tarefa) {
            if (tarefa) {
                return tarefa.update({
                        titulo: body.titulo,
                        concluida: body.concluida,
                        usuarioId: body.usuarioId,
                    })
                    .then(function(tarefaAtualizado) {
                        res.status(200).json(tarefaAtualizado)
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

function remocao(req, res, next) {
    const tarefaId = req.params.tarefaId

    Tarefa.destroy({
            where: {
                id: tarefaId
            }
        })
        .then(function(removidos) {
            if (removidos > 0) {
                res.status(204).send()
            } else {
                res.status(404).send()
            }
        })
        .catch(function(error) {
            console.log(error)
                // res.status(422).send()
            next(error) // delega o tratamento de erro para o express
        })
}

function marcarConcluida(req, res, next) {
    const tarefaId = req.params.tarefaId

    Tarefa.findByPk(tarefaId)
        .then(function(tarefa) {
            if (tarefa) {
                return tarefa.update({
                        concluida: 1,
                    })
                    .then(function(tarefaAtualizado) {
                        res.status(200).json(tarefaAtualizado)
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

function desmarcarConcluida(req, res, next) {
    const tarefaId = req.params.tarefaId

    Tarefa.findByPk(tarefaId)
        .then(function(tarefa) {
            if (tarefa) {
                return tarefa.update({
                        concluida: 0,
                    })
                    .then(function(tarefaAtualizado) {
                        res.status(200).json(tarefaAtualizado)
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

module.exports = {
    cadastro,
    listagem,
    buscaPorId,
    edicao,
    remocao,
    marcarConcluida,
    desmarcarConcluida,
};