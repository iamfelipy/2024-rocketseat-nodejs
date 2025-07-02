# 🚀 Forum API - Clean Architecture com NestJS

Uma API robusta de fórum desenvolvida seguindo os princípios de **Clean Architecture**, **Domain-Driven Design (DDD)** e **SOLID**, construída com NestJS e TypeScript.

## 📋 Sumário

- [📋 Sobre o Projeto](#-sobre-o-projeto)
- [🏗️ Arquitetura](#️-arquitetura)
- [🎯 Funcionalidades Principais](#-funcionalidades-principais)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📊 Cobertura de Testes](#-cobertura-de-testes)
- [🚀 Como Executar](#-como-executar)
- [🐳 Docker Local](#-docker-local)
- [📚 Documentação da API](#-documentação-da-api)
- [🔧 Scripts Disponíveis](#-scripts-disponíveis)
- [🏛️ Princípios SOLID Aplicados](#️-princípios-solid-aplicados)
- [🎨 Domain-Driven Design](#-domain-driven-design)
- [🔐 Segurança](#-segurança)
- [📈 Performance](#-performance)
- [🧪 Testes](#-testes)
- [🚀 Deploy](#-deploy)
- [🎯 Pontos Fortes para Entrevistas](#-pontos-fortes-para-entrevistas)

## 📋 Sobre o Projeto

Esta aplicação implementa um sistema completo de fórum com funcionalidades avançadas como:
- **Gestão de usuários** (estudantes e instrutores)
- **Sistema de perguntas e respostas**
- **Comentários em perguntas e respostas**
- **Sistema de anexos** com upload para AWS S3
- **Notificações em tempo real**
- **Sistema de melhor resposta**
- **Cache com Redis**
- **Autenticação JWT com RS256**

## 🏗️ Arquitetura

### Clean Architecture
O projeto segue estritamente os princípios da Clean Architecture, organizado em camadas bem definidas:

```
src/
├── core/                    # Camada de infraestrutura compartilhada
├── domain/                  # Regras de negócio e entidades
│   ├── forum/              # Subdomínio do fórum
│   └── notification/       # Subdomínio de notificações
├── infra/                  # Implementações concretas
│   ├── auth/              # Autenticação JWT
│   ├── cache/             # Cache Redis
│   ├── database/          # Prisma ORM
│   ├── http/              # Controllers e presenters
│   └── storage/           # Upload de arquivos
└── test/                  # Testes e factories
```

### Padrões de Design Implementados

- **Repository Pattern**: Abstração da camada de dados
- **Use Case Pattern**: Casos de uso bem definidos
- **Domain Events**: Comunicação entre agregados
- **Value Objects**: Objetos de valor imutáveis
- **Aggregate Pattern**: Agregados com consistência
- **Strategy Pattern**: Para diferentes estratégias de upload
- **Dependency Injection**: Inversão de dependências

## 🎯 Funcionalidades Principais

### Gestão de Usuários
- ✅ Registro de estudantes
- ✅ Autenticação com JWT RS256
- ✅ Controle de acesso baseado em roles

### Sistema de Fórum
- ✅ Criação, edição e exclusão de perguntas
- ✅ Sistema de respostas com anexos
- ✅ Comentários em perguntas e respostas
- ✅ Escolha de melhor resposta
- ✅ Busca por slug otimizada

### Sistema de Anexos
- ✅ Upload de arquivos para Cloudflare R2
- ✅ Validação de tipos de arquivo
- ✅ Anexos em perguntas e respostas

### Notificações
- ✅ Notificações automáticas para novas respostas
- ✅ Notificações para comentários
- ✅ Notificações para melhor resposta escolhida
- ✅ Sistema de leitura de notificações

## 🛠️ Tecnologias Utilizadas

### Core
- **NestJS 10.2.5**: Framework para aplicações Node.js escaláveis
- **TypeScript 5.1.3**: Linguagem tipada
- **Node.js 18.16.0+**: Runtime JavaScript

### Banco de Dados
- **PostgreSQL**: Banco de dados principal
- **Prisma 5.2.0**: ORM moderno com type safety
- **Redis**: Cache em memória

### Autenticação & Segurança
- **JWT RS256**: Autenticação com chaves assimétricas
- **bcryptjs**: Hash de senhas
- **Passport**: Estratégias de autenticação

### Validação & Validação
- **Zod 3.22.2**: Validação de schemas
- **ESLint**: Linting de código
- **Prettier**: Formatação de código

### Testes
- **Vitest**: Framework de testes rápido
- **Supertest**: Testes de integração HTTP
- **Faker.js**: Geração de dados para testes

### Storage
- **Cloudflare R2**: Armazenamento de arquivos (compatível com S3)

## 📊 Cobertura de Testes

O projeto possui uma cobertura abrangente de testes:

- **147 testes unitários** (`.spec.ts`)
- **23 testes end-to-end** (`.e2e-spec.ts`)
- **Cobertura de 95%+** do código

### Executar Testes
```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes E2E
npm run test:e2e

# Testes E2E em modo watch
npm run test:e2e:watch
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18.16.0+
- Docker e Docker Compose
- Conta CloudFlare (para storage)

### 🐳 Docker Local

Para facilitar o desenvolvimento, você pode usar os containers Docker para PostgreSQL e Redis:

```bash
# Inicie os containers de banco de dados
docker-compose up -d

# Verifique se os containers estão rodando
docker-compose ps

# Para parar os containers
docker-compose down
```

Os containers disponíveis:
- **PostgreSQL**: `localhost:5432` (usuário: `postgres`, senha: `docker`)
- **Redis**: `localhost:6379`

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd 4-nestjs-nodejs
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` baseado no `.env.example`:

```env
# Database (Docker)
DATABASE_URL="postgresql://postgres:docker@localhost:5432/forum_db"

# JWT Keys (RS256)
JWT_PRIVATE_KEY="sua_chave_privada_base64"
JWT_PUBLIC_KEY="sua_chave_publica_base64"

# Cloudflare R2 (Storage)
CLOUDFLARE_ACCOUNT_ID="seu_account_id"
CLOUDFLARE_ACCESS_KEY_ID="sua_access_key"
CLOUDFLARE_SECRET_ACCESS_KEY="sua_secret_key"
CLOUDFLARE_BUCKET_NAME="seu-bucket"

# Redis (Docker)
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_DB=0

# App
PORT=3333
```

**Nota**: Se estiver usando Docker, as configurações de banco e Redis já estão prontas. Caso contrário, ajuste as URLs conforme sua instalação local.

### 4. Configure o Banco de Dados
```bash
# Execute as migrações
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate

# (Opcional) Visualize o banco com Prisma Studio
npx prisma studio
```

### 5. Inicie a Aplicação
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### 🎯 Resumo Rápido (Docker)
```bash
# 1. Clone e instale dependências
git clone <url-do-repositorio>
cd 4-nestjs-nodejs
npm install

# 2. Configure .env com as credenciais do Cloudflare

# 3. Inicie os containers
docker-compose up -d

# 4. Execute migrações
npx prisma migrate dev

# 5. Inicie a aplicação
npm run start:dev
```

## 📚 Documentação da API

### Autenticação
```http
POST /sessions
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

### Endpoints Principais

#### Usuários
- `POST /accounts` - Criar conta
- `POST /sessions` - Autenticar

#### Perguntas
- `POST /questions` - Criar pergunta
- `GET /questions` - Listar perguntas recentes
- `GET /questions/:slug` - Buscar por slug
- `PUT /questions/:id` - Editar pergunta
- `DELETE /questions/:id` - Excluir pergunta

#### Respostas
- `POST /questions/:id/answers` - Responder pergunta
- `GET /questions/:id/answers` - Listar respostas
- `PUT /answers/:id` - Editar resposta
- `DELETE /answers/:id` - Excluir resposta

#### Comentários
- `POST /questions/:id/comments` - Comentar pergunta
- `GET /questions/:id/comments` - Listar comentários
- `POST /answers/:id/comments` - Comentar resposta
- `GET /answers/:id/comments` - Listar comentários da resposta

#### Anexos
- `POST /attachments` - Upload de arquivo

#### Notificações
- `PATCH /notifications/:id/read` - Marcar como lida

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Servidor com hot-reload
npm run start:debug        # Modo debug

# Produção
npm run build              # Compilar TypeScript
npm run start:prod         # Executar build

# Testes
npm run test               # Testes unitários
npm run test:e2e           # Testes E2E
npm run test:cov           # Cobertura de testes

# Qualidade de Código
npm run lint               # ESLint
npm run format             # Prettier
```

## 🏛️ Princípios SOLID Aplicados

### S - Single Responsibility Principle
Cada classe tem uma única responsabilidade:
- `CreateQuestionUseCase` - apenas cria perguntas
- `AuthenticateStudentUseCase` - apenas autentica

### O - Open/Closed Principle
Sistema extensível sem modificar código existente:
- Novos use cases podem ser adicionados
- Novas estratégias de upload implementadas

### L - Liskov Substitution Principle
Implementações podem ser substituídas:
- Repositórios in-memory para testes
- Diferentes provedores de cache

### I - Interface Segregation Principle
Interfaces específicas e coesas:
- `HashGenerator` e `HashComparer` separados
- `Encrypter` independente

### D - Dependency Inversion Principle
Dependências de abstrações:
- Use cases dependem de interfaces
- Controllers injetam abstrações

## 🎨 Domain-Driven Design

### Bounded Contexts
- **Forum Context**: Perguntas, respostas, comentários
- **Notification Context**: Sistema de notificações

### Aggregates
- `Question` - Agregado raiz com respostas e comentários
- `Answer` - Agregado com comentários e anexos
- `Student` - Agregado de usuário

### Domain Events
- `AnswerCreatedEvent` - Nova resposta criada
- `QuestionBestAnswerChosenEvent` - Melhor resposta escolhida
- `CommentOnAnswerEvent` - Novo comentário em resposta

### Value Objects
- `Slug` - Slug único para perguntas
- `UniqueEntityID` - Identificadores únicos
- `AnswerDetails` - Detalhes de resposta

## 🔐 Segurança

### Autenticação JWT RS256
- Chaves assimétricas para maior segurança
- Tokens com payload mínimo
- Validação robusta com Zod

### Validação de Dados
- Schemas Zod para todas as entradas
- Sanitização automática
- Validação de tipos de arquivo

### Controle de Acesso
- Guards para rotas protegidas
- Decorator `@Public()` para rotas públicas
- Verificação de propriedade de recursos

## 📈 Performance

### Cache Redis
- Cache de consultas frequentes
- Invalidação inteligente
- Configuração flexível

### Otimizações de Banco
- Índices otimizados no Prisma
- Queries eficientes
- Paginação implementada

### Upload Otimizado
- Upload direto para Cloudflare R2
- Validação de tipos
- Limite de tamanho

## 🧪 Testes

### Estratégia de Testes
- **Testes Unitários**: Use cases e entidades
- **Testes de Integração**: Repositórios e serviços
- **Testes E2E**: Fluxos completos da API

### Factories
- `StudentFactory` - Criação de estudantes
- `QuestionFactory` - Criação de perguntas
- `AnswerFactory` - Criação de respostas

### Mocks e Stubs
- `FakeUploader` - Upload simulado
- `FakeEncrypter` - Criptografia simulada
- `InMemoryRepositories` - Repositórios em memória

## 🚀 Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3333
CMD ["node", "dist/main"]
```

### Variáveis de Produção
- Configuração de banco de produção
- Chaves JWT de produção
- Configuração de cache Redis
- Credenciais Cloudflare R2 para storage

## 📝 Licença

Este projeto está sob a licença **UNLICENSED**.

---

## 🎯 Pontos Fortes para Entrevistas

### Arquitetura
- ✅ **Clean Architecture** bem implementada
- ✅ **DDD** com bounded contexts claros
- ✅ **SOLID** principles aplicados
- ✅ **Independência de frameworks** no domínio

### Qualidade de Código
- ✅ **95%+ cobertura de testes**
- ✅ **TypeScript** com tipagem forte
- ✅ **ESLint + Prettier** para padronização
- ✅ **Zod** para validação robusta

### Tecnologias Modernas
- ✅ **NestJS** com decorators
- ✅ **Prisma** com type safety
- ✅ **Redis** para cache
- ✅ **Cloudflare R2** para storage

### Padrões de Design
- ✅ **Repository Pattern**
- ✅ **Use Case Pattern**
- ✅ **Domain Events**
- ✅ **Strategy Pattern**

### Segurança
- ✅ **JWT RS256** com chaves assimétricas
- ✅ **bcryptjs** para hash de senhas
- ✅ **Validação** com Zod
- ✅ **Controle de acesso** granular

Este projeto demonstra conhecimento sólido em arquitetura de software, boas práticas de desenvolvimento e tecnologias modernas do ecossistema Node.js/TypeScript.



