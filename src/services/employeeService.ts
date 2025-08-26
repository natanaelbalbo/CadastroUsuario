import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Employee } from '../types/Employee';

const COLLECTION_NAME = 'employees';

export class EmployeeService {
  static async saveEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const employeeData = {
        ...employee,
        status: 'active' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), employeeData);
      console.log('Funcionário salvo com ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar funcionário: ', error);
      throw new Error('Falha ao salvar funcionário');
    }
  }

  static async getAllEmployees(): Promise<Employee[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const employees: Employee[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        employees.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Employee);
      });

      return employees;
    } catch (error) {
      console.error('Erro ao buscar funcionários: ', error);
      throw new Error('Falha ao buscar funcionários');
    }
  }

  static async updateEmployee(id: string, updates: Partial<Employee>): Promise<void> {
    try {
      const employeeRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(employeeRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      console.log('Funcionário atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar funcionário: ', error);
      throw new Error('Falha ao atualizar funcionário');
    }
  }

  static async deleteEmployee(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      console.log('Funcionário removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover funcionário: ', error);
      throw new Error('Falha ao remover funcionário');
    }
  }

  static async updateEmployeeStatus(id: string, status: 'active' | 'inactive'): Promise<void> {
    try {
      await this.updateEmployee(id, { status });
    } catch (error) {
      console.error('Erro ao atualizar status do funcionário: ', error);
      throw new Error('Falha ao atualizar status do funcionário');
    }
  }

  // Buscar gestores disponíveis para seleção
  static async getManagersForSelection(): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('jobInfo.hierarchyLevel', '==', 'gestor'),
        where('status', '==', 'active'),
        orderBy('personalInfo.firstName')
      );
      const querySnapshot = await getDocs(q);
      
      const managers: Employee[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        managers.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Employee);
      });

      return managers;
    } catch (error) {
      console.error('Erro ao buscar gestores: ', error);
      throw new Error('Falha ao buscar gestores');
    }
  }

  // Buscar colaboradores por departamento
  static async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('jobInfo.department', '==', department),
        where('status', '==', 'active'),
        orderBy('personalInfo.firstName')
      );
      const querySnapshot = await getDocs(q);
      
      const employees: Employee[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        employees.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Employee);
      });

      return employees;
    } catch (error) {
      console.error('Erro ao buscar colaboradores por departamento: ', error);
      throw new Error('Falha ao buscar colaboradores por departamento');
    }
  }

  // Deletar múltiplos colaboradores
  static async deleteMultipleEmployees(ids: string[]): Promise<void> {
    try {
      const deletePromises = ids.map(id => deleteDoc(doc(db, COLLECTION_NAME, id)));
      await Promise.all(deletePromises);
      console.log(`${ids.length} colaboradores removidos com sucesso`);
    } catch (error) {
      console.error('Erro ao remover colaboradores: ', error);
      throw new Error('Falha ao remover colaboradores');
    }
  }
}
