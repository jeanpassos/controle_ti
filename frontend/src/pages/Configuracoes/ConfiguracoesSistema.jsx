import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../../hooks/useAuth';
import configuracoesService from '../../services/configuracoesService';

/**
 * Componente para configurações gerais do sistema
 */
const ConfiguracoesSistema = ({ setErro, setLoading }) => {
  const [configuracoes, setConfiguracoes] = useState({});
  const [grupos, setGrupos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [valoresAlterados, setValoresAlterados] = useState({});
  const [sucessos, setSucessos] = useState({});
  const { usuario } = useAuth();
  
  // Verificar nível de acesso
  const nivelAcesso = usuario?.nivel_id || 5; // Default para convidado (5) caso não tenha nível
  const isAdmin = nivelAcesso <= 2; // Admin (1) e Gerente (2) têm acesso administrativo

  // Carregar configurações do sistema
  useEffect(() => {
    // Flag para controlar se o componente está montado
    let isMounted = true;
    
    const carregarConfiguracoes = async () => {
      try {
        // Evitar mudança de estado se o componente foi desmontado
        if (!isMounted) return;
        
        setCarregando(true);
        // Usar um único estado local para controlar loading para evitar loop
        // setLoading(true);
        
        // Buscar todas as configurações (admin) ou apenas as visíveis (não admin)
        console.log('Carregando configurações do sistema...');
        const resposta = isAdmin 
          ? await configuracoesService.listarAdmin()
          : await configuracoesService.listar();

        // Evitar mudança de estado se o componente foi desmontado
        if (!isMounted) return;
        
        console.log('Configurações carregadas com sucesso:', Object.keys(resposta.data));
        setConfiguracoes(resposta.data);
        setGrupos(Object.keys(resposta.data));
        setErro(null);
      } catch (error) {
        // Evitar mudança de estado se o componente foi desmontado
        if (!isMounted) return;
        
        console.error('Erro ao carregar configurações:', error);
        setErro('Não foi possível carregar as configurações. Tente novamente mais tarde.');
      } finally {
        // Evitar mudança de estado se o componente foi desmontado
        if (!isMounted) return;
        
        setCarregando(false);
        setLoading(false);
      }
    };

    // Iniciar carregamento apenas uma vez
    carregarConfiguracoes();
    
    // Cleanup function para evitar vazamento de memória
    return () => {
      isMounted = false;
    };
  }, [isAdmin]); // Remover setErro e setLoading das dependências

  // Função para lidar com a alteração de valores
  const handleChange = (config, value) => {
    setValoresAlterados({
      ...valoresAlterados,
      [config.id]: value
    });
    
    // Limpar mensagem de sucesso se houver
    if (sucessos[config.id]) {
      const novosSucessos = { ...sucessos };
      delete novosSucessos[config.id];
      setSucessos(novosSucessos);
    }
  };

  // Função para salvar uma configuração
  const handleSalvar = async (config) => {
    try {
      const novoValor = valoresAlterados[config.id];
      
      if (novoValor === undefined) return;
      
      await configuracoesService.atualizar(config.id, { valor: novoValor });
      
      // Atualizar configurações locais
      const gruposAtualizados = { ...configuracoes };
      const grupo = gruposAtualizados[config.grupo];
      const index = grupo.findIndex(c => c.id === config.id);
      
      if (index >= 0) {
        gruposAtualizados[config.grupo][index] = {
          ...config,
          valor: novoValor
        };
      }
      
      setConfiguracoes(gruposAtualizados);
      
      // Remover do objeto de valores alterados
      const novosValores = { ...valoresAlterados };
      delete novosValores[config.id];
      setValoresAlterados(novosValores);
      
      // Mostrar mensagem de sucesso
      setSucessos({
        ...sucessos,
        [config.id]: true
      });
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSucessos(prevSucessos => {
          const novosSucessos = { ...prevSucessos };
          delete novosSucessos[config.id];
          return novosSucessos;
        });
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      setErro(`Não foi possível salvar a configuração "${config.chave}". Tente novamente.`);
    }
  };

  // Renderiza o input apropriado para cada tipo de configuração
  const renderizarInput = (config) => {
    const valor = valoresAlterados[config.id] !== undefined 
      ? valoresAlterados[config.id] 
      : config.valor;
      
    const foiAlterado = valoresAlterados[config.id] !== undefined;
    const mostraSucesso = sucessos[config.id];

    switch (config.tipo) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={valor === 'true' || valor === true}
                onChange={(e) => handleChange(config, e.target.checked)}
                color="primary"
                disabled={config.restrito && !isAdmin}
              />
            }
            label={valor === 'true' || valor === true ? 'Ativado' : 'Desativado'}
          />
        );
      
      case 'number':
        return (
          <TextField
            type="number"
            value={valor}
            onChange={(e) => handleChange(config, e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            disabled={config.restrito && !isAdmin}
          />
        );
      
      case 'text':
      default:
        return (
          <TextField
            value={valor}
            onChange={(e) => handleChange(config, e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            multiline={config.tipo === 'textarea'}
            rows={config.tipo === 'textarea' ? 3 : 1}
            disabled={config.restrito && !isAdmin}
          />
        );
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom>
        Parâmetros do Sistema
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Aqui você pode ajustar os parâmetros de configuração do sistema. 
        {!isAdmin && ' Algumas configurações restritas só podem ser editadas por administradores.'}
      </Alert>
      
      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {grupos.length === 0 ? (
            <Alert severity="warning">
              Nenhuma configuração encontrada.
            </Alert>
          ) : (
            grupos.map((grupo) => (
              <Accordion key={grupo} defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight="500">
                    {grupo}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {configuracoes[grupo].map((config) => (
                      <Grid item xs={12} md={config.tipo === 'textarea' ? 12 : 6} key={config.id}>
                        <Paper 
                          elevation={1} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            position: 'relative',
                            border: sucessos[config.id] ? '1px solid #4caf50' : 'none'
                          }}
                        >
                          {sucessos[config.id] && (
                            <Alert 
                              severity="success" 
                              sx={{ 
                                position: 'absolute', 
                                top: -20, 
                                right: 10,
                                fontSize: '0.75rem',
                                py: 0
                              }}
                            >
                              Salvo!
                            </Alert>
                          )}
                          
                          <Typography variant="subtitle2" gutterBottom>
                            {config.chave}
                            {config.restrito && (
                              <Typography 
                                component="span" 
                                variant="caption" 
                                sx={{ ml: 1, color: 'warning.main' }}
                              >
                                (Restrito)
                              </Typography>
                            )}
                          </Typography>
                          
                          {config.descricao && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {config.descricao}
                            </Typography>
                          )}
                          
                          <Box sx={{ mt: 1 }}>
                            {renderizarInput(config)}
                          </Box>
                          
                          {valoresAlterados[config.id] !== undefined && (
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <Button 
                                size="small" 
                                variant="contained" 
                                startIcon={<SaveIcon />}
                                onClick={() => handleSalvar(config)}
                              >
                                Salvar
                              </Button>
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </>
      )}
    </Box>
  );
};

export default ConfiguracoesSistema;
