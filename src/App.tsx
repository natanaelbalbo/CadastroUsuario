import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import flugoTheme from './theme/flugoTheme';
import { EmployeeRegistrationForm } from './components/EmployeeRegistrationForm';
import { EmployeeList } from './components/EmployeeList';
import type { Employee } from './types/Employee';

type AppView = 'list' | 'form';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleNewEmployee = () => {
    setCurrentView('form');
    setSelectedEmployee(null);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentView('form');
  };

  return (
    <ThemeProvider theme={flugoTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          width: '100%',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {currentView === 'list' ? (
          <EmployeeList onNewEmployee={handleNewEmployee} onEdit={handleEditEmployee} />
        ) : (
          <Box sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
            <EmployeeRegistrationForm employee={selectedEmployee} onCancel={handleBackToList} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
