import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import flugoTheme from './theme/flugoTheme';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginForm } from './components/LoginForm';
import { NotFound } from './components/NotFound';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <ThemeProvider theme={flugoTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota pública de login */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
