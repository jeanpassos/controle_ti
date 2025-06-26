const express = require('express');
const router = express.Router();

// Importação das rotas
const authRoutes = require('./authRoutes');
const nivelAcessoRoutes = require('./nivelAcessoRoutes');
const menuRoutes = require('./menuRoutes');
const temaRoutes = require('./temaRoutes');

// Definição das rotas base
router.use('/auth', authRoutes);
router.use('/niveis-acesso', nivelAcessoRoutes);
router.use('/menu', menuRoutes);
router.use('/temas', temaRoutes);

// Rota raiz da API
router.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'API Controle de TI',
    versao: '0.52',
    data: new Date().toISOString(),
    status: 'online',
  });
});

module.exports = router;
