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
        {/* Cabeçalho */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Assignment sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Gerenciar Atribuições
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Atribua gestores e funcionários aos departamentos
              </Typography>
            </Box>
          </Box>
        </Box>

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
            {/* Departamentos sem Gestor */}
            <Box>
              <Card sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="warning" />
                    Departamentos sem Gestor ({departmentsWithoutManager.length})
                  </Typography>
                  
                  {departmentsWithoutManager.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Todos os departamentos têm gestores atribuídos.
                    </Typography>
                  ) : (
                    <List>
                      {departmentsWithoutManager.map((dept) => (
                        <ListItem key={dept.id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'warning.main' }}>
                              <Business />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={dept.name}
                            secondary={dept.description || 'Sem descrição'}
                          />
                          <ListItemSecondaryAction>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PersonAdd />}
                              onClick={() => setAssignManagerDialog({ 
                                open: true, 
                                department: dept 
                              })}
                              disabled={loading || managers.length === 0}
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

            {/* Funcionários sem Departamento */}
            <Box>
              <Card sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group color="info" />
                    Funcionários sem Departamento ({employeesWithoutDepartment.length})
                  </Typography>
                  
                  {employeesWithoutDepartment.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Todos os funcionários estão atribuídos a departamentos.
                    </Typography>
                  ) : (
                    <>
                      <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        {employeesWithoutDepartment.map((emp) => (
                          <ListItem key={emp.id} sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar>
                                {emp.personalInfo.firstName.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`}
                              secondary={
                                <Box>
                                  <Typography variant="caption" display="block">
                                    {emp.personalInfo.email}
                                  </Typography>
                                  <Chip 
                                    label={emp.jobInfo.hierarchyLevel} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ mt: 0.5 }}
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
                          sx={{ mt: 2, width: '100%' }}
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

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
            >
              Fechar
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Dialog para Atribuir Gestor */}
      <Dialog 
        open={assignManagerDialog.open} 
        onClose={() => setAssignManagerDialog({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Atribuir Gestor ao Departamento
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Departamento: <strong>{assignManagerDialog.department?.name}</strong>
          </Typography>
          
          {managers.length === 0 ? (
            <Alert severity="info">
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
              >
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    <Box>
                      <Typography variant="body1">
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignManagerDialog({ open: false })}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Atribuir Funcionários a Departamento */}
      <Dialog
        open={assignEmployeesDialog.open}
        onClose={() => setAssignEmployeesDialog({ open: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Atribuir Funcionários a Departamento
        </DialogTitle>
        <DialogContent>
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
            >
              {allDepartments.map((dept) => (
                <MenuItem key={dept.id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {assignEmployeesDialog.department && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecione os funcionários para o departamento: <strong>{assignEmployeesDialog.department.name}</strong>
              </Typography>
              
              <List sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                {employeesWithoutDepartment.map((emp) => (
                  <ListItem 
                    key={emp.id} 
                    sx={{ cursor: 'pointer' }}
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
                      />
                    </ListItemAvatar>
                    <ListItemAvatar>
                      <Avatar>
                        {emp.personalInfo.firstName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`}
                      secondary={emp.personalInfo.email}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAssignEmployeesDialog({ open: false });
            setSelectedEmployees([]);
          }}>
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
          >
            Atribuir ({selectedEmployees.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
