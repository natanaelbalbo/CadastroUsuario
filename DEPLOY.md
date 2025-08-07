# Instruções de Deploy - Flugo App Colaborador

## Deploy na Vercel (Recomendado)

### 1. Via GitHub (Mais Fácil)

1. **Suba o código para GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: Flugo employee registration system"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/flugo-appcolaborador.git
git push -u origin main
```

2. **Configure na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte com GitHub
   - Importe o repositório
   - Configure as variáveis de ambiente:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

3. **Deploy automático!** ✅

### 2. Via CLI Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variáveis (quando solicitado)
```

## Deploy no Netlify

1. **Build local:**
```bash
npm run build
```

2. **Upload na Netlify:**
   - Acesse [netlify.com](https://netlify.com)
   - Arraste a pasta `dist` para o deploy
   - Configure variáveis de ambiente no dashboard

## Deploy no Firebase Hosting

```bash
# Instalar CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Deploy
firebase deploy
```

## Configuração do Firebase (IMPORTANTE!)

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Nomeie como "flugo-app-colaborador"
4. Ative Google Analytics (opcional)

### 2. Configurar Firestore

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste"
4. Selecione localização (southamerica-east1 para Brasil)

### 3. Configurar App Web

1. No painel principal, clique no ícone "</>"
2. Nome do app: "Flugo App Colaborador"
3. Marque "Firebase Hosting" se for usar
4. **COPIE AS CONFIGURAÇÕES** que aparecem

### 4. Regras de Segurança Firestore

No Firestore, vá em "Regras" e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita na coleção employees
    match /employees/{document} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Em produção, implemente regras de segurança adequadas!

## Variáveis de Ambiente

Crie o arquivo `.env` com:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=flugo-app-colaborador.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=flugo-app-colaborador
VITE_FIREBASE_STORAGE_BUCKET=flugo-app-colaborador.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

## Verificação Pós-Deploy

1. ✅ App carrega sem erros
2. ✅ Formulário funciona corretamente
3. ✅ Validações estão ativas
4. ✅ Dados são salvos no Firestore
5. ✅ Design responsivo
6. ✅ Performance adequada

## URLs de Exemplo

- **Vercel:** `https://flugo-appcolaborador.vercel.app`
- **Netlify:** `https://flugo-appcolaborador.netlify.app`
- **Firebase:** `https://flugo-app-colaborador.web.app`

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

## Suporte

Em caso de problemas:

1. Verifique as configurações do Firebase
2. Confirme as variáveis de ambiente
3. Teste localmente com `npm run dev`
4. Verifique o console do navegador para erros
