# Sistema de Gestão de Funcionários e Departamentos
Sistema web completo para gestão de funcionários e departamentos com autenticação, dashboard e relatórios desenvolvido com React, TypeScript e Firebase

## Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **UI Library:** Material UI (MUI) v5  
- **Formulários:** React Hook Form + Yup
- **Autenticação:** Firebase Authentication
- **Backend:** Firebase Firestore
- **Roteamento:** React Router DOM
- **Estilização:** Emotion (integrado ao MUI)

## Funcionalidades

### Autenticação
- Sistema de login com Firebase Authentication
- Proteção de rotas privadas
- Logout seguro

### Gestão de Funcionários
- Formulário multi-step para cadastro de funcionários
- Listagem completa com filtros e busca
- Edição e exclusão de funcionários
- Validação completa de formulários
- Formatação automática de campos (CPF, telefone, CEP, salário)
- Informações hierárquicas (júnior, pleno, sênior, gestor)
- Vinculação com gestores responsáveis

### Gestão de Departamentos
- Cadastro e edição de departamentos
- Listagem de departamentos com informações detalhadas
- Vinculação de gestores responsáveis
- Associação de funcionários aos departamentos
- Exclusão de departamentos

### Dashboard
- Visão geral do sistema
- Estatísticas de funcionários e departamentos
- Navegação rápida entre funcionalidades
- Interface responsiva e intuitiva

### Outras Funcionalidades
- Persistência de dados no Firebase Firestore
- Interface responsiva para desktop e mobile
- Tema personalizado com cores da empresa
- Tratamento de erros e loading states

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Uma conta no [Firebase](https://firebase.google.com/)

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/natanaelbalbo/CadastroUsuario.git
cd CadastroUsuario
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

#### 3.1. Crie um projeto no Firebase
1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Criar projeto"
3. Siga os passos para criar seu projeto

#### 3.2. Configure o Firestore Database
1. No console do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Começar no modo teste" (para desenvolvimento)
4. Selecione uma localização

#### 3.3. Obtenha as configurações do projeto
1. Vá em "Configurações do projeto" (ícone de engrenagem)
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique em "Adicionar app" e escolha "Web"
4. Registre o app e copie as configurações

#### 3.4. Configure as variáveis de ambiente
1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações do Firebase:
```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=sua_app_id_aqui
```

### 4. Execute o projeto

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:5173`

## Credenciais de Acesso

Para acessar o sistema, utilize as seguintes credenciais:

- **Email:** nfigueredobalbo@gmail.com
- **Senha:** natan123

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx
│   ├── LoginForm.tsx
│   ├── PrivateRoute.tsx
│   ├── EmployeeRegistrationForm.tsx
│   ├── EmployeeList.tsx
│   ├── PersonalInfoStep.tsx
│   ├── AddressInfoStep.tsx
│   ├── JobInfoStep.tsx
│   ├── DepartmentForm.tsx
│   ├── DepartmentList.tsx
│   └── NotFound.tsx
├── contexts/           # Contextos React
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
│   └── useMultiStepForm.ts
├── services/           # Serviços (Firebase, APIs)
│   ├── employeeService.ts
│   └── departmentService.ts
├── types/              # Interfaces TypeScript
│   ├── Employee.ts
│   └── Department.ts
├── config/             # Configurações
│   └── firebase.ts
├── utils/              # Funções utilitárias
│   ├── formatters.ts
│   └── validationSchemas.ts
├── theme/              # Tema Material UI
│   └── flugoTheme.ts
├── App.tsx
└── main.tsx
```

## Como Usar

### Fazer Login
1. Acesse a aplicação
2. Digite as credenciais fornecidas acima
3. Clique em "Entrar"

### Gerenciar Funcionários

#### Cadastrar um novo funcionário
1. No dashboard, clique em "Cadastrar Funcionário"
2. Preencha as informações pessoais (Etapa 1)
3. Preencha o endereço (Etapa 2)
4. Preencha as informações profissionais (Etapa 3)
5. Clique em "Finalizar Cadastro"

#### Listar e gerenciar funcionários
1. No dashboard, clique em "Listar Funcionários"
2. **Editar:** Clique no ícone de lápis na listagem
3. **Excluir:** Clique no ícone de lixeira e confirme a ação
4. **Buscar:** Use a barra de pesquisa para filtrar funcionários

### Gerenciar Departamentos

#### Cadastrar um novo departamento
1. No dashboard, clique em "Cadastrar Departamento"
2. Preencha o nome do departamento
3. Selecione o gestor responsável
4. Adicione funcionários ao departamento (opcional)
5. Clique em "Salvar Departamento"

#### Listar e gerenciar departamentos
1. No dashboard, clique em "Listar Departamentos"
2. **Editar:** Clique no ícone de lápis na listagem
3. **Excluir:** Clique no ícone de lixeira e confirme a ação
4. **Visualizar:** Veja detalhes dos funcionários vinculados

### Sair do Sistema
- Clique no botão "Sair" no canto superior direito a qualquer momento

## Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## Scripts Disponíveis

- `npm run dev` - Executa em modo de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## Personalização

### Cores do tema
As cores principais estão definidas em `src/theme/flugoTheme.ts`:

```typescript
const flugoTheme = createTheme({
  palette: {
    primary: {
      main: '#22c55e', // Verde da Flugo
    },
    // ...
  }
});
```

### Validações
As regras de validação estão em `src/utils/validationSchemas.ts` e podem ser personalizadas conforme necessário.

## Solução de Problemas

### Erro de conexão com Firebase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o Firestore está ativado no projeto
- Verifique se as regras de segurança permitem leitura/escrita

### Erro de build
- Execute `npm install` novamente
- Verifique se todas as variáveis de ambiente estão definidas
- Confirme se está usando Node.js 16+

