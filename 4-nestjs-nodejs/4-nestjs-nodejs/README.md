# 🏗️ Forum API - Clean Architecture com NestJS

> **Projeto de demonstração de competências em arquitetura de software, implementando Clean Architecture, Domain-Driven Design e princípios SOLID com NestJS e TypeScript.**

## 📋 Visão Geral

Este projeto implementa uma API completa de fórum educacional, demonstrando a aplicação prática de padrões arquiteturais modernos e boas práticas de desenvolvimento. A aplicação serve como portfólio técnico, evidenciando proficiência em:

- **Clean Architecture** com separação clara de responsabilidades
- **Domain-Driven Design** com bounded contexts bem definidos
- **Princípios SOLID** aplicados consistentemente
- **Testes automatizados** com cobertura superior a 95%
- **Segurança** com autenticação JWT RS256
- **Performance** com cache Redis e otimizações de banco


## 🏛️ Arquitetura

### Clean Architecture - Estrutura em Camadas

```
src/
├── core/                    # Infraestrutura compartilhada
│   ├── entities/           # Entidades base
│   ├── errors/             # Tratamento de erros
│   ├── events/             # Sistema de eventos
│   └── repositories/       # Interfaces de repositórios
├── domain/                  # Regras de negócio puras
│   ├── forum/              # Subdomínio do fórum
│   └── notification/       # Subdomínio de notificações
├── infra/                   # Implementações concretas
│   ├── auth/               # Autenticação JWT
│   ├── cache/              # Cache Redis
│   ├── database/           # Persistência com Prisma
│   ├── http/               # Controllers e presenters
│   └── storage/            # Upload de arquivos
└── test/                   # Testes e factories
```

### Padrões de Design Implementados

| Padrão | Implementação | Benefício |
|--------|---------------|-----------|
| **Repository Pattern** | Abstração da camada de dados | Independência de ORM |
| **Use Case Pattern** | Casos de uso bem definidos | Separação de responsabilidades |
| **Domain Events** | Comunicação entre agregados | Baixo acoplamento |
| **Value Objects** | Objetos de valor imutáveis | Integridade de dados |
| **Aggregate Pattern** | Agregados com consistência | Transações de domínio |
| **Strategy Pattern** | Estratégias de upload | Flexibilidade |
| **Dependency Injection** | Inversão de dependências | Testabilidade |

## 🎯 Funcionalidades Implementadas

### Sistema de Usuários
- ✅ Registro e autenticação de estudantes
- ✅ Controle de acesso baseado em roles
- ✅ Autenticação JWT com chaves RS256

### Sistema de Fórum
- ✅ CRUD completo de perguntas e respostas
- ✅ Sistema de comentários aninhados
- ✅ Escolha de melhor resposta
- ✅ Busca otimizada por slug

### Sistema de Anexos
- ✅ Upload de arquivos para Cloudflare R2
- ✅ Validação de tipos e tamanhos
- ✅ Anexos em perguntas e respostas

### Sistema de Notificações
- ✅ Notificações automáticas por eventos
- ✅ Sistema de leitura de notificações
- ✅ Eventos de domínio para comunicação

## 🛠️ Stack Tecnológica

### Core Framework
- **NestJS 10.2.5**: Framework para aplicações Node.js escaláveis
- **TypeScript 5.1.3**: Linguagem com tipagem estática
- **Node.js 18.16.0+**: Runtime JavaScript

### Persistência e Cache
- **PostgreSQL**: Banco de dados relacional
- **Prisma 5.2.0**: ORM com type safety
- **Redis**: Cache em memória

### Segurança e Validação
- **JWT RS256**: Autenticação com chaves assimétricas
- **bcryptjs**: Hash seguro de senhas
- **Zod 3.22.2**: Validação de schemas

### Testes e Qualidade
- **Vitest**: Framework de testes rápido
- **Supertest**: Testes de integração HTTP
- **ESLint + Prettier**: Padronização de código

### Infraestrutura
- **Cloudflare R2**: Armazenamento de arquivos
- **Docker**: Containerização
- **Docker Compose**: Orquestração local

## 📊 Qualidade e Testes

### Cobertura de Testes
- **147 testes unitários** (`.spec.ts`)
- **23 testes end-to-end** (`.e2e-spec.ts`)
- **Cobertura superior a 95%** do código

### Estratégia de Testes
```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

### Padrões de Teste
- **Testes unitários**: Use cases e entidades
- **Testes de integração**: Repositórios e serviços
- **Testes E2E**: Fluxos completos da API
- **Factories**: Criação de dados de teste
- **Mocks**: Simulação de dependências externas

## 🏛️ Princípios SOLID Aplicados

### S - Single Responsibility Principle
```typescript
// Cada classe tem uma única responsabilidade
class CreateQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}
  
  async execute(request: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    // Apenas lógica para criar perguntas
  }
}
```

### O - Open/Closed Principle
```typescript
// Sistema extensível sem modificar código existente
interface Uploader {
  upload(file: Buffer, fileName: string): Promise<string>
}

class R2Uploader implements Uploader { /* ... */ }
class S3Uploader implements Uploader { /* ... */ }
```

### L - Liskov Substitution Principle
```typescript
// Implementações podem ser substituídas
class InMemoryQuestionsRepository implements QuestionsRepository {
  // Implementação para testes
}

