import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import flugoTheme from './theme/flugoTheme';
import { EmployeeRegistrationForm } from './components/EmployeeRegistrationForm';

function App() {
  return (
    <ThemeProvider theme={flugoTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          width: '100%',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <EmployeeRegistrationForm />
      </Box>
    </ThemeProvider>
  );
}

export default App;
