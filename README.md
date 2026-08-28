# 📰 Painel de Notícias - Serviscon Landing Page

Sistema completo de gerenciamento de notícias integrado à landing page da Serviscon. Permite que administradores publiquem, editem e gerenciem notícias através de um painel administrativo seguro.

## ✨ Recursos

### 🌐 Públicos (Frontend)
- **Seção de notícias na home** - Exibe as 3 notícias mais recentes
- **Página de listagem completa** (`/noticias`) - Lista todas as notícias publicadas
- **Páginas de artigos individuais** (`/noticias/[slug]`) - Leitura completa com imagem e conteúdo em HTML
- **Design responsivo** - Otimizado para desktop, tablet e mobile
- **SEO otimizado** - Meta tags, Open Graph e sitemap automático

### 🔐 Administrativos (Backend)
- **Autenticação segura** - Login com JWT e cookies httpOnly
- **Painel de gerenciamento** (`/admin/noticias`) - Lista todas as notícias (rascunhos e publicadas)
- **Criar notíciais** (`/admin/noticias/nova`) - Formulário completo com upload de imagem
- **Editar notícias** (`/admin/noticias/[id]/editar`) - Atualizar dados e status
- **Deletar notícias** - Soft delete (não remove permanentemente)
- **Upload de imagens** - Salva em `/public/noticias` com validação
- **Status de publicação** - Rascunho ou Publicado

### 🗄️ Banco de Dados
- **SQLite com Drizzle ORM** - Banco de dados leve e portável
- **Schema robusto** - Campos validados e relacionados
- **Timestamps automáticos** - `createdAt` e `updatedAt` automáticos
- **Soft delete** - Notícias não são deletadas permanentemente
- **Slugs únicos** - URLs amigáveis e SEO-friendly

### 🔗 APIs RESTful
- `POST /api/auth/login` - Autenticar administrador
- `POST /api/auth/logout` - Desconectar
- `GET /api/auth/verify` - Verificar autenticação
- `GET /api/noticias` - Listar todas as notícias (públicas ou admin)
- `POST /api/noticias` - Criar nova notícia
- `GET /api/noticias/[id]` - Obter notícia por ID ou slug
- `PUT /api/noticias/[id]` - Atualizar notícia
- `DELETE /api/noticias/[id]` - Deletar notícia (soft delete)
- `GET /api/noticias/recentes` - Obter 3 notícias mais recentes
- `POST /api/upload` - Fazer upload de imagem

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+ ou superior
- npm ou pnpm

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/serviscon/landing.git
cd landing
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` e configure:
```env
# Autenticação
JWT_SECRET=sua_chave_secreta_muito_longa_aqui_minimo_32_caracteres
ADMIN_PASSWORD=sua_senha_de_administrador

# Database
DATABASE_URL=file:./data/noticias.db
```

4. **Crie o banco de dados**
```bash
npm run db:push
# ou
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📋 Usando o Painel Administrativo

### Acessar o Painel
1. Acesse `http://localhost:3000/admin/login`
2. Digite a senha configurada em `ADMIN_PASSWORD`
3. Clique em "Entrar"

### Criar uma Notícia
1. No painel, clique em "+ Nova Notícia"
2. Preencha os campos:
   - **Título**: Título da notícia
   - **Resumo**: Descrição breve (aparece em cards)
   - **Categoria**: Escolha entre as categorias disponíveis
   - **Data**: Data da publicação
   - **Imagem**: Upload da imagem de capa (JPEG, PNG, WebP)
   - **Conteúdo**: Texto completo em HTML
3. Clique em "Salvar Rascunho" para salvar sem publicar
4. Ou clique em "Publicar Notícia" para publicar imediatamente

### Editar uma Notícia
1. Na listagem, clique no ícone de lápis (✏️) na notícia
2. Faça as alterações necessárias
3. Clique em "Salvar Rascunho" ou "Publicar Notícia"

### Deletar uma Notícia
1. Na listagem, clique no ícone de lixeira (🗑️)
2. Confirme a exclusão
3. A notícia será soft-deletada (não aparecerá mais, mas pode ser restaurada via banco)

## 🎨 Personalizando Conteúdo HTML

No campo de conteúdo, você pode usar as seguintes tags HTML:

```html
<!-- Parágrafos -->
<p>Texto do parágrafo aqui</p>

<!-- Títulos -->
<h2>Subtítulo 1</h2>
<h3>Subtítulo 2</h3>

<!-- Ênfase -->
<strong>Texto em negrito</strong>
<em>Texto em itálico</em>

<!-- Listas -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<ol>
  <li>Passo 1</li>
  <li>Passo 2</li>
</ol>

<!-- Links -->
<a href="https://exemplo.com">Link externo</a>
```

## 📁 Estrutura do Projeto

