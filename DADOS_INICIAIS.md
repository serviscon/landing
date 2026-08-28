# 📚 Dados Iniciais de Exemplo

Este arquivo contém dados de exemplo para testar o sistema de notícias.

## Como Inserir Dados de Exemplo

### Opção 1: Via Drizzle Studio (Recomendado)

```bash
npm run db:studio
```

Depois:
1. Abra `http://localhost:3001`
2. Acesse a tabela `noticias`
3. Clique em "New Record"
4. Preencha os dados
5. Clique em "Save"

### Opção 2: Via Painel Admin

1. Acesse `http://localhost:3000/admin/login`
2. Digite a senha
3. Clique em "+ Nova Notícia"
4. Preencha e publique

## Dados de Exemplo

### Notícia 1: Institucional

```json
{
  "titulo": "Serviscon Comemora 10 Anos de Excelência",
  "resumo": "Uma década de dedicação, inovação e parcerias estratégicas que transformaram o mercado de limpeza e higiene no Brasil.",
  "categoria": "Institucional",
  "data": "2025-01-15",
  "slug": "serviscon-comemora-10-anos",
  "status": "publicado",
  "imagemUrl": "/noticias/2025-01-15-serviscon-10-anos.jpg",
  "conteudo": "<h2>Uma História de Sucesso</h2><p>Nos últimos 10 anos, a Serviscon se consolidou como líder no segmento de limpeza e higiene, atendendo mais de 500 clientes em todo o Brasil.</p><p>Nossa missão sempre foi proporcionar soluções inovadoras e sustentáveis para a higiene e limpeza, garantindo a satisfação e confiança de nossos clientes.</p><h3>Principais Conquistas</h3><ul><li>Certificação ISO 9001</li><li>Expansão para 10 estados</li><li>Equipe de 2.000 colaboradores</li><li>Investimento em tecnologia verde</li></ul><p>Agradecemos a confiança de todos os nossos clientes, parceiros e colaboradores que tornaram essa jornada possível.</p>"
}
```

### Notícia 2: Eventos

```json
{
  "titulo": "Workshop: Inovação em Limpeza Industrial",
  "resumo": "Evento gratuito aborda as tendências mais recentes em tecnologia de limpeza para ambientes industriais.",
  "categoria": "Eventos",
  "data": "2025-01-20",
  "slug": "workshop-limpeza-industrial",
  "status": "publicado",
  "imagemUrl": "/noticias/2025-01-20-workshop.jpg",
  "conteudo": "<h2>Evento Imperdível!</h2><p>A Serviscon convida você para participar do workshop gratuito sobre inovação em limpeza industrial.</p><h3>Detalhes do Evento</h3><ul><li><strong>Data:</strong> 25 de janeiro de 2025</li><li><strong>Horário:</strong> 14h00 às 17h00</li><li><strong>Local:</strong> São Paulo - SP</li><li><strong>Inscrições:</strong> eventos@serviscon.com.br</li></ul><h3>Programação</h3><ol><li>Tendências em Sustentabilidade</li><li>Casos de Sucesso</li><li>Tecnologias Inovadoras</li><li>Networking</li></ol><p>Vagas limitadas! Inscreva-se agora.</p>"
}
```

### Notícia 3: Treinamento

```json
{
  "titulo": "Programa de Treinamento para Colaboradores",
  "resumo": "Novo programa de capacitação profissional para elevar ainda mais a qualidade dos serviços oferecidos.",
  "categoria": "Treinamentos",
  "data": "2025-01-10",
  "slug": "treinamento-colaboradores-2025",
  "status": "publicado",
  "imagemUrl": "/noticias/2025-01-10-treinamento.jpg",
  "conteudo": "<h2>Desenvolvimento de Talentos</h2><p>A Serviscon anuncia o lançamento de seu novo programa de treinamento e desenvolvimento para colaboradores.</p><h3>Objetivo</h3><p>Elevar a qualidade dos serviços e proporcionar oportunidades de crescimento profissional para toda equipe.</p><h3>Módulos do Programa</h3><ul><li>Segurança no Trabalho</li><li>Técnicas de Limpeza Avançadas</li><li>Atendimento ao Cliente</li><li>Liderança e Comunicação</li><li>Sustentabilidade</li></ul><h3>Benefícios</h3><ul><li>Certificados reconhecidos</li><li>Bônus para participantes</li><li>Oportunidades de promoção</li><li>Desenvolvimento contínuo</li></ul><p>Todas as unidades da Serviscon participarão do programa ao longo de 2025.</p>"
}
```

