import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import { Save, Cancel, Business, Person, Delete } from '@mui/icons-material';
import { DepartmentService } from '../services/departmentService';
import { EmployeeService } from '../services/employeeService';
import type { Department } from '../types/Department';
import type { Employee } from '../types/Employee';

interface DepartmentFormProps {
  department?: Department | null;
  onCancel: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({ 
  department, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    managerId: '',
    employeeIds: [] as string[],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const isEditing = Boolean(department);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        managerId: department.managerId,
        employeeIds: department.employeeIds,
        description: department.description || ''
      });
    }
  }, [department]);

  useEffect(() => {
    // Atualizar lista de colaboradores selecionados quando employeeIds mudar
    const selected = allEmployees.filter(emp => 
      formData.employeeIds.includes(emp.id || '')
    );
    setSelectedEmployees(selected);

    // Atualizar lista de colaboradores disponíveis
    const available = allEmployees.filter(emp => 
      !formData.employeeIds.includes(emp.id || '') &&
      emp.id !== formData.managerId
    );
    setAvailableEmployees(available);
  }, [formData.employeeIds, formData.managerId, allEmployees]);

  // Carregar dados iniciais
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [managersData, employeesData] = await Promise.all([
        DepartmentService.getAvailableManagers(),
        EmployeeService.getAllEmployees()
      ]);
      setManagers(managersData);
      setAllEmployees(employeesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados necessários');
    } finally {
      setLoading(false);
    }
  };

  // Handler para mudanças nos campos
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  // Adicionar colaborador ao departamento
  const handleAddEmployee = (employee: Employee) => {
    if (!employee.id || formData.employeeIds.includes(employee.id)) return;
    
    const updatedEmployeeIds = [...formData.employeeIds, employee.id];
    handleInputChange('employeeIds', updatedEmployeeIds);
  };

  // Remover colaborador do departamento
  const handleRemoveEmployee = (employeeId: string) => {
    const updatedEmployeeIds = formData.employeeIds.filter(id => id !== employeeId);
    handleInputChange('employeeIds', updatedEmployeeIds);
  };

  // Validar formulário
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Nome do departamento é obrigatório');
      return false;
    }
    if (!formData.managerId) {
      setError('Gestor responsável é obrigatório');
      return false;
    }
    return true;
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const departmentData = {
        name: formData.name.trim(),
        managerId: formData.managerId,
        employeeIds: formData.employeeIds,
        description: formData.description.trim()
      };

      if (isEditing && department?.id) {
        await DepartmentService.updateDepartment(department.id, departmentData);
        setSuccess('Departamento atualizado com sucesso!');
      } else {
        await DepartmentService.createDepartment(departmentData);
        setSuccess('Departamento criado com sucesso!');
      }

      // Voltar para a lista após 2 segundos
      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar departamento:', error);
      setError('Erro ao salvar departamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Business color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            {isEditing ? 'Editar Departamento' : 'Novo Departamento'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações básicas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações Básicas
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Departamento"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Gestor Responsável</InputLabel>
                <Select
                  value={formData.managerId}
                  onChange={(e) => handleInputChange('managerId', e.target.value)}
                  disabled={loading}
                >
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.personalInfo.firstName} {manager.personalInfo.lastName} - {manager.personalInfo.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição (Opcional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Gestão de colaboradores */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Colaboradores do Departamento
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Adicionar Colaboradores
              </Typography>
              <Autocomplete
                options={availableEmployees}
                getOptionLabel={(option) => 
                  `${option.personalInfo.firstName} ${option.personalInfo.lastName} - ${option.personalInfo.email}`
                }
                onChange={(event, value) => {
                  if (value) {
                    handleAddEmployee(value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar colaborador..."
                    disabled={loading}
                  />
                )}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Colaboradores Selecionados ({selectedEmployees.length})
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                {selectedEmployees.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum colaborador selecionado
                    </Typography>
                  </Box>
                ) : (
                  <List dense>
                    {selectedEmployees.map((employee) => (
                      <ListItem key={employee.id}>
                        <ListItemText
                          primary={`${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`}
                          secondary={`${employee.personalInfo.email} - ${employee.jobInfo.position}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleRemoveEmployee(employee.id!)}
                            disabled={loading}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            {/* Botões de ação */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    isEditing ? 'Atualizar' : 'Criar'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};