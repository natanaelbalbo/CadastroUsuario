export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
}

export interface AddressInfo {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface JobInfo {
  position: string;
  department?: string; // Departamento agora é opcional
  salary: number;
  startDate: string;
  workSchedule: string;
  employmentType: string;
  // Novos campos adicionados
  jobTitle: string; // Cargo
  admissionDate: string; // Data de admissão
  hierarchyLevel: 'junior' | 'pleno' | 'senior' | 'gestor'; // Nível hierárquico
  managerId?: string; // ID do gestor responsável
  baseSalary: number; // Salário base
}

export interface Employee {
  id?: string;
  personalInfo: PersonalInfo;
  addressInfo: AddressInfo;
  jobInfo: JobInfo;
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormStep {
  label: string;
  component: React.ComponentType<any>;
  fields: string[];
}
