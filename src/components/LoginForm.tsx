import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import flugoLogo from '../assets/icon275.jpg';


export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Função para lidar com o submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (isRegistering && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      
      navigate('/');
    } catch (error: any) {
      console.error(isRegistering ? 'Erro no registro:' : 'Erro no login:', error);
      

      
      // Tratamento de erros específicos do Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Usuário não encontrado');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta');
          break;
        case 'auth/email-already-in-use':
          setError('Este email já está em uso');
          break;
        case 'auth/weak-password':
          setError('A senha é muito fraca');
          break;
        case 'auth/invalid-email':
          setError('Email inválido');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente mais tarde');
          break;
        case 'auth/configuration-not-found':
          setError('Erro de configuração do Firebase. Verifique as configurações do projeto.');
          break;
        case 'auth/invalid-api-key':
          setError('Chave de API do Firebase inválida. Verifique as configurações.');
          break;
        default:
          setError(isRegistering ? 'Erro ao criar conta. Tente novamente' : 'Erro ao fazer login. Tente novamente');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        px: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Logo da empresa */}
        <Avatar
          src={flugoLogo}
          sx={{ width: 80, height: 80, mb: 2 }}
        />
        
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlined />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {isRegistering ? 'Criar Conta' : 'Entrar no Sistema'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          {isRegistering && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isRegistering ? 'Criar Conta' : 'Entrar'
            )}
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setConfirmPassword('');
            }}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            {isRegistering 
              ? 'Já tem uma conta? Fazer login' 
              : 'Não tem uma conta? Criar conta'
            }
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};