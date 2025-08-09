import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testando conexão com Firebase...');
    
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Teste de conexão',
      timestamp: new Date(),
    });
    
    console.log('✅ Documento de teste criado com ID:', testDoc.id);
    
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Documentos encontrados:', querySnapshot.size);
    
    return { success: true, message: 'Firebase conectado com sucesso!' };
  } catch (error) {
    console.error('❌ Erro na conexão Firebase:', error);
    return { success: false, error };
  }
};
