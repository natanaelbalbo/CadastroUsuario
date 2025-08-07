import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import type { Employee } from '../types/Employee';
import { EmployeeService } from '../services/employeeService';
import { formatCurrency, formatDate } from '../utils/formatters';

export const EmployeeList: React.FC = () => {
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
      setError('Erro ao carregar funcionários');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este funcionário?')) {
      try {
        await EmployeeService.deleteEmployee(id);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err) {
        setError('Erro ao remover funcionário');
      }
    }
  };

  const getStatusChip = (status: 'active' | 'inactive' | undefined) => {
    const isActive = status === 'active';
    return (
      <Chip
        label={isActive ? 'Ativo' : 'Inativo'}
        color={isActive ? 'success' : 'default'}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Funcionários Cadastrados
      </Typography>

      {employees.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
          Nenhum funcionário cadastrado ainda.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Salário</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data Cadastro</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.personalInfo.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.jobInfo.position}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.jobInfo.department}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatCurrency(employee.jobInfo.salary)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(employee.status)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.createdAt ? formatDate(employee.createdAt) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizar">
                      <IconButton size="small" color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="secondary">
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => employee.id && handleDelete(employee.id)}
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
      )}
    </Paper>
  );
};
