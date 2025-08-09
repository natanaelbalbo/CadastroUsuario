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
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { Add, Person, Edit, Delete } from '@mui/icons-material';
import type { Employee } from '../types/Employee';
import { EmployeeService } from '../services/employeeService';
import flugoLogo from '../assets/icon275.jpg';

interface EmployeeListProps {
  onNewEmployee: () => void;
  onEdit?: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ onNewEmployee, onEdit }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Erro ao carregar colaboradores');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!employee.id) return;
    const confirmed = window.confirm(`Excluir o colaborador ${employee.personalInfo.firstName} ${employee.personalInfo.lastName}?`);
    if (!confirmed) return;
    try {
      await EmployeeService.deleteEmployee(employee.id);
      setEmployees(prev => prev.filter(e => e.id !== employee.id));
    } catch (err) {
      setError('Erro ao excluir colaborador');
      console.error('Erro ao excluir:', err);
    }
  };

  const getStatusChip = () => {
    const isActive = true;
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#22c55e' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src={flugoLogo}
              alt="Flugo Logo"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                objectFit: 'contain'
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#111827', 
                fontWeight: 600,
                fontSize: '1.25rem'
              }}
            >
              Flugo
            </Typography>
          </Box>
          
          <IconButton>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                backgroundColor: '#22c55e',
                fontSize: '0.875rem'
              }}
            >
              👤
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex' }}>
        <Box 
          sx={{ 
            width: 250,
            backgroundColor: 'white',
            minHeight: 'calc(100vh - 65px)',
            borderRight: '1px solid #e5e7eb',
            p: 2
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              p: 1,
              backgroundColor: '#f3f4f6',
              borderRadius: 1,
              color: '#6b7280'
            }}
          >
            <Person fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              Colaboradores
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#111827',
                fontWeight: 600,
                fontSize: '2rem'
              }}
            >
              Colaboradores
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onNewEmployee}
              sx={{
                backgroundColor: '#22c55e',
                '&:hover': {
                  backgroundColor: '#16a34a'
                },
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1
              }}
            >
              Novo Colaborador
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper 
            elevation={0}
            sx={{ 
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {employees.length === 0 ? (
              <Box sx={{ p: 8, textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ mb: 1 }}
                >
                  Nenhum colaborador cadastrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clique em "Novo Colaborador" para começar
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          color: '#6b7280',
                          borderBottom: '1px solid #e5e7eb',
                          py: 2
                        }}
                      >
                        Nome ↓
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          color: '#6b7280',
                          borderBottom: '1px solid #e5e7eb',
                          py: 2
                        }}
                      >
                        Email ↓
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          color: '#6b7280',
                          borderBottom: '1px solid #e5e7eb',
                          py: 2
                        }}
                      >
                        Departamento ↓
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          color: '#6b7280',
                          borderBottom: '1px solid #e5e7eb',
                          py: 2
                        }}
                      >
                        Status ↓
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          fontWeight: 600,
                          color: '#6b7280',
                          borderBottom: '1px solid #e5e7eb',
                          py: 2
                        }}
                      >
                        Ações
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employee, index) => (
                      <TableRow 
                        key={employee.id || index}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f9fafb' 
                          },
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        <TableCell sx={{ py: 3 }}>
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
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 500,
                                color: '#111827'
                              }}
                            >
                              {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ color: '#6b7280' }}
                          >
                            {employee.personalInfo.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ color: '#6b7280' }}
                          >
                            {employee.jobInfo.department || 'Não informado'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          {getStatusChip()}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 3 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => onEdit && onEdit(employee)}
                            title="Editar"
                            sx={{ mr: 1 }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(employee)}
                            title="Excluir"
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
