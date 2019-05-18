const express = require('express');
const router = express.Router();

const {
    authenticationMiddleware
} = require('../utils/token');
const controller = require('../controllers/tarefas');

/*******
 * TODO: Definição das rotas do CRUD de Tarefas.
 * Exemplo:
 * 
 * const validateBody = {
 *   // Schema de validação do Express Validator
 * };
 * 
 * 
 * router.post('/',
 *   authenticationMiddleware,
 *   controller.cadastro,
 * );
 *******/

// POST /tarefas
router.post('/',
    authenticationMiddleware,
    controller.cadastro,
);

// GET /tarefa/4
router.get('/:tarefaId',
    authenticationMiddleware,
    controller.buscaPorId,
);

// GET /tarefa
router.get('/',
    authenticationMiddleware,
    controller.listagem,
);

// PUT /tarefa/4
router.put('/:tarefaId',
    authenticationMiddleware,
    controller.edicao,
);

// DELETE /tarefa/4
router.delete('/:tarefaId',
    authenticationMiddleware,
    controller.remocao,
);

// GET /tarefa/4
router.put('/:tarefaId/concluida',
    authenticationMiddleware,
    controller.marcarConcluida,
);

// GET /tarefa/4
router.delete('/:tarefaId/concluida',
    authenticationMiddleware,
    controller.desmarcarConcluida,
);

module.exports = router;