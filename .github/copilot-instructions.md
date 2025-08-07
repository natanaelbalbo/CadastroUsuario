# Copilot Instructions para Flugo - Cadastro de Funcionários

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexto do Projeto

Este é um projeto React com TypeScript para cadastro de funcionários usando formulário multi-step. O design segue o padrão visual da Flugo.

## Tecnologias Principais

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Material UI (MUI) v5
- **Formulários**: React Hook Form + Yup
- **Backend**: Firebase Firestore
- **Estilização**: Emotion (integrado ao MUI)

## Padrões de Código

### Componentes
- Use componentes funcionais com TypeScript
- Prefira hooks ao invés de classes
- Use interfaces TypeScript para tipagem

### Formulários
- Use React Hook Form para gerenciamento de estado
- Valide com Yup schemas
- Implemente feedback visual de erros

### Estilização
- Use Material UI components
- Aplique cores seguindo o theme da Flugo (verde primário)
- Mantenha responsividade com Grid system do MUI

### Firebase
- Use Firestore para persistência
- Implemente tratamento de erros
- Use async/await para operações

## Estrutura de Arquivos

```
src/
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── services/           # Serviços (Firebase, APIs)
├── types/              # Interfaces TypeScript
├── config/             # Configurações
├── utils/              # Funções utilitárias
└── theme/              # Tema Material UI
```

## Cores da Flugo

- **Verde Primário**: #22c55e (baseado na screenshot)
- **Cinza**: #6b7280
- **Fundo**: #f9fafb
