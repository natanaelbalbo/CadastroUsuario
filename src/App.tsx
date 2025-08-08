import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import flugoTheme from './theme/flugoTheme';
import { EmployeeRegistrationForm } from './components/EmployeeRegistrationForm';
import { EmployeeList } from './components/EmployeeList';

type AppView = 'list' | 'form';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('list');

  const handleNewEmployee = () => {
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
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
          <EmployeeList onNewEmployee={handleNewEmployee} />
        ) : (
          <Box sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
            <EmployeeRegistrationForm onSuccess={handleBackToList} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
