import React from 'react';
import {
  TextField,
  Typography,
  Box,
  InputAdornment,
  MenuItem,
  Stack,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Home, LocationOn, Business } from '@mui/icons-material';
import type { Employee } from '../types/Employee';
import { formatZipCode } from '../utils/formatters';

interface AddressInfoStepProps {
  control: Control<Employee>;
}

// Estados brasileiros
const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const AddressInfoStep: React.FC<AddressInfoStepProps> = ({ control }) => {
  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: 'text.primary',
          fontWeight: 600,
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}
      >
        Informações de Endereço
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: '0.875rem', sm: '0.875rem' }
        }}
      >
        Informe o endereço residencial do funcionário
      </Typography>

      <Stack spacing={{ xs: 2, sm: 3 }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
          gap: { xs: 2, sm: 2 }
        }}>
          <Controller
            name="addressInfo.street"
            control={control}
            rules={{ required: 'Rua é obrigatória' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Rua/Logradouro"
                placeholder="Digite o nome da rua"
                error={!!error}
                helperText={error?.message}
                required
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="addressInfo.number"
            control={control}
            rules={{ required: 'Número é obrigatório' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Número"
                placeholder="123"
                error={!!error}
                helperText={error?.message}
                required
                size="medium"
                sx={{ minWidth: { xs: '100%', sm: '120px' } }}
              />
            )}
          />
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2, sm: 2 }
        }}>
          <Controller
            name="addressInfo.complement"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Complemento"
                placeholder="Apto 101, Bloco A (opcional)"
                error={!!error}
                helperText={error?.message}
                size="medium"
              />
            )}
          />

          <Controller
            name="addressInfo.neighborhood"
            control={control}
            rules={{ required: 'Bairro é obrigatório' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Bairro"
                placeholder="Digite o bairro"
                error={!!error}
                helperText={error?.message}
                required
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr auto auto' },
          gap: { xs: 2, sm: 2 }
        }}>
          <Controller
            name="addressInfo.city"
            control={control}
            rules={{ required: 'Cidade é obrigatória' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Cidade"
                placeholder="Digite a cidade"
                error={!!error}
                helperText={error?.message}
                required
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="addressInfo.state"
            control={control}
            rules={{ required: 'Estado é obrigatório' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Estado"
                error={!!error}
                helperText={error?.message}
                required
                size="medium"
                sx={{ minWidth: { xs: '100%', sm: '120px' } }}
              >
                <MenuItem value="">
                  <em>Selecione</em>
                </MenuItem>
                {brazilianStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="addressInfo.zipCode"
            control={control}
            rules={{ required: 'CEP é obrigatório' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="CEP"
                placeholder="99999-999"
                error={!!error}
                helperText={error?.message}
                required
                size="medium"
                sx={{ minWidth: { xs: '100%', sm: '150px' } }}
                onChange={(e) => {
                  const formatted = formatZipCode(e.target.value);
                  field.onChange(formatted);
                }}
                inputProps={{
                  maxLength: 9
                }}
              />
            )}
          />
        </Box>
      </Stack>
    </Box>
  );
};
