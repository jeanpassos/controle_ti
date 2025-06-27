import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Alert, Typography, Box, Paper, Container, CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import ConfiguracoesTema from './ConfiguracoesTema';
import ConfiguracoesSistema from './ConfiguracoesSistema';
import ConfiguracoesMenu from './ConfiguracoesMenu';

/**
 * Página centralizada de configurações do sistema
 * Permite personalização visual e configuração de parâmetros do sistema
 */
const Configuracoes = () => {
  const [tabAtual, setTabAtual] = useState(0);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();
  
  // Verificar nível de acesso para algumas abas
  const nivelAcesso = usuario?.nivel || 1;
  const isAdmin = nivelAcesso >= 3;

  const handleChangeTab = (event, novaTab) => {
    setTabAtual(novaTab);
  };

  return (
    <Container>
      <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Configurações do Sistema
        </Typography>
        
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={tabAtual}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="abas de configurações do sistema"
            >
              <Tab label="Tema e Visual" />
              <Tab label="Parâmetros do Sistema" />
              {isAdmin && <Tab label="Menu Dinâmico" />}
              {isAdmin && <Tab label="Avançado" />}
            </Tabs>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Tab Tema e Visual */}
              <div role="tabpanel" hidden={tabAtual !== 0}>
                {tabAtual === 0 && <ConfiguracoesTema setErro={setErro} setLoading={setLoading} />}
              </div>
              
              {/* Tab Parâmetros do Sistema */}
              <div role="tabpanel" hidden={tabAtual !== 1}>
                {tabAtual === 1 && <ConfiguracoesSistema setErro={setErro} setLoading={setLoading} />}
              </div>
              
              {/* Tab Menu Dinâmico */}
              <div role="tabpanel" hidden={tabAtual !== 2 || !isAdmin}>
                {tabAtual === 2 && isAdmin && (
                  <ConfiguracoesMenu />
                )}
              </div>
              
              {/* Tab Configurações Avançadas (admin) */}
              <div role="tabpanel" hidden={tabAtual !== 3 || !isAdmin}>
                {tabAtual === 3 && isAdmin && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Configurações Avançadas
                    </Typography>
                    <Typography variant="body1">
                      Esta seção está em desenvolvimento.
                    </Typography>
                  </Box>
                )}
              </div>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Configuracoes;
