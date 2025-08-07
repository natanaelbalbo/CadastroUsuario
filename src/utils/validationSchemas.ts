import * as yup from 'yup';

// Schema para informações pessoais
export const personalInfoSchema = yup.object({
  firstName: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  
  lastName: yup
    .string()
    .required('Sobrenome é obrigatório')
    .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
  
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ter um formato válido'),
  
  phone: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (99) 99999-9999'),
  
  birthDate: yup
    .string()
    .required('Data de nascimento é obrigatória')
    .test('age', 'Deve ter pelo menos 18 anos', function(value) {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 999.999.999-99')
    .test('cpf-valid', 'CPF inválido', function(value) {
      if (!value) return false;
      
      // Remove pontos e hífen
      const cpf = value.replace(/[^\d]/g, '');
      
      // Verifica se tem 11 dígitos
      if (cpf.length !== 11) return false;
      
      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cpf)) return false;
      
      // Validação do CPF
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.charAt(9))) return false;
      
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.charAt(10))) return false;
      
      return true;
    })
});

// Schema para informações de endereço
export const addressInfoSchema = yup.object({
  street: yup
    .string()
    .required('Rua é obrigatória')
    .min(5, 'Rua deve ter pelo menos 5 caracteres')
    .max(100, 'Rua deve ter no máximo 100 caracteres'),
  
  number: yup
    .string()
    .required('Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  
  complement: yup
    .string()
    .optional()
    .max(50, 'Complemento deve ter no máximo 50 caracteres'),
  
  neighborhood: yup
    .string()
    .required('Bairro é obrigatório')
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(50, 'Bairro deve ter no máximo 50 caracteres'),
  
  city: yup
    .string()
    .required('Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(50, 'Cidade deve ter no máximo 50 caracteres'),
  
  state: yup
    .string()
    .required('Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres (ex: SP)'),
  
  zipCode: yup
    .string()
    .required('CEP é obrigatório')
    .matches(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 99999-999')
});

// Schema para informações de trabalho
export const jobInfoSchema = yup.object({
  position: yup
    .string()
    .required('Cargo é obrigatório')
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .max(50, 'Cargo deve ter no máximo 50 caracteres'),
  
  department: yup
    .string()
    .required('Departamento é obrigatório')
    .min(2, 'Departamento deve ter pelo menos 2 caracteres')
    .max(50, 'Departamento deve ter no máximo 50 caracteres'),
  
  salary: yup
    .number()
    .required('Salário é obrigatório')
    .positive('Salário deve ser um valor positivo')
    .min(1000, 'Salário deve ser pelo menos R$ 1.000')
    .max(1000000, 'Salário deve ser no máximo R$ 1.000.000'),
  
  startDate: yup
    .string()
    .required('Data de início é obrigatória')
    .test('future-date', 'Data de início não pode ser no passado', function(value) {
      if (!value) return false;
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return startDate >= today;
    }),
  
  workSchedule: yup
    .string()
    .required('Horário de trabalho é obrigatório'),
  
  employmentType: yup
    .string()
    .required('Tipo de contratação é obrigatório')
    .oneOf(['CLT', 'PJ', 'Estagiário', 'Freelancer'], 'Tipo de contratação inválido')
});

// Schema completo do funcionário
export const employeeSchema = yup.object({
  personalInfo: personalInfoSchema,
  addressInfo: addressInfoSchema,
  jobInfo: jobInfoSchema
});
