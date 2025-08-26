import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Department, DepartmentWithDetails } from '../types/Department';
import type { Employee } from '../types/Employee';

const COLLECTION_NAME = 'departments';
const EMPLOYEES_COLLECTION = 'employees';

export class DepartmentService {
  // Buscar todos os departamentos
  static async getAllDepartments(): Promise<Department[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Department[];
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      throw new Error('Erro ao buscar departamentos');
    }
  }

  // Buscar departamentos com detalhes (gestor e colaboradores)
  static async getDepartmentsWithDetails(): Promise<DepartmentWithDetails[]> {
    try {
      const departments = await this.getAllDepartments();
      const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION));
      const employees = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];

      return departments.map(dept => {
        const manager = employees.find(emp => emp.id === dept.managerId);
        const deptEmployees = employees.filter(emp => 
          dept.employeeIds.includes(emp.id || '')
        );

        return {
          ...dept,
          manager: manager ? {
            id: manager.id!,
            name: `${manager.personalInfo.firstName} ${manager.personalInfo.lastName}`,
            email: manager.personalInfo.email
          } : undefined,
          employees: deptEmployees.map(emp => ({
            id: emp.id!,
            name: `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`,
            email: emp.personalInfo.email,
            position: emp.jobInfo.position
          })),
          employeeCount: deptEmployees.length
        };
      });
    } catch (error) {
      console.error('Erro ao buscar departamentos com detalhes:', error);
      throw new Error('Erro ao buscar departamentos com detalhes');
    }
  }

  // Buscar departamento por ID
  static async getDepartmentById(id: string): Promise<Department | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Department;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar departamento:', error);
      throw new Error('Erro ao buscar departamento');
    }
  }

  // Criar novo departamento
  static async createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...department,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      throw new Error('Erro ao criar departamento');
    }
  }

  // Atualizar departamento
  static async updateDepartment(id: string, department: Partial<Department>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...department,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar departamento:', error);
      throw new Error('Erro ao atualizar departamento');
    }
  }

  // Excluir departamento
  static async deleteDepartment(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao excluir departamento:', error);
      throw new Error('Erro ao excluir departamento');
    }
  }

  // Buscar gestores disponíveis (colaboradores com nível gestor)
  static async getAvailableManagers(): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, EMPLOYEES_COLLECTION),
        where('jobInfo.hierarchyLevel', '==', 'gestor')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Erro ao buscar gestores:', error);
      throw new Error('Erro ao buscar gestores');
    }
  }

  // Adicionar colaborador ao departamento
  static async addEmployeeToDepartment(departmentId: string, employeeId: string): Promise<void> {
    try {
      const department = await this.getDepartmentById(departmentId);
      if (!department) {
        throw new Error('Departamento não encontrado');
      }

      const updatedEmployeeIds = [...department.employeeIds];
      if (!updatedEmployeeIds.includes(employeeId)) {
        updatedEmployeeIds.push(employeeId);
        await this.updateDepartment(departmentId, {
          employeeIds: updatedEmployeeIds
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar colaborador ao departamento:', error);
      throw new Error('Erro ao adicionar colaborador ao departamento');
    }
  }

  // Remover colaborador do departamento
  static async removeEmployeeFromDepartment(departmentId: string, employeeId: string): Promise<void> {
    try {
      const department = await this.getDepartmentById(departmentId);
      if (!department) {
        throw new Error('Departamento não encontrado');
      }

      const updatedEmployeeIds = department.employeeIds.filter(id => id !== employeeId);
      await this.updateDepartment(departmentId, {
        employeeIds: updatedEmployeeIds
      });
    } catch (error) {
      console.error('Erro ao remover colaborador do departamento:', error);
      throw new Error('Erro ao remover colaborador do departamento');
    }
  }
}