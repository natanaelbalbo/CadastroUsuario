import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { LogoutOutlined, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { EmployeeList } from './EmployeeList';
import { EmployeeRegistrationForm } from './EmployeeRegistrationForm';
import { DepartmentList } from './DepartmentList';
import { DepartmentForm } from './DepartmentForm';
import type { Employee } from '../types/Employee';
import type { Department } from '../types/Department';
import flugoLogo from '../assets/icon275.jpg';

type DashboardView = 'employees' | 'employee-form' | 'departments' | 'department-form';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente para os painéis das abas
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handlers para o menu do usuário
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Handlers para navegação entre views
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setCurrentView('employees');
    } else if (newValue === 1) {
      setCurrentView('departments');
    }
    setSelectedEmployee(null);
    setSelectedDepartment(null);
  };

  const handleNewEmployee = () => {
    setCurrentView('employee-form');
    setSelectedEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentView('employee-form');
  };

  const handleBackToEmployees = () => {
    setCurrentView('employees');
    setSelectedEmployee(null);
  };

  const handleNewDepartment = () => {
    setCurrentView('department-form');
    setSelectedDepartment(null);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setCurrentView('department-form');
  };

  const handleBackToDepartments = () => {
    setCurrentView('departments');
    setSelectedDepartment(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Barra superior */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {/* Logo */}
          <Avatar
            src={flugoLogo}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestão de Colaboradores
          </Typography>

          {/* Menu do usuário */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {currentUser?.email}
            </Typography>
            
            <IconButton
              size="large"
              edge="end"
              aria-label="menu do usuário"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutOutlined sx={{ mr: 1 }} />
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navegação por abas - apenas quando não estiver em formulários */}
      {!currentView.includes('form') && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="navegação dashboard">
            <Tab label="Colaboradores" id="dashboard-tab-0" />
            <Tab label="Departamentos" id="dashboard-tab-1" />
          </Tabs>
        </Box>
      )}

      {/* Conteúdo principal */}
      <Box sx={{ flex: 1 }}>
        {/* Painel de Colaboradores */}
        <TabPanel value={tabValue} index={0}>
          {currentView === 'employees' && (
            <EmployeeList 
              onNewEmployee={handleNewEmployee} 
              onEdit={handleEditEmployee} 
            />
          )}
        </TabPanel>

        {/* Painel de Departamentos */}
        <TabPanel value={tabValue} index={1}>
          {currentView === 'departments' && (
            <DepartmentList 
              onNewDepartment={handleNewDepartment}
              onEdit={handleEditDepartment}
            />
          )}
        </TabPanel>

        {/* Formulário de Colaborador */}
        {currentView === 'employee-form' && (
          <Box sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
            <EmployeeRegistrationForm 
              employee={selectedEmployee} 
              onCancel={handleBackToEmployees} 
            />
          </Box>
        )}

        {/* Formulário de Departamento */}
        {currentView === 'department-form' && (
          <Box sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
            <DepartmentForm 
              department={selectedDepartment}
              onCancel={handleBackToDepartments}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};