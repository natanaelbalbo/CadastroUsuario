# Configuração do Firebase - Passo a Passo

## 🔥 Configuração Completa do Firebase

### 1. Criar Projeto Firebase

1. Acesse [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. **Nome do projeto:** `flugo-app-colaborador`
4. **Google Analytics:** Ative (recomendado)
5. Clique em **"Criar projeto"**

### 2. Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. **Modo de segurança:** Selecione **"Iniciar no modo de teste"**
4. **Local:** Escolha **"southamerica-east1 (São Paulo)"**
5. Clique em **"Concluído"**

### 3. Adicionar App Web

1. No painel principal, clique no ícone **"</>" (Web)**
2. **Nome do app:** `Flugo App Colaborador`
3. **Firebase Hosting:** Marque se pretende usar (opcional)
4. Clique em **"Registrar app"**

### 4. Copiar Configurações

**IMPORTANTE:** Copie essas configurações que aparecem na tela:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123...", // ← COPIE ESTE
  authDomain: "flugo-app-colaborador.firebaseapp.com", // ← COPIE ESTE  
  projectId: "flugo-app-colaborador", // ← COPIE ESTE
  storageBucket: "flugo-app-colaborador.appspot.com", // ← COPIE ESTE
  messagingSenderId: "123456789", // ← COPIE ESTE
  appId: "1:123456789:web:abc123" // ← COPIE ESTE
};
```

### 5. Configurar Arquivo .env

1. **Copie o arquivo `.env.example` para `.env`:**
```bash
cp .env.example .env
```

2. **Edite o arquivo `.env` com suas configurações:**
```env
VITE_FIREBASE_API_KEY=AIzaSyABC123...
VITE_FIREBASE_AUTH_DOMAIN=flugo-app-colaborador.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=flugo-app-colaborador
VITE_FIREBASE_STORAGE_BUCKET=flugo-app-colaborador.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 6. Configurar Regras de Segurança

1. No Firestore, vá para **"Regras"**
2. **Substitua o conteúdo** por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite operações na coleção employees
    match /employees/{document} {
      allow read, write: if true;
    }
  }
}
```

3. Clique em **"Publicar"**

⚠️ **IMPORTANTE:** Esta regra permite acesso total. Em produção, implemente autenticação!

### 7. Testar Conexão

1. **Execute o projeto:**
```bash
npm run dev
```

2. **Abra o navegador:** `http://localhost:5174`

3. **Teste o formulário:**
   - Preencha um funcionário fictício
   - Clique em "Finalizar Cadastro"
   - Deve aparecer "Funcionário Cadastrado com Sucesso!"

4. **Verifique no Firebase:**
   - Volte ao Firestore Database
   - Deve aparecer uma coleção `employees`
   - Com o documento do funcionário cadastrado

## 🔧 Solução de Problemas

### Erro: "Firebase not configured"
- ✅ Verifique se o arquivo `.env` existe
- ✅ Confirme se as variáveis estão corretas
- ✅ Reinicie o servidor (`Ctrl+C` e `npm run dev`)

### Erro: "Permission denied"
- ✅ Verifique as regras do Firestore
- ✅ Confirme se a coleção `employees` tem permissão

### Erro: "Project not found"
- ✅ Confirme o `projectId` no `.env`
- ✅ Verifique se o projeto existe no Firebase Console

### Formulário não salva
- ✅ Abra F12 (DevTools) e veja o Console
- ✅ Verifique se há erros de rede
- ✅ Confirme se o Firestore está ativado

## 📱 Exemplo de Teste

**Dados de teste para o formulário:**

```
=== INFORMAÇÕES PESSOAIS ===
Nome: João
Sobrenome: Silva
Email: joao.silva@email.com
Telefone: (11) 99999-9999
Data Nascimento: 1990-01-01
CPF: 123.456.789-10

=== ENDEREÇO ===
Rua: Rua das Flores
Número: 123
Complemento: Apto 45
Bairro: Centro
Cidade: São Paulo
Estado: SP
CEP: 01234-567

=== PROFISSIONAL ===
Cargo: Desenvolvedor Frontend
Departamento: Tecnologia
Salário: 8000
Tipo: CLT
Data Início: 2025-01-01
Horário: 09:00 - 18:00
```

## 🚀 Próximos Passos

Após configurar o Firebase:

1. ✅ Teste o formulário completo
2. ✅ Faça deploy (ver `DEPLOY.md`)
3. ✅ Configure autenticação (produção)
4. ✅ Implemente regras de segurança adequadas
5. ✅ Monitore uso no Firebase Console

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique o Console do navegador** (F12)
2. **Confirme todas as configurações** acima
3. **Teste com os dados de exemplo**
4. **Reinicie o projeto** completamente

---

**🔥 Firebase configurado com sucesso!** Agora você pode cadastrar funcionários! 🎉
