# Sistema de Gestão de Funcionários e Departamentos
Sistema web completo para gestão de funcionários e departamentos com autenticação, dashboard e relatórios desenvolvido com React, TypeScript e Firebase.

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
- **Sistema de Gerenciamento de Atribuições** - resolve dependência circular
- Vinculação de gestores responsáveis (opcional na criação)
- Associação de funcionários aos departamentos
- Interface dedicada para atribuições em lote
- Exclusão de departamentos

#### Por que foi criada a tela "Gerenciar Atribuições"?

Durante o desenvolvimento foi identificado um problema técnico de dependência circular onde era impossível criar os primeiros registros do sistema:
- Para criar um Departamento era necessário ter um Gestor cadastrado
- Para cadastrar um Funcionário Gestor era necessário ter um Departamento

**Solução Implementada:**
A tela "Gerenciar Atribuições" resolve este problema permitindo:

1. **Criação Independente**: Departamentos podem ser criados sem gestor e funcionários podem ser cadastrados sem departamento
2. **Conexão Posterior**: Interface dedicada para conectar gestores aos departamentos e funcionários aos departamentos
3. **Visibilidade**: Mostra claramente quais departamentos não têm gestor e quais funcionários não têm departamento
4. **Atribuição em Lote**: Permite atribuir múltiplos funcionários a um departamento de uma vez

**Casos de Uso:**
- **Cenário A**: Criar departamento "Vendas" sem gestor → Cadastrar João como gestor → Usar "Gerenciar Atribuições" para conectar João ao departamento Vendas
- **Cenário B**: Cadastrar funcionário Maria sem departamento → Criar departamento "Marketing" → Usar "Gerenciar Atribuições" para atribuir Maria ao Marketing
- **Cenário C**: Organizar múltiplos funcionários e departamentos criados separadamente

**Funcionalidades da Tela:**
- Lista departamentos que não possuem gestor responsável
- Lista funcionários que não estão vinculados a nenhum departamento  
- Interface para atribuir gestores específicos a departamentos
- Interface para atribuir funcionários a departamentos (individual ou em lote)
- Feedback visual do status das atribuições
- Validações para garantir que apenas funcionários com nível "gestor" podem ser atribuídos como gestores

Esta solução mantém a integridade das regras de negócio enquanto remove a dependência circular, proporcionando flexibilidade na ordem de cadastro dos dados.

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
│   ├── DepartmentAssignmentForm.tsx  # ← NOVO: Gerencia atribuições
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
3. **Opcional:** Selecione o gestor responsável (pode ser definido depois)
4. **Opcional:** Adicione funcionários ao departamento
5. Clique em "Salvar Departamento"

#### Gerenciar Atribuições (NOVO)

**Quando usar esta funcionalidade:**
- Quando você criou departamentos sem gestor definido
- Quando você cadastrou funcionários sem departamento
- Quando precisa reorganizar a estrutura organizacional
- Quando quer atribuir múltiplos funcionários a um departamento rapidamente

**Passo a passo:**
1. No dashboard, clique em "Listar Departamentos"
2. Clique no botão **"Gerenciar Atribuições"**
3. A tela mostrará dois painéis:
   - **Esquerda**: Departamentos sem Gestor - lista todos os departamentos que ainda não têm um responsável
   - **Direita**: Funcionários sem Departamento - lista todos os funcionários que não estão vinculados a nenhum departamento

**Para atribuir um gestor a um departamento:**
1. No painel esquerdo, clique em "Atribuir Gestor" no departamento desejado
2. Selecione um funcionário com nível hierárquico "gestor"
3. A atribuição é feita automaticamente

**Para atribuir funcionários a um departamento:**
1. No painel direito, clique em "Atribuir a Departamento"
2. Selecione o departamento de destino
3. Marque os funcionários que deseja atribuir (pode ser múltiplos)
4. Clique em "Atribuir" para confirmar

**Resultado:** Os funcionários e gestores ficam organizados nos departamentos, eliminando a necessidade de definir essas relações no momento do cadastro.

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

### Funcionários sem Departamento
- Funcionários podem ser cadastrados sem departamento inicial
- Use **"Gerenciar Atribuições"** para atribuir depois
- Funcionários com nível "gestor" ficam disponíveis para gerenciar departamentos

### Departamentos sem Gestor  
- Departamentos podem ser criados sem gestor definido
- Use **"Gerenciar Atribuições"** para atribuir um gestor depois
- Sistema valida se o funcionário tem nível hierárquico "gestor"

### Problemas com Atribuições

**Gestor não aparece na lista de seleção:**
- Verifique se o funcionário tem nível hierárquico definido como "gestor"
- Confirme se o funcionário está com status "ativo"
- Use "Gerenciar Atribuições" para ver todos os gestores disponíveis

**Funcionário não aparece para atribuição:**
- Funcionários só aparecem se não tiverem departamento definido
- Verifique se o campo "departamento" está vazio no cadastro do funcionário
- Funcionários já vinculados a departamentos não aparecem na lista

**Departamento não aceita gestor:**
- Apenas funcionários com nível hierárquico "gestor" podem ser atribuídos
- Edite o funcionário e altere o nível hierárquico para "gestor"
- Departamentos podem ter apenas um gestor por vez

**Erro ao carregar dados na tela de atribuições:**
- Verifique a conexão com Firebase
- Console do navegador pode mostrar erros específicos
- Tente recarregar a página ou fazer logout/login

### Erro de build
- Execute `npm install` novamente
- Verifique se todas as variáveis de ambiente estão definidas
- Confirme se está usando Node.js 16+

## Documentação Técnica

### Arquivos Principais da Funcionalidade "Gerenciar Atribuições"

#### `src/components/DepartmentAssignmentForm.tsx`
Interface completa para gerenciar atribuições:
- Lista departamentos sem gestor
- Lista funcionários sem departamento  
- Permite atribuições individuais e em lote
- Interface visual clara com feedback de status

#### `src/services/departmentService.ts` - Métodos Adicionados
```typescript
// Buscar departamentos sem gestor
getDepartmentsWithoutManager(): Promise<Department[]>

// Atribuir gestor a departamento
assignManagerToDepartment(departmentId: string, managerId: string): Promise<void>
```

#### `src/services/employeeService.ts` - Métodos Adicionados  
```typescript
// Buscar funcionários sem departamento
getEmployeesWithoutDepartment(): Promise<Employee[]>

// Atribuir departamento a funcionário
assignDepartmentToEmployee(employeeId: string, department: string): Promise<void>
```

#### `src/types/Department.ts` - Modificado
```typescript
interface Department {
  managerId?: string; // ← Agora opcional (era obrigatório)
  // ... outros campos
}
```

#### `src/types/Employee.ts` - Modificado
```typescript  
interface JobInfo {
  department?: string; // ← Agora opcional (era obrigatório)
  // ... outros campos  
}
```

### Para Desenvolvedores

#### Fluxo de Dados do Sistema
1. **Criação Flexível**: Campos opcionais permitem criação independente
2. **Interface de Atribuição**: `DepartmentAssignmentForm` conecta entidades  
3. **Validação Mantida**: Regras de negócio preservadas
4. **Estado Consistente**: Firebase mantém integridade dos dados

#### Decisões de Design
- **Opcional vs Obrigatório**: Tornei campos opcionais apenas na **criação**
- **Interface Dedicada**: Separei atribuições em tela específica  
- **Feedback Visual**: Alertas informativos orientam o usuário
- **Compatibilidade**: Fluxo antigo continua funcionando