## Inserir os Dados

### Via SQL Direto (SQLite)

Se estiver usando a linha de comando SQLite:

```sql
INSERT INTO noticias (titulo, resumo, categoria, data, slug, status, conteudo, imagemUrl, createdAt, updatedAt) VALUES
(
  'Serviscon Comemora 10 Anos de Excelência',
  'Uma década de dedicação, inovação e parcerias estratégicas',
  'Institucional',
  '2025-01-15',
  'serviscon-comemora-10-anos',
  'publicado',
  '<h2>Uma História de Sucesso</h2><p>...',
  '/noticias/2025-01-15-serviscon-10-anos.jpg',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
```

## Imagens Dummy

Para testar, você pode usar imagens de placeholder:

- [Unsplash](https://unsplash.com/) - Imagens grátis e de alta qualidade
- [Pixabay](https://pixabay.com/) - Acervo grande de imagens
- [Pexels](https://www.pexels.com/) - Imagens gratuitas

Download de exemplos:
- `2025-01-15-serviscon-10-anos.jpg` - Imagem de escritório/empresa
- `2025-01-20-workshop.jpg` - Imagem de pessoas em workshop
- `2025-01-10-treinamento.jpg` - Imagem de treinamento/palestra

## Schema da Tabela

```typescript
interface Noticia {
  id: number                  // ID único auto-incrementado
  titulo: string              // Título da notícia (obrigatório)
  resumo: string              // Resumo/subtítulo (obrigatório)
  categoria: string           // Categoria (obrigatório)
  data: string                // Data ISO (YYYY-MM-DD) (obrigatório)
  slug: string                // URL amigável (único, obrigatório)
  status: 'rascunho' | 'publicado'  // Status (default: 'rascunho')
  conteudo: string            // Conteúdo em HTML (obrigatório)
  imagemUrl: string | null    // URL da imagem (opcional)
  deletedAt: string | null    // Data de soft-delete (default: null)
  createdAt: string           // Data de criação (auto)
  updatedAt: string           // Data de atualização (auto)
}
```

## Categorias Padrão

- Institucional
- Eventos
- Treinamentos
- Responsabilidade Social
- Tecnologia
- Operações
- Pessoas

Pode adicionar novas categorias editando `src/lib/validators.ts`.

## Testar o Sistema

1. Insira as 3 notícias de exemplo
2. Acesse `http://localhost:3000` e verifique se aparecem na home
3. Clique em uma notícia para ler o artigo completo
4. Acesse `/noticias` para ver a listagem completa
5. Edite e delete notícias no painel admin

## Dicas de Conteúdo

### Boas Práticas para Notícias

1. **Título**: Claro, atrativo e conciso (máx. 80 caracteres)
2. **Resumo**: Descreva o essencial (máx. 150 caracteres)
3. **Data**: Use datas reais ou próximas
4. **Imagem**: Use imagens de alta qualidade (mín. 800x600px)
5. **Conteúdo**: 
   - Use headings (h2, h3) para estruturar
   - Parágrafos curtos
   - Listas quando apropriado
   - Links internos e externos

### Exemplo de Conteúdo Bem Formatado

```html
<h2>Título Principal</h2>

<p>Parágrafo introdutório com contexto importante sobre o assunto.</p>

<h3>Seção 1</h3>

<p>Conteúdo da seção 1 com informações relevantes.</p>

<ul>
  <li>Ponto importante 1</li>
  <li>Ponto importante 2</li>
  <li>Ponto importante 3</li>
</ul>

<h3>Seção 2</h3>

<ol>
  <li>Passo 1</li>
  <li>Passo 2</li>
  <li>Passo 3</li>
</ol>

<p>Parágrafo conclusivo com chamada para ação ou resumo.</p>
```

## Próximos Passos

1. Teste o fluxo completo com dados reais
2. Customize o design conforme necessário
3. Configure domínio e SSL
4. Configure backups automáticos
5. Publique para produção
