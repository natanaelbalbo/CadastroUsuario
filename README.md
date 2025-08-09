# Sistema de Cadastro de Funcionários 
Sistema web para cadastro e gerenciamento de funcionários desenvolvido com React, TypeScript e Firebase## Scripts Disponíveis

## Tecnologias Utilizadas# Tecnologias Utilizadastema de Cadastro de Funcionários - Flugo

Sistema web para cadastro e gerenciamento de funcionários desenvolvido com React, ## Scripts DisponíveisypeScript e Firebase.

## � Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **UI Library:** Material UI (MUI) v5  
- **Formulários:** React Hook Form + Yup
- **Backend:** Firebase Firestore
- **Estilização:** Emotion (integrado ao MUI)

## Funcionalidades

- Formulário multi-step para cadastro de funcionários
- Listagem de funcionários cadastrados
- Edição e exclusão de funcionários
- Validação completa de formulários
- Formatação automática de campos (CPF, telefone, CEP, salário)
- Persistência de dados no Firebase Firestore

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

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── EmployeeRegistrationForm.tsx
│   ├── PersonalInfoStep.tsx
│   ├── AddressInfoStep.tsx
│   ├── JobInfoStep.tsx
│   └── EmployeeList.tsx
├── hooks/              # Custom hooks
│   └── useMultiStepForm.ts
├── services/           # Serviços (Firebase, APIs)
│   └── employeeService.ts
├── types/              # Interfaces TypeScript
│   └── Employee.ts
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

### Cadastrar um novo funcionário
1. Na tela inicial, clique em "Novo Colaborador"
2. Preencha as informações pessoais (Etapa 1)
3. Preencha o endereço (Etapa 2)
4. Preencha as informações profissionais (Etapa 3)
5. Clique em "Finalizar Cadastro"

### Gerenciar funcionários
- **Editar:** Clique no ícone de lápis na listagem
- **Excluir:** Clique no ícone de lixeira e confirme a ação
- **Voltar ao menu:** Use o botão "Voltar ao menu" a qualquer momento

## Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## Deploy

### Vercel (Recomendado)
1. Instale a CLI da Vercel: `npm i -g vercel`
2. Execute: `vercel`
3. Siga as instruções
4. Configure as variáveis de ambiente no painel da Vercel

### Outras opções
- **Netlify:** Arraste a pasta `dist` no painel do Netlify
- **Firebase Hosting:** `npm run build && firebase deploy`

## � Scripts Disponíveis

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

