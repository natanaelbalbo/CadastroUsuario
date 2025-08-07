import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import type { Employee } from '../types/Employee';
import { useMultiStepForm } from '../hooks/useMultiStepForm';
import { PersonalInfoStep } from './PersonalInfoStep';
import { AddressInfoStep } from './AddressInfoStep';
import { JobInfoStep } from './JobInfoStep';
import { EmployeeService } from '../services/employeeService';
import { 
  personalInfoSchema, 
  addressInfoSchema, 
  jobInfoSchema, 
  employeeSchema 
} from '../utils/validationSchemas';

const steps = [
  {
    label: 'Informações Pessoais',
    component: PersonalInfoStep,
    schema: personalInfoSchema,
    fields: [
      'personalInfo.firstName',
      'personalInfo.lastName', 
      'personalInfo.email',
      'personalInfo.phone',
      'personalInfo.birthDate',
      'personalInfo.cpf'
    ]
  },
  {
    label: 'Endereço',
    component: AddressInfoStep,
    schema: addressInfoSchema,
    fields: [
      'addressInfo.street',
      'addressInfo.number',
      'addressInfo.neighborhood',
      'addressInfo.city',
      'addressInfo.state',
      'addressInfo.zipCode'
    ]
  },
  {
    label: 'Informações Profissionais',
    component: JobInfoStep,
    schema: jobInfoSchema,
    fields: [
      'jobInfo.position',
      'jobInfo.department',
      'jobInfo.salary',
      'jobInfo.startDate',
      'jobInfo.workSchedule',
      'jobInfo.employmentType'
    ]
  }
];

export const EmployeeRegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const { control, handleSubmit, trigger } = useForm<Employee>({
    resolver: yupResolver(employeeSchema),
    mode: 'onBlur',
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        cpf: ''
      },
      addressInfo: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      jobInfo: {
        position: '',
        department: '',
        salary: 0,
        startDate: '',
        workSchedule: '',
        employmentType: ''
      }
    }
  });

  const { 
    currentStep, 
    nextStep, 
    previousStep, 
    isFirstStep, 
    isLastStep, 
    progress 
  } = useMultiStepForm({ totalSteps: steps.length });

  const handleNext = async () => {
    const currentStepConfig = steps[currentStep];
    const isValid = await trigger(currentStepConfig.fields as any);
    
    if (isValid) {
      nextStep();
      setError(null);
    } else {
      setError('Por favor, corrija os erros antes de continuar');
    }
  };

  const handlePrevious = () => {
    previousStep();
    setError(null);
  };

  const onSubmit = async (data: Employee) => {
    setLoading(true);
    setError(null);
    
    try {
      const id = await EmployeeService.saveEmployee(data);
      setEmployeeId(id);
      setSuccess(true);
    } catch (err) {
      setError('Erro ao salvar funcionário. Tente novamente.');
      console.error('Erro ao salvar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEmployee = () => {
    setSuccess(false);
    setEmployeeId(null);
    setError(null);
    // Reset form would go here if needed
    window.location.reload();
  };

  const renderStepContent = () => {
    const StepComponent = steps[currentStep].component;
    return <StepComponent control={control} />;
  };

  if (success) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CheckCircle 
            color="success" 
            sx={{ fontSize: 64, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom color="success.main">
            Funcionário Cadastrado com Sucesso!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            O funcionário foi salvo no sistema com o ID: <strong>{employeeId}</strong>
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleNewEmployee}
            sx={{ mt: 2 }}
          >
            Cadastrar Novo Funcionário
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 4, pb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Cadastro de Funcionário
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Preencha todas as informações para cadastrar um novo funcionário
          </Typography>
        </Box>

        {/* Progress */}
        <Box sx={{ px: 4, mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Etapa {currentStep + 1} de {steps.length} ({Math.round(progress)}%)
          </Typography>
        </Box>
        
        {/* Stepper */}
        <Stepper activeStep={currentStep} sx={{ px: 4, mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="body2">
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Alert */}
        {error && (
          <Box sx={{ px: 4, mb: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Form Content */}
        <Box sx={{ p: 4, pt: 0 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 4,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Button
                disabled={isFirstStep}
                onClick={handlePrevious}
                variant="outlined"
                startIcon={<ArrowBack />}
                size="large"
              >
                Voltar
              </Button>
              
              {isLastStep ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                  size="large"
                >
                  {loading ? 'Salvando...' : 'Finalizar Cadastro'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  size="large"
                >
                  Próximo
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};
