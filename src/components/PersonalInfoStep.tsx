import React from 'react';
import {
  TextField,
  Typography,
  Box,
  InputAdornment,
  Stack,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Person, Email, Phone, Badge } from '@mui/icons-material';
import type { Employee } from '../types/Employee';
import { formatCPF, formatPhone } from '../utils/formatters';

interface PersonalInfoStepProps {
  control: Control<Employee>;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ control }) => {
  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: 'text.primary',
          fontWeight: 600,
          mb: 3
        }}
      >
        Informações Pessoais
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 4 }}
      >
        Preencha os dados pessoais do funcionário
      </Typography>

      <Stack spacing={3}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '250px' } }}>
            <Controller
              name="personalInfo.firstName"
              control={control}
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nome"
                  placeholder="Digite o nome"
                  error={!!error}
                  helperText={error?.message}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '250px' } }}>
            <Controller
              name="personalInfo.lastName"
              control={control}
              rules={{ required: 'Sobrenome é obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sobrenome"
                  placeholder="Digite o sobrenome"
                  error={!!error}
                  helperText={error?.message}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '250px' } }}>
            <Controller
              name="personalInfo.email"
              control={control}
              rules={{ 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email deve ter um formato válido'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="exemplo@email.com"
                  error={!!error}
                  helperText={error?.message}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
            <Controller
              name="personalInfo.phone"
              control={control}
              rules={{ required: 'Telefone é obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  error={!!error}
                  helperText={error?.message}
                  required
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    field.onChange(formatted);
                  }}
                  inputProps={{
                    maxLength: 15
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
            <Controller
              name="personalInfo.birthDate"
              control={control}
              rules={{ required: 'Data de nascimento é obrigatória' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Data de Nascimento"
                  type="date"
                  error={!!error}
                  helperText={error?.message}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0]
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
            <Controller
              name="personalInfo.cpf"
              control={control}
              rules={{ required: 'CPF é obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="CPF"
                  placeholder="999.999.999-99"
                  error={!!error}
                  helperText={error?.message}
                  required
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    field.onChange(formatted);
                  }}
                  inputProps={{
                    maxLength: 14
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
