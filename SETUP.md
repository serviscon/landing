# 🚀 Guia de Configuração e Deployment

## Configuração Local

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Autenticação
JWT_SECRET=sua_chave_secreta_muito_longa_aqui_minimo_32_caracteres
ADMIN_PASSWORD=sua_senha_de_admin_segura

# Database
DATABASE_URL=file:./data/noticias.db

# Environment
NODE_ENV=development
```

**Importante**: 
- `JWT_SECRET` deve ter pelo menos 32 caracteres
- `ADMIN_PASSWORD` é a senha de acesso ao painel
- Nunca compartilhe essas variáveis

### 2. Instalação de Dependências

```bash
npm install
# ou
pnpm install
```

### 3. Criar Banco de Dados

```bash
npm run db:push
```

Este comando:
- Cria a pasta `/data`
- Inicializa `noticias.db`
- Executa o schema do Drizzle ORM

### 4. Iniciar Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`

## Deployment (Vercel)

### 1. Preparar Repositório

```bash
git add .
git commit -m "Setup: Database and admin panel infrastructure"
git push origin main
```

### 2. Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New" → "Project"
3. Selecione o repositório GitHub
4. Clique em "Import"

### 3. Configurar Variáveis de Ambiente

No Vercel, em "Settings" → "Environment Variables":

```
JWT_SECRET = sua_chave_secreta_muito_longa
ADMIN_PASSWORD = sua_senha_de_admin
DATABASE_URL = file:./data/noticias.db
```

### 4. Deploy

```bash
git push origin main
```

Vercel fará o deploy automaticamente!

## Gerenciamento do Banco de Dados

### Acessar Drizzle Studio

Para gerenciar dados diretamente:

```bash
npm run db:studio
```

Abrirá uma interface web em `http://localhost:3001`

### Backup do Banco

Antes de fazer deploy:

```bash
cp data/noticias.db data/noticias.db.backup
```

### Restaurar do Backup

```bash
cp data/noticias.db.backup data/noticias.db
```

## Primeiro Acesso

### 1. Acessar o Painel

- Local: `http://localhost:3000/admin/login`
- Produção: `https://seu-dominio.com/admin/login`

### 2. Fazer Login

- Digite a senha configurada em `ADMIN_PASSWORD`
- Clique em "Entrar"

### 3. Criar Primeira Notícia

1. Clique em "+ Nova Notícia"
2. Preencha os campos:
   - **Título**: Ex: "Bem-vindo à Serviscon"
   - **Resumo**: Ex: "Conheça nossa empresa e missão"
   - **Categoria**: "Institucional"
   - **Data**: Data de hoje
   - **Imagem**: Upload de uma imagem (JPEG, PNG ou WebP)
   - **Conteúdo**: Escreva o conteúdo em HTML ou texto simples
3. Clique em "Publicar Notícia"

## Estrutura de Diretórios Criados

Após a instalação, você terá:

```
landing/
├── data/
│   └── noticias.db          # Banco de dados SQLite
├── public/
│   └── noticias/            # Imagens das notícias
├── src/
│   ├── app/
│   │   ├── admin/           # Painel administrativo
│   │   ├── api/             # APIs RESTful
│   │   ├── noticias/        # Páginas públicas
│   │   ├── _components/     # Componentes React
│   │   └── page.tsx         # Home
│   ├── db/                  # Banco de dados
│   ├── lib/                 # Utilitários
│   └── middleware.ts        # Autenticação
├── .env.local               # Variáveis de ambiente
├── .gitignore               # Arquivos ignorados
└── README.md                # Documentação
```

## Checklist de Deployment

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado (`npm run db:push`)
- [ ] Testado localmente
- [ ] Código commitado e pusheado
- [ ] Vercel configurado com variáveis
- [ ] Primeira notícia criada
- [ ] URLs públicas testadas
- [ ] Painel admin testado
- [ ] Imagens fazendo upload corretamente
- [ ] SSL/HTTPS ativo (Vercel fornece)

## Próximos Passos

1. **Customizar Design**
   - Edite cores em `tailwind.config.ts`
   - Customize componentes em `src/components`

2. **Integrar com Domain**
   - Configure domínio no Vercel
   - Atualize URLs de SEO

3. **Backups Automáticos**
   - Configure backups do banco de dados
   - Considere usar um serviço de backup

4. **Monitoramento**
   - Configure logs no Vercel
   - Monitore performance

5. **Adicionar Mais Categorias**
   - Edite `CATEGORIAS` em `src/lib/validators.ts`
   - Recrie o banco se necessário