```
landing/
├── src/
│   ├── app/
│   │   ├── admin/                 # Painel administrativo
│   │   │   ├── login/page.tsx     # Login
│   │   │   └── noticias/
│   │   │       ├── page.tsx       # Listagem de notícias
│   │   │       ├── nova/          # Criar notícia
│   │   │       └── [id]/editar/   # Editar notícia
│   │   ├── api/                   # APIs RESTful
│   │   │   ├── auth/              # Autenticação
│   │   │   ├── noticias/          # CRUD de notícias
│   │   │   └── upload/            # Upload de imagens
│   │   ├── noticias/              # Páginas públicas
│   │   │   ├── page.tsx           # Listagem
│   │   │   └── [slug]/page.tsx    # Artigo individual
│   │   ├── _components/
│   │   │   ├── header/            # Cabeçalho da página
│   │   │   └── noticias-section/  # Seção de notícias (home)
│   │   └── page.tsx               # Home com NoticiasSection
│   ├── db/
│   │   ├── schema.ts              # Schema do banco de dados
│   │   └── index.ts               # Inicialização do banco
│   ├── lib/
│   │   ├── auth.ts                # JWT e cookies
│   │   ├── slug.ts                # Geração de slugs
│   │   └── validators.ts          # Validações
│   └── components/
│       └── ui/                    # Componentes reutilizáveis
├── public/
│   └── noticias/                  # Imagens das notícias
├── data/                          # Banco de dados SQLite
├── .env.example                   # Variáveis de exemplo
├── .gitignore                     # Arquivos ignorados
├── drizzle.config.ts              # Configuração do Drizzle
├── middleware.ts                  # Middleware de autenticação
└── package.json                   # Dependências e scripts
```

## 🔒 Segurança

### Autenticação
- Tokens JWT com validade de 7 dias
- Cookies httpOnly (não acessíveis via JavaScript)
- Middleware de proteção de rotas
- Validação de senha em cada login

### Validação
- Validação de campos obrigatórios
- Validação de tipo de imagem (JPEG, PNG, WebP)
- Limite de tamanho de imagem (5MB)
- Sanitização de conteúdo HTML

### Upload de Imagens
- Validação de tipo MIME
- Nomes de arquivo aleatorizados
- Armazenamento em `/public/noticias`
- Proteção contra sobrescrita

## 📊 Variáveis de Ambiente

```env
# Autenticação JWT
JWT_SECRET=sua_chave_secreta_muito_longa_minimo_32_caracteres

# Senha do admin (configurável por notícia)
ADMIN_PASSWORD=sua_senha_segura_aqui

# Banco de dados SQLite
DATABASE_URL=file:./data/noticias.db

# Node environment
NODE_ENV=production # ou development
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor com hot-reload

# Produção
npm run build        # Build para produção
npm run start        # Inicia servidor de produção

# Banco de dados
npm run db:push      # Cria/atualiza o schema do banco
npm run db:studio    # Abre Drizzle Studio para gerenciar dados

# Linting
npm run lint         # Executa linter
```

## 🔄 Ciclo de Vida de uma Notícia

1. **Criação**: Admin acessa `/admin/noticias/nova`
2. **Preenchimento**: Admin preenche título, resumo, categoria, data, imagem e conteúdo
3. **Salvamento**: Admin clica "Salvar Rascunho" ou "Publicar Notícia"
4. **Status Rascunho**: Notícia fica invisível para público
5. **Publicação**: Admin edita e clica "Publicar Notícia"
6. **Status Publicado**: Notícia aparece em `/noticias` e na home
7. **Edição**: Admin pode editar notícia publicada a qualquer momento
8. **Exclusão**: Admin clica no ícone de lixeira para soft-delete
9. **Fim**: Notícia é marcada como deletada (`deletedAt` preenchido)

## 📱 URLs Principais

### Públicas
- `GET /` - Home com seção de notícias
- `GET /noticias` - Listagem completa de notícias
- `GET /noticias/:slug` - Artigo individual

### Admin (protegidas)
- `GET/POST /admin/login` - Login
- `GET /admin/noticias` - Painel com listagem
- `GET /admin/noticias/nova` - Criar notícia
- `GET /admin/noticias/:id/editar` - Editar notícia

## 🐛 Troubleshooting

### Erro: "Banco de dados não encontrado"
- Execute `npm run db:push` para criar o schema

### Erro: "Autenticação não configurada"
- Adicione `ADMIN_PASSWORD` ao arquivo `.env.local`

### Imagens não aparecem
- Verifique se a pasta `/public/noticias` foi criada
- Confirme que as imagens têm nomes únicos
- Verifique permissões de leitura do servidor

### Erro de upload de imagem
- Verifique se a imagem é JPEG, PNG ou WebP
- Verifique se o arquivo é menor que 5MB

## 📝 Licença

Este projeto é propriedade da Serviscon.

## 👨‍💻 Desenvolvimento

Desenvolvido com:
- **Framework**: Next.js 15.4
- **Banco de Dados**: SQLite + Drizzle ORM
- **Autenticação**: JWT
- **Estilo**: Tailwind CSS
- **Componentes**: Radix UI
- **Hospedagem**: Vercel (recomendado)

## 📞 Suporte

Para suporte, entre em contato com o time de desenvolvimento.
