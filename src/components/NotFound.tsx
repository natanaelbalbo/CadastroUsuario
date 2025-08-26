import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import flugoLogo from '../assets/icon275.jpg';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  // Função para voltar à página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  // Função para ir à página inicial
  const handleGoHome = () => {
    navigate('/');
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
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          width: '100%'
        }}
      >
        {/* Logo da empresa */}
        <Box
          component="img"
          src={flugoLogo}
          alt="Flugo Logo"
          sx={{
            width: 100,
            height: 100,
            mx: 'auto',
            mb: 3,
            borderRadius: 2
          }}
        />
        
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          Página não encontrada
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: 'text.secondary',
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          Desculpe, a página que você está procurando não existe ou foi movida.
          Verifique o endereço ou navegue para uma das opções abaixo.
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{ minWidth: 150 }}
          >
            Voltar
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{ minWidth: 150 }}
          >
            Página Inicial
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};