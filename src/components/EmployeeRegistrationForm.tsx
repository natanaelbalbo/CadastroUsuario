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
import { testFirebaseConnection } from '../utils/testFirebase';
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

  const handleTestFirebase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await testFirebaseConnection();
      if (result.success) {
        setError(null);
        alert('✅ Firebase conectado com sucesso! Verifique o console para detalhes.');
      } else {
        setError('❌ Erro na conexão Firebase. Verifique o console.');
      }
    } catch (err) {
      setError('❌ Erro ao testar Firebase: ' + (err as Error).message);
      console.error('Erro no teste Firebase:', err);
    } finally {
      setLoading(false);
    }
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
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          px: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 6 }, 
            textAlign: 'center',
            width: '100%',
            maxWidth: 600,
            borderRadius: { xs: 2, sm: 3 }
          }}
        >
          <CheckCircle 
            color="success" 
            sx={{ fontSize: { xs: 48, sm: 64 }, mb: 2 }}
          />
          <Typography 
            variant="h4" 
            gutterBottom 
            color="success.main"
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              fontWeight: 600
            }}
          >
            Funcionário Cadastrado com Sucesso!
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            O funcionário foi salvo no sistema com o ID: <strong>{employeeId}</strong>
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleNewEmployee}
            sx={{ 
              mt: 2,
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 }
            }}
          >
            Cadastrar Novo Funcionário
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: { xs: 2, sm: 3 },
          mx: 'auto',
          width: '100%',
          maxWidth: { xs: '100%', sm: 800, md: 900, lg: 1000 }
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          pb: { xs: 1, sm: 2 },
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              fontWeight: 600,
              mb: 1
            }}
          >
            Cadastro de Funcionário
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Preencha todas as informações para cadastrar um novo funcionário
          </Typography>
          
          {/* Botão de Teste Firebase (Temporário) */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleTestFirebase}
              disabled={loading}
              sx={{ 
                fontSize: '0.75rem',
                px: 2,
                py: 0.5
              }}
            >
              🔥 Testar Conexão Firebase
            </Button>
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: { xs: 6, sm: 8 }, 
              borderRadius: 4,
              backgroundColor: 'grey.200'
            }}
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ 
              mt: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 500
            }}
          >
            Etapa {currentStep + 1} de {steps.length} ({Math.round(progress)}%)
          </Typography>
        </Box>
        
        {/* Stepper */}
        <Stepper 
          activeStep={currentStep} 
          sx={{ 
            px: { xs: 1, sm: 2, md: 4 }, 
            mb: { xs: 2, sm: 3 },
            '& .MuiStepLabel-root': {
              flexDirection: { xs: 'column', sm: 'row' },
              '& .MuiStepLabel-labelContainer': {
                display: { xs: 'none', sm: 'block' }
              }
            }
          }}
        >
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography 
                  variant="body2"
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    textAlign: 'center'
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Current Step Label for Mobile */}
        <Box sx={{ 
          display: { xs: 'block', sm: 'none' }, 
          px: 2, 
          mb: 2,
          textAlign: 'center'
        }}>
          <Typography 
            variant="body1" 
            fontWeight={600}
            color="primary.main"
          >
            {steps[currentStep].label}
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mb: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Form Content */}
        <Box sx={{ 
          flex: 1,
          p: { xs: 2, sm: 3, md: 4 }, 
          pt: 0,
          overflowY: 'auto'
        }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: { xs: 3, sm: 4 },
              pt: { xs: 2, sm: 3 },
              borderTop: '1px solid',
              borderColor: 'divider',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Button
                disabled={isFirstStep}
                onClick={handlePrevious}
                variant="outlined"
                startIcon={<ArrowBack />}
                size="large"
                sx={{ 
                  order: { xs: 2, sm: 1 },
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { sm: 120 }
                }}
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
                  sx={{ 
                    order: { xs: 1, sm: 2 },
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: 180 }
                  }}
                >
                  {loading ? 'Salvando...' : 'Finalizar Cadastro'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  size="large"
                  sx={{ 
                    order: { xs: 1, sm: 2 },
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: 140 }
                  }}
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
