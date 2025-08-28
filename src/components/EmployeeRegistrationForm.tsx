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
import type { SubmitHandler } from 'react-hook-form';
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
      'jobInfo.employmentType',
      'jobInfo.jobTitle',
      'jobInfo.admissionDate',
      'jobInfo.hierarchyLevel',
      'jobInfo.managerId',
      'jobInfo.baseSalary'
    ]
  }
];

interface EmployeeRegistrationFormProps {
  employee?: Employee | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EmployeeRegistrationForm: React.FC<EmployeeRegistrationFormProps> = ({ employee, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const { control, handleSubmit, trigger, reset } = useForm<Employee>({
    resolver: yupResolver(employeeSchema) as any,
    mode: 'onBlur',
    defaultValues: {
      personalInfo: employee?.personalInfo ?? {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        cpf: ''
      },
      addressInfo: employee?.addressInfo ?? {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      jobInfo: employee?.jobInfo ?? {
        position: '',
        department: '',
        salary: 0,
        startDate: '',
        workSchedule: '',
        employmentType: '',
        jobTitle: '',
        admissionDate: '',
        hierarchyLevel: 'junior',
        managerId: '',
        baseSalary: 0
      }
    }
  });

  React.useEffect(() => {
    if (employee) {
      reset({
        personalInfo: employee.personalInfo,
        addressInfo: employee.addressInfo,
        jobInfo: employee.jobInfo,
        id: employee.id,
        status: employee.status,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt
      } as any);
    } else {
      reset({
        personalInfo: {
          firstName: '', lastName: '', email: '', phone: '', birthDate: '', cpf: ''
        },
        addressInfo: {
          street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: ''
        },
        jobInfo: {
          position: '', department: '', salary: 0, startDate: '', workSchedule: '', employmentType: '',
          jobTitle: '', admissionDate: '', hierarchyLevel: '', managerId: '', baseSalary: 0
        }
      } as any);
    }
  }, [employee, reset]);

  const { 
    currentStep, 
    nextStep, 
    previousStep, 
    isFirstStep, 
    isLastStep, 
    progress,
    reset: resetSteps
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

  const onSubmit: SubmitHandler<Employee> = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      if (employee?.id) {
        await EmployeeService.updateEmployee(employee.id, data);
        setEmployeeId(employee.id);
        setSuccess(true);
      } else {
        const id = await EmployeeService.saveEmployee(data);
        setEmployeeId(id);
        setSuccess(true);
      }
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
    
    resetSteps();
    
    reset({
      personalInfo: {
        firstName: '', lastName: '', email: '', phone: '', birthDate: '', cpf: ''
      },
      addressInfo: {
        street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: ''
      },
      jobInfo: {
        position: '', department: '', salary: 0, startDate: '', workSchedule: '', employmentType: ''
      }
    } as any);
  };

  const renderStepContent = () => {
    const StepComponent = steps[currentStep].component;
    return <StepComponent control={control as any} />;
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
          {onCancel && (
            <Button 
              variant="text" 
              size="large"
              onClick={onCancel}
              sx={{ 
                mt: 1,
                ml: 2,
                textTransform: 'none'
              }}
            >
              Voltar ao menu
            </Button>
          )}
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
        <Box sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          pb: { xs: 1, sm: 2 },
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Button 
              variant="text" 
              startIcon={<ArrowBack />} 
              onClick={onCancel}
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Voltar ao menu
            </Button>
          </Box>
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
            {employee?.id ? 'Editar Funcionário' : 'Cadastro de Funcionário'}
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
        </Box>

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
            {employee?.id ? 'Editando cadastro' : `Etapa ${currentStep + 1} de ${steps.length} (${Math.round(progress)}%)`}
          </Typography>
        </Box>
        
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

        {error && (
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mb: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Alerta informativo sobre fluxo de trabalho */}
        {!employee && (
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mb: 2 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Dica:</strong> Você pode cadastrar funcionários sem departamento e atribuí-los depois. 
                Para gestores, você pode criar departamentos sem gestor e atribuí-los posteriormente através da opção "Gerenciar Atribuições".
              </Typography>
            </Alert>
          </Box>
        )}

        <Box sx={{ 
          flex: 1,
          p: { xs: 2, sm: 3, md: 4 }, 
          pt: 0,
          overflowY: 'auto'
        }}>
          <Box>
            {renderStepContent()}
            
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
                  onClick={handleSubmit(onSubmit as any)}
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
                  {loading ? 'Salvando...' : (employee?.id ? 'Salvar Alterações' : 'Finalizar Cadastro')}
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
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
