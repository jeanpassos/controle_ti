import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea, 
  CardMedia, 
  Button, 
  TextField, 
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { FiCheck, FiEdit, FiPlus } from 'react-icons/fi';
import temaService from '../../services/temaService';

/**
 * Componente para configurações de tema e personalização visual
 */
const ConfiguracoesTema = ({ setErro, setLoading }) => {
  const [temas, setTemas] = useState([]);
  const [temaPadrao, setTemaPadrao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [temaAtual, setTemaAtual] = useState(null);

  // Carregar temas disponíveis
  useEffect(() => {
    // Flag para controlar se o componente está montado
    let isMounted = true;
    
    const carregarTemas = async () => {
      try {
        // Evitar mudança de estado se o componente foi desmontado
        if (!isMounted) return;
        
        setCarregando(true);
        // Usar um único estado local para controlar loading para evitar loop
        // setLoading(true);
        
        console.log('Carregando temas disponíveis...');
        
        // Buscar temas e tema padrão
        const [respostaTemas, respostaTemaPadrao] = await Promise.all([
          temaService.listar(),
          temaService.obterTemaPadrao()
        ]);

        // Evitar mudança de estado se o componente foi desmontado
        if (!isMounted) return;
        
        console.log('Temas carregados com sucesso:', respostaTemas.data.length);
        setTemas(respostaTemas.data);
        setTemaPadrao(respostaTemaPadrao.data);
        
        setErro(null);
      } catch (error) {
        // Evitar mudança de estado se o componente foi desmontado
        if (!isMounted) return;
        
        console.error('Erro ao carregar temas:', error);
        setErro('Não foi possível carregar os temas. Tente novamente mais tarde.');
      } finally {
        // Evitar mudança de estado se o componente foi desmontado
        if (!isMounted) return;
        
        setCarregando(false);
        setLoading(false);
      }
    };

    // Iniciar carregamento apenas uma vez
    carregarTemas();
    
    // Cleanup function para evitar vazamento de memória
    return () => {
      isMounted = false;
    };
  }, []); // Remover setErro e setLoading das dependências

  // Definir tema como padrão
  const handleDefinirPadrao = async (id) => {
    try {
      setCarregando(true);
      await temaService.definirComoPadrao(id);
      
      // Atualizar o tema padrão na interface
      const novoTemaPadrao = temas.find(tema => tema.id === id);
      setTemaPadrao(novoTemaPadrao);
      
      // Atualizar a lista de temas
      const temasPadrao = temas.map(tema => ({
        ...tema,
        padrao: tema.id === id
      }));
      
      setTemas(temasPadrao);
      setErro(null);
    } catch (error) {
      console.error('Erro ao definir tema padrão:', error);
      setErro('Não foi possível definir o tema como padrão. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  // Renderização do cartão de tema
  const renderizarCartaoTema = (tema) => {
    const isPadrao = temaPadrao && tema.id === temaPadrao.id;
    
    return (
      <Card 
        key={tema.id} 
        sx={{ 
          position: 'relative',
          border: isPadrao ? `2px solid ${tema.cor_primaria}` : 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 3
          }
        }}
      >
        {isPadrao && (
          <div 
            style={{ 
              position: 'absolute', 
              top: 10, 
              right: 10, 
              color: tema.cor_primaria,
              zIndex: 1
            }} 
          >
            <FiCheck size={24} />
          </div>
        )}
        <CardActionArea onClick={() => {}}>
          <CardMedia
            component="div"
            sx={{
              height: 120,
              background: `linear-gradient(135deg, ${tema.cor_primaria}, ${tema.cor_secundaria})`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {tema.logo_url && (
              <img 
                src={tema.logo_url} 
                alt={`Logo do tema ${tema.nome}`}
                style={{ maxHeight: '80px', maxWidth: '80%' }}
              />
            )}
            {!tema.logo_url && (
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                {tema.nome}
              </Typography>
            )}
          </CardMedia>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {tema.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {tema.descricao || 'Sem descrição'}
            </Typography>
            
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box sx={{
                  width: '100%',
                  height: 20,
                  bgcolor: tema.cor_primaria,
                  borderRadius: 1
                }} />
                <Typography variant="caption" color="text.secondary">Primária</Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{
                  width: '100%',
                  height: 20,
                  bgcolor: tema.cor_secundaria,
                  borderRadius: 1
                }} />
                <Typography variant="caption" color="text.secondary">Secundária</Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                size="small" 
                startIcon={<FiEdit />} 
                onClick={(e) => {
                  e.stopPropagation();
                  setTemaAtual(tema);
                  setEditando(true);
                }}
              >
                Editar
              </Button>
              
              {!isPadrao && (
                <Button 
                  size="small" 
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDefinirPadrao(tema.id);
                  }}
                >
                  Definir como Padrão
                </Button>
              )}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Personalização Visual
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<FiPlus />}
          onClick={() => {
            setTemaAtual(null);
            setEditando(true);
          }}
        >
          Novo Tema
        </Button>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Para personalizar a aparência do sistema, selecione um dos temas disponíveis ou crie um novo.
        O tema padrão será aplicado para todos os usuários que não selecionarem um tema específico.
      </Alert>

      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Temas Disponíveis
          </Typography>
          <Grid container spacing={3}>
            {temas.map(tema => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={tema.id}>
                {renderizarCartaoTema(tema)}
              </Grid>
            ))}
            {temas.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  Nenhum tema encontrado. Crie um novo tema para personalizar o sistema.
                </Alert>
              </Grid>
            )}
          </Grid>
        </>
      )}
      
      {/* Aqui seria implementado o modal/drawer de edição do tema */}
    </Box>
  );
};

export default ConfiguracoesTema;
