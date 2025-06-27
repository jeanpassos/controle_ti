import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { menuService } from '../../services/menuService';
import { useAuth } from '../../hooks/useAuth';

const ConfiguracoesMenu = () => {
  const { usuario } = useAuth();
  const [itensMenu, setItensMenu] = useState([]);
  const [menusPai, setMenusPai] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [confirmacaoExclusaoAberta, setConfirmacaoExclusaoAberta] = useState(false);
  const [menuAtual, setMenuAtual] = useState(null);
  const [snackbarAberta, setSnackbarAberta] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState('success');
  const [formDados, setFormDados] = useState({
    titulo: '',
    descricao: '',
    icone: '',
    url: '',
    componente: '',
    ordem: 0,
    ativo: true,
    externo: false,
    requer_auth: true,
    nivel_min: 1,
    permissoes: '',
    pai_id: null
  });

  // Carregar dados do menu
  const carregarMenu = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await menuService.listarAdmin();
      setItensMenu(resposta);
      
      // Filtrar apenas menus pai para o select
      const menusPrincipais = resposta.filter(item => !item.pai_id);
      setMenusPai(menusPrincipais);
      
    } catch (error) {
      console.error('Erro ao carregar menu:', error);
      setErro('Falha ao carregar itens de menu. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMenu();
  }, []);

  // Manipuladores de formulário
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDados({
      ...formDados,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Abrir diálogo de criação/edição
  const handleAbrirDialog = (menu = null) => {
    if (menu) {
      setMenuAtual(menu);
      setFormDados({
        titulo: menu.titulo,
        descricao: menu.descricao || '',
        icone: menu.icone || '',
        url: menu.url || '',
        componente: menu.componente || '',
        ordem: menu.ordem || 0,
        ativo: menu.ativo,
        externo: menu.externo,
        requer_auth: menu.requer_auth,
        nivel_min: menu.nivel_min,
        permissoes: menu.permissoes || '',
        pai_id: menu.pai_id || null
      });
    } else {
      setMenuAtual(null);
      setFormDados({
        titulo: '',
        descricao: '',
        icone: '',
        url: '',
        componente: '',
        ordem: 0,
        ativo: true,
        externo: false,
        requer_auth: true,
        nivel_min: 1,
        permissoes: '',
        pai_id: null
      });
    }
    setDialogAberto(true);
  };

  // Fechar diálogo
  const handleFecharDialog = () => {
    setDialogAberto(false);
  };

  // Salvar menu (criar ou atualizar)
  const handleSalvarMenu = async () => {
    try {
      if (menuAtual) {
        // Atualização
        await menuService.atualizar(menuAtual.id, formDados);
        setSnackbarMensagem('Menu atualizado com sucesso!');
      } else {
        // Criação
        await menuService.criar(formDados);
        setSnackbarMensagem('Menu criado com sucesso!');
      }
      
      setSnackbarTipo('success');
      setSnackbarAberta(true);
      setDialogAberto(false);
      carregarMenu(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao salvar menu:', error);
      setSnackbarMensagem('Erro ao salvar menu. Por favor, tente novamente.');
      setSnackbarTipo('error');
      setSnackbarAberta(true);
    }
  };

  // Abrir diálogo de confirmação de exclusão
  const handleAbrirConfirmacaoExclusao = (menu) => {
    setMenuAtual(menu);
    setConfirmacaoExclusaoAberta(true);
  };

  // Fechar diálogo de confirmação de exclusão
  const handleFecharConfirmacaoExclusao = () => {
    setConfirmacaoExclusaoAberta(false);
  };

  // Excluir menu
  const handleExcluirMenu = async () => {
    try {
      await menuService.remover(menuAtual.id);
      setSnackbarMensagem('Menu excluído com sucesso!');
      setSnackbarTipo('success');
      setSnackbarAberta(true);
      handleFecharConfirmacaoExclusao();
      carregarMenu(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir menu:', error);
      setSnackbarMensagem('Erro ao excluir menu. Por favor, tente novamente.');
      setSnackbarTipo('error');
      setSnackbarAberta(true);
    }
  };

  // Mover item para cima/baixo na ordem
  const handleMoverOrdem = async (menu, direcao) => {
    const novosItens = [...itensMenu];
    const index = novosItens.findIndex(item => item.id === menu.id);
    
    // Calcular nova ordem
    let novaOrdem;
    if (direcao === 'cima' && index > 0) {
      novaOrdem = novosItens[index - 1].ordem;
      novosItens[index - 1].ordem = menu.ordem;
    } else if (direcao === 'baixo' && index < novosItens.length - 1) {
      novaOrdem = novosItens[index + 1].ordem;
      novosItens[index + 1].ordem = menu.ordem;
    } else {
      return; // Não é possível mover
    }
    
    try {
      // Atualizar a ordem do item atual
      await menuService.atualizar(menu.id, { ...menu, ordem: novaOrdem });
      carregarMenu(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao alterar ordem:', error);
      setSnackbarMensagem('Erro ao alterar ordem do menu.');
      setSnackbarTipo('error');
      setSnackbarAberta(true);
    }
  };

  // Fechar snackbar
  const handleFecharSnackbar = () => {
    setSnackbarAberta(false);
  };

  // Renderização condicional para níveis de acesso
  const renderizarNivelAcesso = (nivel) => {
    switch (nivel) {
      case 1: return 'Administrador';
      case 2: return 'Gerente';
      case 3: return 'Técnico';
      case 4: return 'Usuário';
      default: return `Nível ${nivel}`;
    }
  };

  // Verificar se o usuário é admin
  const isAdmin = usuario && usuario.nivel_id === 1;

  if (!isAdmin) {
    return (
      <Container>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" color="error">
            Acesso Restrito
          </Typography>
          <Typography variant="body1">
            Você não tem permissão para acessar esta página.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Menu
        </Typography>
        <Typography variant="body1" paragraph>
          Configure os itens do menu dinâmico do sistema. Você pode adicionar, editar, remover e reordenar os itens.
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleAbrirDialog()}
          >
            Adicionar Item
          </Button>
        </Box>
        
        {carregando ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : erro ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {erro}
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>URL / Componente</TableCell>
                  <TableCell>Ordem</TableCell>
                  <TableCell>Nível Mínimo</TableCell>
                  <TableCell>Pai</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itensMenu.map((menu) => (
                  <TableRow key={menu.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {menu.icone && (
                          <span className="material-icons" style={{ marginRight: '8px' }}>
                            {menu.icone}
                          </span>
                        )}
                        {menu.titulo}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {menu.url || menu.componente || '-'}
                    </TableCell>
                    <TableCell>{menu.ordem}</TableCell>
                    <TableCell>{renderizarNivelAcesso(menu.nivel_min)}</TableCell>
                    <TableCell>
                      {menu.pai_id ? itensMenu.find(m => m.id === menu.pai_id)?.titulo || menu.pai_id : '-'}
                    </TableCell>
                    <TableCell>
                      {menu.ativo ? (
                        <Typography variant="body2" color="primary">Ativo</Typography>
                      ) : (
                        <Typography variant="body2" color="error">Inativo</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Mover para cima">
                        <IconButton 
                          size="small" 
                          color="default"
                          onClick={() => handleMoverOrdem(menu, 'cima')}
                        >
                          <ArrowUpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mover para baixo">
                        <IconButton 
                          size="small" 
                          color="default"
                          onClick={() => handleMoverOrdem(menu, 'baixo')}
                        >
                          <ArrowDownIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleAbrirDialog(menu)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleAbrirConfirmacaoExclusao(menu)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {itensMenu.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Nenhum item de menu encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      
      {/* Diálogo de criação/edição */}
      <Dialog 
        open={dialogAberto} 
        onClose={handleFecharDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {menuAtual ? 'Editar Item de Menu' : 'Adicionar Item de Menu'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="titulo"
                label="Título"
                fullWidth
                required
                value={formDados.titulo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="icone"
                label="Ícone (nome do Material Icons)"
                fullWidth
                helperText="Ex: dashboard, settings, person"
                value={formDados.icone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="url"
                label="URL"
                fullWidth
                helperText="Ex: /dashboard, /configuracoes/usuarios"
                value={formDados.url}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="componente"
                label="Componente React"
                fullWidth
                helperText="Nome do componente React (ex: Dashboard, ConfiguracoesUsuarios)"
                value={formDados.componente}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descricao"
                label="Descrição"
                fullWidth
                multiline
                rows={2}
                value={formDados.descricao}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Menu Pai</InputLabel>
                <Select
                  name="pai_id"
                  value={formDados.pai_id || ''}
                  label="Menu Pai"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>Nenhum (Menu Principal)</em>
                  </MenuItem>
                  {menusPai.map((pai) => (
                    <MenuItem key={pai.id} value={pai.id}>
                      {pai.titulo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Nível de Acesso Mínimo</InputLabel>
                <Select
                  name="nivel_min"
                  value={formDados.nivel_min}
                  label="Nível de Acesso Mínimo"
                  onChange={handleInputChange}
                >
                  <MenuItem value={1}>Administrador</MenuItem>
                  <MenuItem value={2}>Gerente</MenuItem>
                  <MenuItem value={3}>Técnico</MenuItem>
                  <MenuItem value={4}>Usuário</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="ordem"
                label="Ordem"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
                value={formDados.ordem}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                name="permissoes"
                label="Permissões (opcional)"
                fullWidth
                helperText="Permissões específicas, separadas por vírgula"
                value={formDados.permissoes}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="ativo"
                    checked={formDados.ativo}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Ativo"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="externo"
                    checked={formDados.externo}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Link Externo"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="requer_auth"
                    checked={formDados.requer_auth}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Requer Autenticação"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialog}>Cancelar</Button>
          <Button 
            onClick={handleSalvarMenu} 
            color="primary" 
            variant="contained"
            disabled={!formDados.titulo}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={confirmacaoExclusaoAberta}
        onClose={handleFecharConfirmacaoExclusao}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o item de menu "{menuAtual?.titulo}"?
            {menuAtual?.filhos?.length > 0 && (
              <strong> Esta operação também excluirá todos os subitens associados!</strong>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharConfirmacaoExclusao}>Cancelar</Button>
          <Button onClick={handleExcluirMenu} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarAberta}
        autoHideDuration={6000}
        onClose={handleFecharSnackbar}
      >
        <Alert 
          onClose={handleFecharSnackbar} 
          severity={snackbarTipo}
          sx={{ width: '100%' }}
        >
          {snackbarMensagem}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ConfiguracoesMenu;
