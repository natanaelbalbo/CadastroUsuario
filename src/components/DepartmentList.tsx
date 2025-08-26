import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Toolbar,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DeleteSweep,
  Search,
  Business,
  Person
} from '@mui/icons-material';
import { DepartmentService } from '../services/departmentService';
import type { Department, DepartmentWithDetails } from '../types/Department';

interface DepartmentListProps {
  onNewDepartment: () => void;
  onEdit: (department: Department) => void;
}

export const DepartmentList: React.FC<DepartmentListProps> = ({ 
  onNewDepartment, 
  onEdit 
}) => {
  const [departments, setDepartments] = useState<DepartmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [massDeleteDialogOpen, setMassDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  // Carregar lista de departamentos
  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DepartmentService.getDepartmentsWithDetails();
      setDepartments(data);
    } catch (err) {
      setError('Erro ao carregar departamentos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar departamentos baseado na busca
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.manager?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.manager?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers para seleção
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDepartments(filteredDepartments.map(dept => dept.id!));
    } else {
      setSelectedDepartments([]);
    }
  };

  const handleSelectDepartment = (departmentId: string) => {
    setSelectedDepartments(prev => {
      if (prev.includes(departmentId)) {
        return prev.filter(id => id !== departmentId);
      } else {
        return [...prev, departmentId];
      }
    });
  };

  // Handlers para exclusão
  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!departmentToDelete) return;

    try {
      await DepartmentService.deleteDepartment(departmentToDelete.id!);
      await loadDepartments();
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir departamento:', error);
      setError('Erro ao excluir departamento');
    }
  };

  const handleMassDelete = () => {
    if (selectedDepartments.length === 0) return;
    setMassDeleteDialogOpen(true);
  };

  const handleMassDeleteConfirm = async () => {
    try {
      await Promise.all(
        selectedDepartments.map(id => DepartmentService.deleteDepartment(id))
      );
      await loadDepartments();
      setSelectedDepartments([]);
      setMassDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir departamentos:', error);
      setError('Erro ao excluir departamentos');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1400px', mx: 'auto' }}>
      {/* Cabeçalho com melhor hierarquia visual */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              fontWeight: 600,
              color: 'text.primary',
              mb: 0.5
            }}
          >
            <Business color="primary" sx={{ fontSize: 32 }} />
            Departamentos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie os departamentos da sua organização
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onNewDepartment}
          size="large"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Novo Departamento
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
          }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Barra de ferramentas aprimorada */}
      <Paper 
        elevation={1}
        sx={{ 
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2, 
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between'
          }}>
            {/* Campo de busca melhorado */}
            <TextField
              placeholder="Buscar por nome, gestor ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                minWidth: { xs: '100%', md: 350 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }
                }
              }}
            />

            {/* Botão de exclusão em massa melhorado */}
            {selectedDepartments.length > 0 && (
              <Tooltip title={`Excluir ${selectedDepartments.length} departamento(s) selecionado(s)`}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteSweep />}
                  onClick={handleMassDelete}
                  sx={{
                    borderRadius: 2,
                    px: 2.5,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Excluir Selecionados ({selectedDepartments.length})
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Tabela de departamentos aprimorada */}
      <TableContainer 
        component={Paper} 
        elevation={1}
        sx={{ 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow 
              sx={{ 
                backgroundColor: 'grey.50',
                '& .MuiTableCell-head': {
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  borderBottom: '2px solid',
                  borderBottomColor: 'divider',
                  py: 2
                }
              }}
            >
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox
                  indeterminate={selectedDepartments.length > 0 && selectedDepartments.length < filteredDepartments.length}
                  checked={filteredDepartments.length > 0 && selectedDepartments.length === filteredDepartments.length}
                  onChange={handleSelectAll}
                  sx={{
                    '&.Mui-checked': {
                      color: 'primary.main'
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ minWidth: 200 }}>Nome do Departamento</TableCell>
              <TableCell sx={{ minWidth: 220 }}>Gestor Responsável</TableCell>
              <TableCell align="center" sx={{ width: 140 }}>Colaboradores</TableCell>
              <TableCell sx={{ minWidth: 250 }}>Descrição</TableCell>
              <TableCell align="center" sx={{ width: 120 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Business sx={{ fontSize: 48, color: 'text.disabled' }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                      {searchTerm ? 'Nenhum departamento encontrado' : 'Nenhum departamento cadastrado'}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      {searchTerm 
                        ? 'Tente ajustar os critérios de busca' 
                        : 'Clique em "Novo Departamento" para começar'
                      }
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((department, index) => (
                <TableRow
                  key={department.id}
                  hover
                  selected={selectedDepartments.includes(department.id!)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'primary.50',
                      '&:hover': {
                        backgroundColor: 'primary.100'
                      }
                    },
                    '& .MuiTableCell-root': {
                      borderBottom: index === filteredDepartments.length - 1 ? 'none' : '1px solid',
                      borderBottomColor: 'divider',
                      py: 2.5
                    }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedDepartments.includes(department.id!)}
                      onChange={() => handleSelectDepartment(department.id!)}
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: 2, 
                          backgroundColor: 'primary.50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Business sx={{ fontSize: 20, color: 'primary.main' }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                          {department.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {department.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {department.manager ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            backgroundColor: 'success.50',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Person sx={{ fontSize: 16, color: 'success.main' }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ mb: 0.25 }}>
                            {department.manager.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {department.manager.email}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Person sx={{ fontSize: 16, color: 'text.disabled' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          Sem gestor definido
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<Person />}
                      label={`${department.employeeCount} ${department.employeeCount === 1 ? 'pessoa' : 'pessoas'}`}
                      size="medium"
                      variant={department.employeeCount > 0 ? 'filled' : 'outlined'}
                      color={department.employeeCount > 0 ? 'primary' : 'default'}
                      sx={{
                        fontWeight: 500,
                        borderRadius: 2,
                        '& .MuiChip-icon': {
                          fontSize: 16
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4,
                        color: department.description ? 'text.primary' : 'text.secondary',
                        fontStyle: department.description ? 'normal' : 'italic'
                      }}
                      title={department.description || 'Sem descrição'}
                    >
                      {department.description || 'Sem descrição'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="Editar departamento" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onEdit(department)}
                          sx={{
                            color: 'primary.main',
                            backgroundColor: 'primary.50',
                            '&:hover': {
                              backgroundColor: 'primary.100',
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir departamento" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(department)}
                          sx={{
                            color: 'error.main',
                            backgroundColor: 'error.50',
                            '&:hover': {
                              backgroundColor: 'error.100',
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmação de exclusão individual aprimorado */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 2, 
                backgroundColor: 'error.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Delete sx={{ fontSize: 24, color: 'error.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Confirmar Exclusão
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esta ação não pode ser desfeita
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tem certeza que deseja excluir o departamento:
          </Typography>
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: 'grey.50', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} color="error.main">
              {departmentToDelete?.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Todos os dados relacionados a este departamento serão removidos permanentemente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Excluir Departamento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmação de exclusão em massa aprimorado */}
      <Dialog 
        open={massDeleteDialogOpen} 
        onClose={() => setMassDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 2, 
                backgroundColor: 'error.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DeleteSweep sx={{ fontSize: 24, color: 'error.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Exclusão em Massa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esta ação não pode ser desfeita
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tem certeza que deseja excluir os seguintes departamentos:
          </Typography>
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: 'grey.50', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              mb: 2
            }}
          >
            <Typography variant="h6" fontWeight={600} color="error.main" sx={{ mb: 1 }}>
              {selectedDepartments.length} departamento(s) selecionado(s)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Todos os dados relacionados a estes departamentos serão removidos permanentemente.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => setMassDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleMassDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Excluir Todos ({selectedDepartments.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};