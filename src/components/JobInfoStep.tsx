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
import { Work, Business, AttachMoney, Schedule } from '@mui/icons-material';
import type { Employee } from '../types/Employee';

interface JobInfoStepProps {
  control: Control<Employee>;
}

// Opções de departamentos
const departments = [
  'Tecnologia',
  'Design',
  'Marketing',
  'Vendas',
  'Financeiro',
  'Recursos Humanos',
  'Produto',
  'Operações',
  'Atendimento ao Cliente',
  'Administrativo'
];

// Opções de horário de trabalho
const workSchedules = [
  '08:00 - 17:00',
  '09:00 - 18:00',
  '10:00 - 19:00',
  'Home Office',
  'Híbrido',
  'Flexível'
];

// Tipos de contratação
const employmentTypes = [
  'CLT',
  'PJ',
  'Estagiário',
  'Freelancer'
];

export const JobInfoStep: React.FC<JobInfoStepProps> = ({ control }) => {
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
        Informações Profissionais
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 4 }}
      >
        Informe os dados profissionais e contratuais do funcionário
      </Typography>

      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 250px' }}>
            <Controller
              name="jobInfo.position"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Cargo"
                  placeholder="Ex: Desenvolvedor Frontend"
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 200px' }}>
            <Controller
              name="jobInfo.department"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Departamento"
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 200px' }}>
            <Controller
              name="jobInfo.salary"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Salário"
                  type="number"
                  placeholder="5000"
                  error={!!error}
                  helperText={error?.message}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 200px' }}>
            <Controller
              name="jobInfo.employmentType"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Tipo de Contratação"
                  error={!!error}
                  helperText={error?.message}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {employmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 200px' }}>
            <Controller
              name="jobInfo.startDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Data de Início"
                  type="date"
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 200px' }}>
            <Controller
              name="jobInfo.workSchedule"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Horário de Trabalho"
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {workSchedules.map((schedule) => (
                    <MenuItem key={schedule} value={schedule}>
                      {schedule}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
