import React, { useEffect, useState } from 'react';
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
import { formatCurrency } from '../utils/formatters';

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
  const [salaryInput, setSalaryInput] = useState<string>('');
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
        Informações Profissionais
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: '0.875rem', sm: '0.875rem' }
        }}
      >
        Informe os dados profissionais e contratuais do funcionário
      </Typography>

      <Stack spacing={{ xs: 2, sm: 3 }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2, sm: 2 }
        }}>
          <Controller
            name="jobInfo.position"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  label="Cargo"
                  placeholder="Ex: Desenvolvedor Frontend"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              );
            }}
          />

          <Controller
            name="jobInfo.department"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Departamento"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
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
              );
            }}
          />
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2, sm: 2 }
        }}>
          <Controller
            name="jobInfo.salary"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              // Keep local masked text in sync if form value changes externally
              useEffect(() => {
                if (typeof field.value === 'number') {
                  if (!field.value) {
                    setSalaryInput('');
                  } else {
                    setSalaryInput(formatCurrency(field.value).replace(/^R\$\s?/, ''));
                  }
                }
              }, [field.value]);
              return (
                <TextField
                  value={salaryInput}
                  fullWidth
                  label="Salário"
                  placeholder="5.000,00"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
                  inputMode="numeric"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    // Treat input as cents; 1 -> 0,01; 12 -> 0,12; 1234 -> 12,34
                    const cents = parseInt(digits || '0', 10);
                    const numeric = cents / 100;
                    setSalaryInput(numeric ? formatCurrency(numeric).replace(/^R\$\s?/, '') : '');
                    field.onChange(numeric);
                  }}
                  onBlur={() => {
                    // Ensure two decimals formatting on blur
                    const value = typeof field.value === 'number' ? field.value : 0;
                    setSalaryInput(value ? formatCurrency(value).replace(/^R\$\s?/, '') : '');
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    inputComponent: undefined
                  }}
                />
              );
            }}
          />

          <Controller
            name="jobInfo.employmentType"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Tipo de Contratação"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
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
              );
            }}
          />
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2, sm: 2 }
        }}>
          <Controller
            name="jobInfo.startDate"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  label="Data de Início"
                  type="date"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                />
              );
            }}
          />

          <Controller
            name="jobInfo.workSchedule"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Horário de Trabalho"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
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
              );
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};
