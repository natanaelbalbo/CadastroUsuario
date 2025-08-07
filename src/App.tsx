import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import flugoTheme from './theme/flugoTheme';
import { EmployeeRegistrationForm } from './components/EmployeeRegistrationForm';

function App() {
  return (
    <ThemeProvider theme={flugoTheme}>
      <CssBaseline />
      <EmployeeRegistrationForm />
    </ThemeProvider>
  );
}

export default App;
