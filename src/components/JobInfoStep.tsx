import React, { useEffect, useState } from 'react';
import {
  TextField,
  Typography,
  Box,
  InputAdornment,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Work, Business, AttachMoney, Schedule, Person, CalendarToday, TrendingUp } from '@mui/icons-material';
import type { Employee } from '../types/Employee';
import { formatCurrency } from '../utils/formatters';
import { EmployeeService } from '../services/employeeService';

interface JobInfoStepProps {
  control: Control<Employee>;
}

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

const workSchedules = [
  '08:00 - 17:00',
  '09:00 - 18:00',
  '10:00 - 19:00',
  'Home Office',
  'Híbrido',
  'Flexível'
];

const employmentTypes = [
  'CLT',
  'PJ',
  'Estagiário',
  'Freelancer'
];

const hierarchyLevels = [
  { value: 'junior', label: 'Júnior' },
  { value: 'pleno', label: 'Pleno' },
  { value: 'senior', label: 'Sênior' },
  { value: 'gestor', label: 'Gestor' }
];

export const JobInfoStep: React.FC<JobInfoStepProps> = ({ control }) => {
  const [salaryInput, setSalaryInput] = useState<string>('');
  const [baseSalaryInput, setBaseSalaryInput] = useState<string>('');
  const [managers, setManagers] = useState<Employee[]>([]);

  // Carregar gestores disponíveis
  useEffect(() => {
    const loadManagers = async () => {
      try {
        const managersData = await EmployeeService.getManagersForSelection();
        setManagers(managersData);
      } catch (error) {
        console.error('Erro ao carregar gestores:', error);
      }
    };
    loadManagers();
  }, []);
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
                  label="Posição"
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
            name="jobInfo.jobTitle"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  label="Cargo"
                  placeholder="Ex: Analista de Sistemas"
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
                />
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
            name="jobInfo.admissionDate"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  label="Data de Admissão"
                  type="date"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              );
            }}
          />

          <Controller
            name="jobInfo.managerId"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Gestor Responsável"
                  error={showError}
                  helperText={showError ? error?.message : 'Opcional - apenas para não gestores'}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">
                    <em>Nenhum</em>
                  </MenuItem>
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.personalInfo.firstName} {manager.personalInfo.lastName} - {manager.personalInfo.email}
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

          <Controller
            name="jobInfo.hierarchyLevel"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              return (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Nível Hierárquico"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TrendingUp color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {hierarchyLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
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
                  label="Salário Total"
                  placeholder="5.000,00"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
                  inputMode="numeric"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    const cents = parseInt(digits || '0', 10);
                    const numeric = cents / 100;
                    setSalaryInput(numeric ? formatCurrency(numeric).replace(/^R\$\s?/, '') : '');
                    field.onChange(numeric);
                  }}
                  onBlur={() => {
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
            name="jobInfo.baseSalary"
            control={control}
            render={({ field, fieldState: { error, isTouched }, formState }) => {
              const showError = !!error && (isTouched || formState.isSubmitted);
              
              useEffect(() => {
                if (typeof field.value === 'number') {
                  if (!field.value) {
                    setBaseSalaryInput('');
                  } else {
                    setBaseSalaryInput(formatCurrency(field.value).replace(/^R\$\s?/, ''));
                  }
                }
              }, [field.value]);
              
              return (
                <TextField
                  value={baseSalaryInput}
                  fullWidth
                  label="Salário Base"
                  placeholder="4.000,00"
                  required
                  error={showError}
                  helperText={showError ? error?.message : ''}
                  size="medium"
                  inputMode="numeric"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    const cents = parseInt(digits || '0', 10);
                    const numeric = cents / 100;
                    setBaseSalaryInput(numeric ? formatCurrency(numeric).replace(/^R\$\s?/, '') : '');
                    field.onChange(numeric);
                  }}
                  onBlur={() => {
                    const value = typeof field.value === 'number' ? field.value : 0;
                    setBaseSalaryInput(value ? formatCurrency(value).replace(/^R\$\s?/, '') : '');
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
