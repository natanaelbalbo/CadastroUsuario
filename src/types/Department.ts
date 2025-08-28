export interface Department {
  id?: string;
  name: string; // Nome do departamento
  managerId?: string; // ID do gestor responsável (deve ser um colaborador com nível gestor) - Opcional
  employeeIds: string[]; // IDs dos colaboradores do departamento
  description?: string; // Descrição opcional do departamento
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DepartmentWithDetails extends Department {
  manager?: {
    id: string;
    name: string;
    email: string;
  };
  employees?: {
    id: string;
    name: string;
    email: string;
    position: string;
  }[];
  employeeCount: number;
}