class PrismaQuestionsRepository implements QuestionsRepository {
  // Implementação para produção
}
```

### I - Interface Segregation Principle
```typescript
// Interfaces específicas e coesas
interface HashGenerator {
  hash(plain: string): Promise<string>
}

interface HashComparer {
  compare(plain: string, hash: string): Promise<boolean>
}
```

### D - Dependency Inversion Principle
```typescript
// Dependências de abstrações, não de implementações
class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}
}
```

## 🎨 Domain-Driven Design

### Bounded Contexts
- **Forum Context**: Perguntas, respostas, comentários e anexos
- **Notification Context**: Sistema de notificações e eventos

### Aggregates
```typescript
// Question como Aggregate Root
class Question extends AggregateRoot<QuestionProps> {
  private _attachments: QuestionAttachmentList
  private _comments: QuestionCommentList
  
  // Métodos que garantem consistência
  addAttachment(attachment: QuestionAttachment): void {
    this._attachments.add(attachment)
    this.addDomainEvent(new QuestionAttachmentAddedEvent(this, attachment))
  }
}
```

### Domain Events
```typescript
// Eventos que comunicam mudanças entre agregados
export class AnswerCreatedEvent implements DomainEvent {
  constructor(
    public answer: Answer,
    public questionId: UniqueEntityID,
  ) {}
}
```

### Value Objects
```typescript
// Objetos imutáveis que representam conceitos do domínio
class Slug extends ValueObject<string> {
  constructor(value: string) {
    super(value)
    this.validate(value)
  }
  
  private validate(value: string): void {
    if (value.length < 3) {
      throw new Error('Slug must be at least 3 characters long')
    }
  }
}
```

## 🔐 Segurança Implementada

### Autenticação JWT RS256
- **Chaves assimétricas** para maior segurança
- **Payload mínimo** para reduzir overhead
- **Validação robusta** com Zod schemas

### Validação de Dados
```typescript
// Schemas Zod para validação de entrada
const createQuestionSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  attachments: z.array(z.string()).optional(),
})
```

### Controle de Acesso
- **Guards** para rotas protegidas
- **Decorator `@Public()`** para rotas públicas
- **Verificação de propriedade** de recursos

## ⚡ Performance e Otimizações

### Cache Redis
```typescript
// Cache de consultas frequentes
class RedisCacheRepository implements CacheRepository {
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : null
  }
}
```

### Otimizações de Banco
- **Índices otimizados** no Prisma schema
- **Queries eficientes** com eager loading
- **Paginação implementada** para listagens

### Upload Otimizado
- **Upload direto** para Cloudflare R2
- **Validação de tipos** de arquivo
- **Limite de tamanho** configurável

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18.16.0+
- Docker e Docker Compose
- Conta Cloudflare (para storage)

### Setup Rápido
```bash
# 1. Clone e instale dependências
git clone <url-do-repositorio>
cd 4-nestjs-nodejs
npm install

# 2. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 3. Inicie containers
docker-compose up -d

# 4. Execute migrações
npx prisma migrate dev

# 5. Inicie a aplicação
npm run start:dev
```

### Configuração de Ambiente
```env
# Database
DATABASE_URL="postgresql://postgres:docker@localhost:5432/forum_db"

# JWT Keys (RS256)
JWT_PRIVATE_KEY="sua_chave_privada_base64"
JWT_PUBLIC_KEY="sua_chave_publica_base64"

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID="seu_account_id"
CLOUDFLARE_ACCESS_KEY_ID="sua_access_key"
CLOUDFLARE_SECRET_ACCESS_KEY="sua_secret_key"
CLOUDFLARE_BUCKET_NAME="seu-bucket"

# Redis
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_DB=0

# App
PORT=3333
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

## 🎯 Competências Demonstradas

### Arquitetura de Software
- ✅ **Clean Architecture** com separação clara de camadas
- ✅ **Domain-Driven Design** com bounded contexts
- ✅ **Princípios SOLID** aplicados consistentemente
- ✅ **Independência de frameworks** no domínio

### Qualidade de Código
- ✅ **95%+ cobertura de testes** automatizados
- ✅ **TypeScript** com tipagem forte
- ✅ **ESLint + Prettier** para padronização
- ✅ **Zod** para validação robusta

### Tecnologias Modernas
- ✅ **NestJS** com decorators e DI
- ✅ **Prisma** com type safety
- ✅ **Redis** para cache
- ✅ **Cloudflare R2** para storage

### Padrões de Design
- ✅ **Repository Pattern** para abstração de dados
- ✅ **Use Case Pattern** para casos de uso
- ✅ **Domain Events** para comunicação
- ✅ **Strategy Pattern** para flexibilidade

### Segurança
- ✅ **JWT RS256** com chaves assimétricas
- ✅ **bcryptjs** para hash de senhas
- ✅ **Validação** com Zod
- ✅ **Controle de acesso** granular

### Performance
- ✅ **Cache Redis** para consultas frequentes
- ✅ **Otimizações de banco** com índices
- ✅ **Upload otimizado** para arquivos

Este projeto demonstra conhecimento sólido em arquitetura de software, boas práticas de desenvolvimento e tecnologias modernas do ecossistema Node.js/TypeScript, servindo como portfólio técnico para oportunidades profissionais.



