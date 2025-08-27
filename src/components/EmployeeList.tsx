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
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  InputAdornment,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  DeleteSweep
} from '@mui/icons-material';
import type { Employee } from '../types/Employee';
import { EmployeeService } from '../services/employeeService';

interface EmployeeListProps {
  onNewEmployee: () => void;
  onEdit?: (employee: Employee) => void;
}

interface FilterState {
  name: string;
  email: string;
  department: string;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ onNewEmployee, onEdit }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    email: '',
    department: ''
  });
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, filters]);

  // Carregar colaboradores
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
      
      // Extrair departamentos únicos
      const uniqueDepartments = [...new Set(
        data.map(emp => emp.jobInfo.department).filter(Boolean)
      )];
      setDepartments(uniqueDepartments);
    } catch (err) {
      setError('Erro ao carregar colaboradores');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = employees;

    if (filters.name) {
      filtered = filtered.filter(emp => 
        `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`
          .toLowerCase()
          .includes(filters.name.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter(emp => 
        emp.personalInfo.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter(emp => 
        emp.jobInfo.department === filters.department
      );
    }

    setFilteredEmployees(filtered);
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({ name: '', email: '', department: '' });
  };

  // Seleção de colaboradores
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id!).filter(Boolean));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  // Exclusão individual
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete?.id) return;
    
    try {
      await EmployeeService.deleteEmployee(employeeToDelete.id);
      setEmployees(prev => prev.filter(e => e.id !== employeeToDelete.id));
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      setError('Erro ao excluir colaborador');
      console.error('Erro ao excluir:', err);
    }
  };

  // Exclusão em massa
  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await EmployeeService.deleteMultipleEmployees(selectedEmployees);
      setEmployees(prev => prev.filter(e => !selectedEmployees.includes(e.id!)));
      setSelectedEmployees([]);
      setBulkDeleteDialogOpen(false);
    } catch (err) {
      setError('Erro ao excluir colaboradores');
      console.error('Erro ao excluir:', err);
    }
  };

  // Utilitários
  const getStatusChip = (status: string = 'active') => {
    const isActive = status === 'active';
    return (
      <Chip
        label={isActive ? 'Ativo' : 'Inativo'}
        sx={{
          backgroundColor: isActive ? '#22c55e' : '#ef4444',
          color: 'white',
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24
        }}
      />
    );
  };

  const getEmployeeInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#22c55e', '#06b6d4'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(salary);
  };



  const getHierarchyLevelLabel = (level?: string) => {
    const levels: Record<string, string> = {
      'junior': 'Júnior',
      'pleno': 'Pleno',
      'senior': 'Sênior',
      'gestor': 'Gestor'
    };
    return levels[level || ''] || 'Não informado';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#22c55e' }} />
      </Box>
    );
  }

  const isAllSelected = selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0;
  const isIndeterminate = selectedEmployees.length > 0 && selectedEmployees.length < filteredEmployees.length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#111827', fontWeight: 600 }}>
          Colaboradores
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectedEmployees.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteSweep />}
              onClick={handleBulkDeleteClick}
              sx={{ textTransform: 'none' }}
            >
              Excluir Selecionados ({selectedEmployees.length})
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ textTransform: 'none' }}
          >
            Filtros
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onNewEmployee}
            sx={{
              backgroundColor: '#22c55e',
              '&:hover': { backgroundColor: '#16a34a' },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Novo Colaborador
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3, border: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Filtros de Busca</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Nome"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 200 }}
            />
            
            <TextField
              label="Email"
              value={filters.email}
              onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 200 }}
            />
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Departamento</InputLabel>
              <Select
                value={filters.department}
                label="Departamento"
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              >
                <MenuItem value="">Todos</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{ textTransform: 'none' }}
            >
              Limpar Filtros
            </Button>
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabela */}
      <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
        {filteredEmployees.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {employees.length === 0 ? 'Nenhum colaborador cadastrado' : 'Nenhum colaborador encontrado'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employees.length === 0 ? 'Clique em "Novo Colaborador" para começar' : 'Tente ajustar os filtros de busca'}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Toolbar de seleção */}
            {selectedEmployees.length > 0 && (
              <Toolbar sx={{ backgroundColor: '#f3f4f6', minHeight: '48px !important' }}>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {selectedEmployees.length} colaborador(es) selecionado(s)
                </Typography>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleBulkDeleteClick}
                  sx={{ textTransform: 'none' }}
                >
                  Excluir Selecionados
                </Button>
              </Toolbar>
            )}
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={isIndeterminate}
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>Nome</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>Cargo</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>Departamento</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>Nível</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>Salário</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#6b7280' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow 
                      key={employee.id}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f9fafb' },
                        backgroundColor: selectedEmployees.includes(employee.id!) ? '#f0f9ff' : 'inherit'
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id!)}
                          onChange={(e) => handleSelectEmployee(employee.id!, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: getAvatarColor(employee.personalInfo.firstName),
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}
                          >
                            {getEmployeeInitials(
                              employee.personalInfo.firstName, 
                              employee.personalInfo.lastName
                            )}
                          </Avatar>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#111827' }}>
                            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {employee.personalInfo.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {employee.jobInfo.jobTitle || 'Não informado'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {employee.jobInfo.department || 'Não informado'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getHierarchyLevelLabel(employee.jobInfo.hierarchyLevel)}
                          size="small"
                          sx={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {formatSalary(employee.jobInfo.baseSalary)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(employee.status)}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            onClick={() => onEdit && onEdit(employee)}
                            sx={{ mr: 1 }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteClick(employee)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>

      {/* Dialog de confirmação de exclusão individual */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o colaborador{' '}
            <strong>
              {employeeToDelete?.personalInfo.firstName} {employeeToDelete?.personalInfo.lastName}
            </strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmação de exclusão em massa */}
      <Dialog open={bulkDeleteDialogOpen} onClose={() => setBulkDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão em Massa</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir <strong>{selectedEmployees.length}</strong> colaborador(es) selecionado(s)?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmBulkDelete} color="error" variant="contained">
            Excluir Todos
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
