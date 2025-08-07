# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Flugo - Cadastro de Funcionários

Sistema de cadastro de funcionários desenvolvido em ReactJS com TypeScript, Material UI e Firebase, seguindo o design pattern da Flugo.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Material UI (MUI) v5
- **Formulários**: React Hook Form + Yup (validações)
- **Backend**: Firebase Firestore
- **Estilização**: Emotion (integrado ao MUI)
- **Build Tool**: Vite
- **Linting**: ESLint + TypeScript

## 📋 Funcionalidades

- ✅ Formulário multi-step (3 etapas)
- ✅ Validação completa de campos obrigatórios
- ✅ Formatação automática (CPF, telefone, CEP)
- ✅ Persistência no Firebase Firestore
- ✅ Interface responsiva seguindo design da Flugo
- ✅ Feedback visual de progresso e erros
- ✅ Tema personalizado com cores da Flugo

## 🛠️ Como executar localmente

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Firebase

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/flugo-appcolaborador.git
cd flugo-appcolaborador
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o Firebase:**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative o Firestore Database
   - Copie o arquivo `.env.example` para `.env`
   - Substitua as configurações pelos valores do seu projeto Firebase:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456789
```

4. **Execute o projeto:**
```bash
npm run dev
```

5. **Acesse no navegador:**
   - Desenvolvimento: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/              # Componentes React
│   ├── EmployeeRegistrationForm.tsx    # Formulário principal
│   ├── PersonalInfoStep.tsx            # Etapa 1: Dados pessoais
│   ├── AddressInfoStep.tsx             # Etapa 2: Endereço
│   └── JobInfoStep.tsx                 # Etapa 3: Dados profissionais
├── hooks/                   # Custom hooks
│   └── useMultiStepForm.ts             # Hook para gerenciar steps
├── services/                # Serviços (Firebase, APIs)
│   └── employeeService.ts              # CRUD de funcionários
├── types/                   # Interfaces TypeScript
│   └── Employee.ts                     # Tipos do funcionário
├── config/                  # Configurações
│   └── firebase.ts                     # Configuração Firebase
├── utils/                   # Funções utilitárias
│   ├── formatters.ts                   # Formatação de dados
│   └── validationSchemas.ts           # Schemas de validação
├── theme/                   # Tema Material UI
│   └── flugoTheme.ts                   # Tema personalizado Flugo
├── App.tsx                  # Componente principal
└── main.tsx                # Entry point
```

## 🎨 Design System - Cores da Flugo

- **Verde Primário**: `#22c55e`
- **Verde Escuro**: `#16a34a`
- **Verde Claro**: `#4ade80`
- **Cinza**: `#6b7280`
- **Fundo**: `#f9fafb`

## 📝 Etapas do Formulário

### 1. **Informações Pessoais**
- Nome e sobrenome
- Email
- Telefone (formato brasileiro)
- Data de nascimento (validação +18 anos)
- CPF (validação com algoritmo)

### 2. **Endereço**
- Rua/logradouro e número
- Complemento (opcional)
- Bairro, cidade e estado
- CEP (formato brasileiro)

### 3. **Informações Profissionais**
- Cargo e departamento
- Salário
- Tipo de contratação (CLT, PJ, Estagiário, Freelancer)
- Data de início
- Horário de trabalho

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 🌐 Deploy

O projeto pode ser facilmente deployado em:

- **Vercel**: `vercel --prod`
- **Netlify**: Conecte o repositório
- **Firebase Hosting**: `firebase deploy`

### Deploy na Vercel (Recomendado)

1. Instale a CLI da Vercel: `npm i -g vercel`
2. Execute: `vercel --prod`
3. Configure as variáveis de ambiente no dashboard da Vercel

## 🔧 Configuração do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative o **Firestore Database** (modo teste)
4. Vá em **Configurações do projeto** > **Geral**
5. Role até **Seus apps** e clique em **Web**
6. Copie as configurações e cole no arquivo `.env`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido como parte do desafio técnico da Flugo.

---

**Flugo** - Cadastro de Funcionários © 2025

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
