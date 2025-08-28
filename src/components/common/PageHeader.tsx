import React from 'react';
import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon }) => {
  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: 'white',
        p: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '30%',
          height: '200%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'rotate(15deg)',
          pointerEvents: 'none'
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& > svg': {
                fontSize: 32,
                color: 'white'
              }
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700} sx={{ 
              mb: 0.5,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ 
              opacity: 0.95,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
