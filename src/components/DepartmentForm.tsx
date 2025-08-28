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
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  InputAdornment,
  Divider,
  Checkbox,
  Avatar
} from '@mui/material';

import { 
  Save, 
  Cancel, 
  Business, 
  Person, 
  Delete, 
  Info, 
  Description, 
  Group, 
  PersonAdd, 
  PersonOff 
} from '@mui/icons-material';
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
    description: '',
    managerId: '',
    employeeIds: [] as string[]
  });
  
  const [managers, setManagers] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const isEditing = !!department;

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
    
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        managerId: department.managerId || '',
        employeeIds: department.employeeIds || []
      });
    }
  }, [department]);

  // Função para carregar gestores e colaboradores
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
    // Gestor não é mais obrigatório na criação - pode ser definido depois
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
        description: formData.description.trim(),
        managerId: formData.managerId,
        employeeIds: formData.employeeIds
      };
      
      if (isEditing && department?.id) {
        await DepartmentService.updateDepartment(department.id, departmentData);
        setSuccess('Departamento atualizado com sucesso!');
      } else {
        await DepartmentService.createDepartment(departmentData);
        setSuccess('Departamento criado com sucesso!');
      }
      
      setTimeout(() => {
        onCancel();
      }, 1500);
      
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
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        {/* Cabeçalho aprimorado */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Business sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 0.5 }}>
                  {isEditing ? 'Editar Departamento' : 'Novo Departamento'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {isEditing 
                    ? 'Atualize as informações do departamento' 
                    : 'Preencha os dados para criar um novo departamento'
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
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

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '0.95rem'
                }
              }}
            >
              {success}
            </Alert>
          )}

          {/* Alerta informativo sobre fluxo de trabalho */}
          {!isEditing && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Dica:</strong> Você pode criar departamentos sem gestor definido e atribuir um gestor posteriormente. 
                Use a opção "Gerenciar Atribuições" na listagem de departamentos para fazer essas atribuições.
              </Typography>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Seção: Informações Básicas */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Info sx={{ fontSize: 20, color: 'primary.main' }} />
                 Informações Básicas
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Nome do Departamento */}
                <Box>
                  <TextField
                    fullWidth
                    label="Nome do Departamento"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                  />  
                </Box>
  
                  {/* Gestor Responsável */}
                  <Box>
                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>Gestor Responsável (Opcional)</InputLabel>
                    <Select
                      value={formData.managerId}
                      onChange={(e) => handleInputChange('managerId', e.target.value)}
                      label="Gestor Responsável (Opcional)"
                      sx={{
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main'
                        }
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <Person sx={{ color: 'primary.main', ml: 1 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Definir posteriormente</em>
                      </MenuItem>
                      {managers.map((manager) => (
                        <MenuItem key={manager.id} value={manager.id}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" fontWeight={500}>
                              {manager.personalInfo.firstName} {manager.personalInfo.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {manager.personalInfo.email}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
               </Box>
            </Box>

            {/* Seção: Descrição */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Description sx={{ fontSize: 20, color: 'primary.main' }} />
                Descrição
              </Typography>
              
              <TextField
                fullWidth
                label="Descrição (Opcional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                disabled={loading}
                placeholder="Descreva as responsabilidades e objetivos do departamento..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Box>

            {/* Seção: Adicionar Colaboradores */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <PersonAdd sx={{ fontSize: 20, color: 'primary.main' }} />
                Adicionar Colaboradores
              </Typography>
              
              <Box 
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  backgroundColor: 'grey.50',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50'
                  }
                }}
              >
                <Autocomplete
                  options={allEmployees.filter(emp => 
                    !formData.employeeIds.includes(emp.id || '') && 
                    emp.id !== formData.managerId
                  )}
                  getOptionLabel={(option) => 
                    `${option.personalInfo.firstName} ${option.personalInfo.lastName} - ${option.personalInfo.email}`
                  }
                  onChange={(_, value) => {
                    if (value) {
                      handleAddEmployee(value);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar colaboradores"
                      placeholder="Digite o nome ou email do colaborador..."
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Checkbox size="small" />
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {option.personalInfo.firstName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {option.personalInfo.firstName} {option.personalInfo.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.personalInfo.email}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  value={null}
                  disabled={loading}
                />
              </Box>
            </Box>

            {/* Seção: Colaboradores Selecionados */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Group sx={{ fontSize: 20, color: 'primary.main' }} />
                Colaboradores Selecionados ({formData.employeeIds.length})
              </Typography>
              
              <Box 
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  minHeight: 120,
                  p: 2,
                  backgroundColor: 'background.paper'
                }}
              >
                {formData.employeeIds.length === 0 ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minHeight: 100,
                      color: 'text.secondary'
                    }}
                  >
                    <PersonOff sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2">
                      Nenhum colaborador selecionado
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {formData.employeeIds.map((employeeId) => {
                      const employee = allEmployees.find(emp => emp.id === employeeId);
                      if (!employee) return null;
                      
                      return (
                        <ListItem 
                          key={employeeId}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                            backgroundColor: 'background.default',
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          <Avatar sx={{ mr: 2, width: 40, height: 40 }}>
                            {employee.personalInfo.firstName.charAt(0)}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={500}>
                                {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                {employee.personalInfo.email}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveEmployee(employeeId)}
                              disabled={loading}
                              sx={{
                                color: 'error.main',
                                '&:hover': {
                                  backgroundColor: 'error.50'
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Botões de Ação */}
             <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={loading}
                  startIcon={<Cancel />}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    borderColor: 'grey.300',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'grey.400',
                      backgroundColor: 'grey.50'
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? null : <Save />}
                  disabled={loading}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: 'grey.300',
                      boxShadow: 'none',
                      transform: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      {isEditing ? 'Atualizando...' : 'Criando...'}
                    </Box>
                  ) : (
                    isEditing ? 'Atualizar Departamento' : 'Criar Departamento'
                  )}
                </Button>
              </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};