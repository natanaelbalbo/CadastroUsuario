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
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business color="primary" />
          Departamentos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onNewDepartment}
          size="large"
        >
          Novo Departamento
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barra de ferramentas */}
      <Paper sx={{ mb: 2 }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          {/* Campo de busca */}
          <TextField
            placeholder="Buscar por nome, gestor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          {/* Botão de exclusão em massa */}
          {selectedDepartments.length > 0 && (
            <Tooltip title={`Excluir ${selectedDepartments.length} departamento(s) selecionado(s)`}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweep />}
                onClick={handleMassDelete}
              >
                Excluir Selecionados ({selectedDepartments.length})
              </Button>
            </Tooltip>
          )}
        </Toolbar>
      </Paper>

      {/* Tabela de departamentos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedDepartments.length > 0 && selectedDepartments.length < filteredDepartments.length}
                  checked={filteredDepartments.length > 0 && selectedDepartments.length === filteredDepartments.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Gestor</TableCell>
              <TableCell align="center">Colaboradores</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchTerm ? 'Nenhum departamento encontrado com os critérios de busca.' : 'Nenhum departamento cadastrado.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((department) => (
                <TableRow
                  key={department.id}
                  hover
                  selected={selectedDepartments.includes(department.id!)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedDepartments.includes(department.id!)}
                      onChange={() => handleSelectDepartment(department.id!)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {department.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {department.manager ? (
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {department.manager.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {department.manager.email}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sem gestor
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<Person />}
                      label={department.employeeCount}
                      size="small"
                      color={department.employeeCount > 0 ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {department.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(department)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(department)}
                          color="error"
                        >
                          <Delete />
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

      {/* Dialog de confirmação de exclusão individual */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o departamento "{departmentToDelete?.name}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmação de exclusão em massa */}
      <Dialog open={massDeleteDialogOpen} onClose={() => setMassDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão em Massa</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir {selectedDepartments.length} departamento(s) selecionado(s)?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMassDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleMassDeleteConfirm} color="error" variant="contained">
            Excluir Todos
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};