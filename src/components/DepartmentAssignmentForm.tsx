import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Divider
} from '@mui/material';

import { 
  Assignment,
  Person,
  Business,
  Add,
  PersonAdd,
  Group
} from '@mui/icons-material';

import { PageHeader } from './common/PageHeader';

import { DepartmentService } from '../services/departmentService';
import { EmployeeService } from '../services/employeeService';
import type { Department } from '../types/Department';
import type { Employee } from '../types/Employee';

interface DepartmentAssignmentFormProps {
  onClose: () => void;
}

export const DepartmentAssignmentForm: React.FC<DepartmentAssignmentFormProps> = ({ onClose }) => {
  const [departmentsWithoutManager, setDepartmentsWithoutManager] = useState<Department[]>([]);
  const [employeesWithoutDepartment, setEmployeesWithoutDepartment] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para diálogos
  const [assignManagerDialog, setAssignManagerDialog] = useState<{
    open: boolean;
    department?: Department;
  }>({ open: false });
  
  const [assignEmployeesDialog, setAssignEmployeesDialog] = useState<{
    open: boolean;
    department?: Department;
  }>({ open: false });
  
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        deptWithoutManager,
        empWithoutDept,
        managersData,
        allDept
      ] = await Promise.all([
        DepartmentService.getDepartmentsWithoutManager(),
        EmployeeService.getEmployeesWithoutDepartment(),
        DepartmentService.getAvailableManagers(),
        DepartmentService.getAllDepartments()
      ]);
      
      setDepartmentsWithoutManager(deptWithoutManager);
      setEmployeesWithoutDepartment(empWithoutDept);
      setManagers(managersData);
      setAllDepartments(allDept);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados necessários');
    } finally {
      setLoading(false);
    }
  };

  // Atribuir gestor a departamento
  const handleAssignManager = async (departmentId: string, managerId: string) => {
    try {
      setLoading(true);
      await DepartmentService.assignManagerToDepartment(departmentId, managerId);
      setSuccess('Gestor atribuído com sucesso!');
      setAssignManagerDialog({ open: false });
      setTimeout(() => {
        loadData();
        setSuccess(null);
      }, 2000);
    } catch (error) {
      console.error('Erro ao atribuir gestor:', error);
      setError('Erro ao atribuir gestor');
    } finally {
      setLoading(false);
    }
  };

  // Atribuir funcionários a departamento
  const handleAssignEmployees = async (departmentName: string, employeeIds: string[]) => {
    try {
      setLoading(true);
      const promises = employeeIds.map(employeeId => 
        EmployeeService.assignDepartmentToEmployee(employeeId, departmentName)
      );
      await Promise.all(promises);
      
      setSuccess(`${employeeIds.length} funcionário(s) atribuído(s) com sucesso!`);
      setAssignEmployeesDialog({ open: false });
      setSelectedEmployees([]);
      setTimeout(() => {
        loadData();
        setSuccess(null);
      }, 2000);
    } catch (error) {
      console.error('Erro ao atribuir funcionários:', error);
      setError('Erro ao atribuir funcionários');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <PageHeader
          title="Gerenciar Atribuições"
          description="Atribua gestores e funcionários aos departamentos"
          icon={<Assignment />}
        />

        <Box sx={{ p: 4 }}>
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

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            <Box>
              <Card sx={{ 
                height: 'fit-content',
                border: '2px solid',
                borderColor: 'warning.light',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    mb: 3,
                    p: 2,
                    backgroundColor: 'warning.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'warning.200'
                  }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: 'warning.main',
                      color: 'white'
                    }}>
                      <Person sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="warning.dark">
                        Departamentos sem Gestor
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {departmentsWithoutManager.length} departamento(s) precisam de gestor
                      </Typography>
                    </Box>
                  </Box>
                  
                  {departmentsWithoutManager.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 3,
                      color: 'text.secondary'
                    }}>
                      <Person sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                      <Typography variant="body2">
                        Todos os departamentos têm gestores atribuídos.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {departmentsWithoutManager.map((dept, index) => (
                        <ListItem 
                          key={dept.id} 
                          sx={{ 
                            px: 0, 
                            py: 2,
                            borderBottom: index < departmentsWithoutManager.length - 1 ? '1px solid' : 'none',
                            borderColor: 'divider'
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: 'warning.main',
                              width: 44,
                              height: 44
                            }}>
                              <Business />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={500}>
                                {dept.name}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                {dept.description || 'Sem descrição'}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PersonAdd />}
                              onClick={() => setAssignManagerDialog({ 
                                open: true, 
                                department: dept 
                              })}
                              disabled={loading || managers.length === 0}
                              sx={{
                                backgroundColor: 'warning.main',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'warning.dark'
                                },
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Atribuir Gestor
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Box>

            <Box>
              <Card sx={{ 
                height: 'fit-content',
                border: '2px solid',
                borderColor: 'primary.light',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    mb: 3,
                    p: 2,
                    backgroundColor: 'primary.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'primary.200'
                  }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }}>
                      <Group sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="primary.dark">
                        Funcionários sem Departamento
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employeesWithoutDepartment.length} funcionário(s) sem departamento
                      </Typography>
                    </Box>
                  </Box>
                  
                  {employeesWithoutDepartment.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 3,
                      color: 'text.secondary'
                    }}>
                      <Group sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                      <Typography variant="body2">
                        Todos os funcionários estão atribuídos a departamentos.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <List sx={{ maxHeight: 300, overflowY: 'auto', p: 0 }}>
                        {employeesWithoutDepartment.map((emp, index) => (
                          <ListItem 
                            key={emp.id} 
                            sx={{ 
                              px: 0, 
                              py: 2,
                              borderBottom: index < employeesWithoutDepartment.length - 1 ? '1px solid' : 'none',
                              borderColor: 'divider'
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                width: 44,
                                height: 44,
                                fontSize: '1.1rem',
                                fontWeight: 600
                              }}>
                                {emp.personalInfo.firstName.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight={500}>
                                  {emp.personalInfo.firstName} {emp.personalInfo.lastName}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary" display="block">
                                    {emp.personalInfo.email}
                                  </Typography>
                                  <Chip 
                                    label={emp.jobInfo.hierarchyLevel} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ 
                                      mt: 0.5,
                                      borderColor: 'primary.main',
                                      color: 'primary.main',
                                      backgroundColor: 'primary.50'
                                    }}
                                  />
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      {allDepartments.length > 0 && (
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => setAssignEmployeesDialog({ 
                            open: true 
                          })}
                          disabled={loading}
                          sx={{ 
                            mt: 3, 
                            width: '100%',
                            py: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.dark'
                            },
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem'
                          }}
                        >
                          Atribuir a Departamento
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: 'divider', opacity: 0.7 }} />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            pt: 2
          }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                borderColor: 'grey.300',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.50',
                  color: 'primary.main'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Fechar
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog 
        open={assignManagerDialog.open} 
        onClose={() => setAssignManagerDialog({ open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              width: 32,
              height: 32
            }}>
              <PersonAdd sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              Atribuir Gestor ao Departamento
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'primary.50',
              borderColor: 'primary.200'
            }}
          >
            <Typography variant="body2">
              <strong>Departamento:</strong> {assignManagerDialog.department?.name}
            </Typography>
          </Alert>
          
          {managers.length === 0 ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Nenhum funcionário com nível "Gestor" encontrado. 
              Cadastre funcionários com nível hierárquico de gestor primeiro.
            </Alert>
          ) : (
            <FormControl fullWidth>
              <InputLabel>Selecionar Gestor</InputLabel>
              <Select
                label="Selecionar Gestor"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value && assignManagerDialog.department?.id) {
                    handleAssignManager(
                      assignManagerDialog.department.id,
                      e.target.value as string
                    );
                  }
                }}
                sx={{
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              >
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main',
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}>
                        {manager.personalInfo.firstName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {manager.personalInfo.firstName} {manager.personalInfo.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {manager.personalInfo.email}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setAssignManagerDialog({ open: false })}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={assignEmployeesDialog.open}
        onClose={() => setAssignEmployeesDialog({ open: false })}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              width: 32,
              height: 32
            }}>
              <Group sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              Atribuir Funcionários a Departamento
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Selecionar Departamento</InputLabel>
            <Select
              label="Selecionar Departamento"
              value=""
              onChange={(e) => {
                const selectedDept = allDepartments.find(d => d.name === e.target.value);
                setAssignEmployeesDialog({ 
                  open: true, 
                  department: selectedDept 
                });
              }}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                }
              }}
            >
              {allDepartments.map((dept) => (
                <MenuItem key={dept.id} value={dept.name}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
                    <Business sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="body1" fontWeight={500}>
                      {dept.name}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {assignEmployeesDialog.department && (
            <>
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: 'primary.50',
                  borderColor: 'primary.200'
                }}
              >
                <Typography variant="body2">
                  <strong>Departamento selecionado:</strong> {assignEmployeesDialog.department.name}
                </Typography>
              </Alert>
              
              <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                Selecione os funcionários:
              </Typography>
              
              <List sx={{ 
                maxHeight: 300, 
                overflowY: 'auto', 
                border: '2px solid', 
                borderColor: 'primary.200', 
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }}>
                {employeesWithoutDepartment.map((emp, index) => (
                  <ListItem 
                    key={emp.id} 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'primary.50'
                      },
                      borderBottom: index < employeesWithoutDepartment.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}
                    onClick={() => {
                    setSelectedEmployees(prev => 
                      prev.includes(emp.id!)
                        ? prev.filter(id => id !== emp.id)
                        : [...prev, emp.id!]
                    );
                  }}>
                    <ListItemAvatar>
                      <Checkbox
                        checked={selectedEmployees.includes(emp.id!)}
                        onChange={() => {}}
                        sx={{
                          color: 'primary.main',
                          '&.Mui-checked': {
                            color: 'primary.main'
                          }
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: selectedEmployees.includes(emp.id!) ? 'primary.main' : 'grey.300',
                        color: selectedEmployees.includes(emp.id!) ? 'white' : 'text.secondary',
                        transition: 'all 0.3s ease'
                      }}>
                        {emp.personalInfo.firstName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={500}>
                          {emp.personalInfo.firstName} {emp.personalInfo.lastName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {emp.personalInfo.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              {selectedEmployees.length > 0 && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: 'success.50',
                    borderColor: 'success.200'
                  }}
                >
                  <Typography variant="body2">
                    {selectedEmployees.length} funcionário(s) selecionado(s)
                  </Typography>
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
          <Button 
            onClick={() => {
              setAssignEmployeesDialog({ open: false });
              setSelectedEmployees([]);
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={!assignEmployeesDialog.department || selectedEmployees.length === 0}
            onClick={() => {
              if (assignEmployeesDialog.department) {
                handleAssignEmployees(
                  assignEmployeesDialog.department.name,
                  selectedEmployees
                );
              }
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Atribuir ({selectedEmployees.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
