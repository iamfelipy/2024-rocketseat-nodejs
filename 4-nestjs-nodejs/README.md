# 🏗️ Forum API — Clean Architecture, DDD, NestJS, Monolito, REST, Typescript & Prisma

## Sumário

1. [Visão Geral](#visao-geral)
2. [Requisitos e Regras de Negócio](#requisitos-e-regras-de-negocio)
   - [Requisitos Funcionais](#requisitos-funcionais)
   - [Regras de Negócio](#regras-de-negocio)
   - [Requisitos Não-Funcionais](#requisitos-nao-funcionais)
3. [Arquitetura](#arquitetura)
   - [Estrutura de Pastas](#estrutura-de-pastas)
   - [Padrões de Design Implementados](#padroes-de-design-implementados)
4. [Stack Tecnológica](#stack-tecnologica)
5. [Qualidade e Testes](#qualidade-e-testes)
X. [Clean Code Aplicado](#clean-code-aplicado)
6. [Princípios SOLID Aplicados](#principios-solid-aplicados)
7. [Domain-Driven Design](#domain-driven-design)
8. [Segurança Implementada](#seguranca-implementada)
9. [Performance e Otimizações](#performance-e-otimizacoes)
10. [Como Executar](#como-executar)
    - [Pré-requisitos](#pre-requisitos)
    - [Setup Rápido](#setup-rapido)
    - [Configuração de Ambiente](#configuracao-de-ambiente)
11. [Rotas Públicas (Não precisam de autenticação)](#rotas-publicas-nao-precisam-de-autenticacao)
12. [Scripts Disponíveis](#scripts-disponiveis)
13. [Deploy](#deploy)
14. [Licença](#licenca)
15. [Competências Demonstradas](#competencias-demonstradas)


## 📋 Visão Geral

A aplicação monolítica expõe uma API REST para um fórum, permitindo cadastro e autenticação de usuários, criação e gestão de perguntas, respostas, comentários e anexos, além de notificações automáticas. 

- **Clean Architecture**: define uma estrutura de camadas separando regras de negócio, interface e infraestrutura, facilitando manutenção, testes e evolução do sistema.
- **Domain-Driven Design**: foca em modelar o domínio do negócio de forma fiel, organizando o código em "bounded contexts" para refletir limites claros entre diferentes áreas do sistema.
- **ORM**: utiliza ORM para abstração e manipulação eficiente do banco de dados, facilitando queries, migrations e integridade dos dados.
- **Tratamento de exceções e error handler funcional**: adota padrão Either para tratamento funcional de erros, centralizando o fluxo de exceções e facilitando o controle de falhas em toda a aplicação.
- **Princípios SOLID** aplicados consistentemente
- **Testes automatizados** com cobertura superior a 95%
- **Segurança** com autenticação JWT RS256
- **Performance** com cache Redis, otimizações de banco (índices), prevenção de underfetching/overfetching

## 📋 Requisitos e Regras de Negócio

### RFs (Requisitos Funcionais)

#### **Gestão de Usuários**
- [x] Deve ser possível criar estudante com nome, email e senha;
- [ ] Deve ser possível criar instrutor com nome, email e senha;
- [x] Deve ser possível se autenticar com email e senha;
- [ ] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível controlar acesso baseado em roles;

#### **Sistema de Fórum - Perguntas**
- [x] Deve ser possível criar perguntas com título e conteúdo;
- [x] Deve ser possível editar perguntas (apenas o autor);
- [x] Deve ser possível excluir perguntas (apenas o autor);
- [x] Deve ser possível buscar pergunta por slug;
- [x] Deve ser possível listar perguntas recentes com paginação;
- [x] Deve ser possível anexar arquivos às perguntas;
- [x] Deve ser possível gerar slug do título;

#### **Sistema de Fórum - Respostas**
- [x] Deve ser possível responder perguntas;
- [x] Deve ser possível editar respostas (apenas o autor);
- [x] Deve ser possível excluir respostas (apenas o autor);
- [x] Deve ser possível listar respostas de uma pergunta;
- [x] Deve ser possível anexar arquivos às respostas;
- [x] Deve ser possível marcar melhor resposta;

#### **Sistema de Fórum - Comentários**
- [x] Deve ser possível comentar em perguntas;
- [x] Deve ser possível comentar em respostas;
- [x] Deve ser possível listar comentários de perguntas;
- [x] Deve ser possível listar comentários de respostas;

#### **Sistema de Anexos**
- [x] Deve ser possível fazer upload de arquivos;
- [x] Deve ser possível validar tipos de arquivo permitidos;
- [x] Deve ser possível limitar tamanho de arquivos;
- [x] Deve ser possível armazenar arquivos em storage externo;

#### **Sistema de Notificações**
- [x] Deve ser possível listar notificações do usuário;
- [x] Deve ser possível marcar notificações como lidas;
- [x] Deve ser possível receber notificações automáticas de eventos relevantes (ex: novas respostas, comentários, melhor resposta);

### RNs (Regras de Negócio)

#### **Validação de Dados**
- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O nome do usuário deve ser obrigatório;
- [x] O email do usuário deve ter formato válido;
- [x] A senha do usuário deve ser obrigatória;
- [x] O título da pergunta deve ser obrigatório;
- [x] O conteúdo da pergunta deve ser obrigatório;
- [x] O conteúdo da resposta deve ser obrigatório;
- [x] O conteúdo do comentário deve ser obrigatório;

#### **Regras de Acesso**
- [x] Apenas usuários autenticados podem criar perguntas;
- [x] Apenas o autor pode editar suas perguntas;
- [x] Apenas o autor pode excluir suas perguntas;
- [x] Apenas usuários autenticados podem responder perguntas;
- [x] Apenas o autor pode editar suas respostas;
- [x] Apenas o autor pode excluir suas respostas;
- [x] Apenas usuários autenticados podem comentar;
- [x] Apenas usuários autenticados podem fazer upload;

#### **Regras de Domínio**
- [x] Deve ser possível disparar eventos de domínio;
- [x] A pergunta deve ter slug gerado automaticamente do título;
- [x] A pergunta deve ter excerpt dos primeiros 120 caracteres;
- [x] A pergunta deve ser marcada como "nova" se criada há menos de 3 dias;
- [x] A resposta deve ter excerpt dos primeiros 120 caracteres;
- [x] O email deve ser único no sistema;

#### **Regras de Paginação**
- [x] Todas as listas devem ter no máximo 20 itens por página;

#### **Regras de Notificações**
- [x] Uma notificação deve ser enviada quando uma resposta é criada;
- [x] Uma notificação deve ser enviada quando um comentário é feito em uma resposta;
- [x] Uma notificação deve ser enviada quando uma resposta é escolhida como a melhor de uma questão;
- [x] A notificação deve ser enviada para o autor da pergunta ou da resposta, conforme o evento;
- [x] A notificação deve conter título e conteúdo relevantes ao evento;

### RNFs (Requisitos Não-Funcionais)

#### **Segurança**
- [x] A senha do usuário precisa estar criptografada;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);
- [x] O JWT deve usar algoritmo RS256 para maior segurança;
- [x] As chaves JWT devem ser assimétricas (privada e pública);
- [x] A validação de dados deve ser feita com schemas Zod;
- [ ] O controle de acesso deve ser granular;
- [ ] O sistema deve implementar RBAC (Role-Based Access Control) para definir permissões de acordo com o papel do usuário;

#### **Persistência**
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] O ORM deve ter type safety (Prisma);
- [x] As migrações devem ser versionadas;
- [x] Os relacionamentos devem ser bem definidos;

#### **Performance**
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [x] As consultas devem ser otimizadas com índices;
- [x] O cache Redis deve ser utilizado para consultas frequentes;

#### **Arquitetura**
- [x] A aplicação deve seguir Clean Architecture;
- [x] Os princípios SOLID devem ser aplicados;
- [x] A separação de responsabilidades deve ser clara;
- [x] A independência de frameworks deve ser mantida;

#### **Qualidade**
- [x] O código deve ser padronizado com ESLint;
- [x] Os testes devem ser automatizados;
- [x] A validação deve ser robusta;
- [x] O tratamento de erros deve ser consistente;

#### **Infraestrutura**
- [x] Os arquivos devem ser armazenados em Cloudflare R2;
- [x] A aplicação deve ser containerizada com Docker;
- [x] As variáveis de ambiente devem ser configuráveis;
- [x] A aplicação deve ser escalável;

#### **Regras de Arquivos**
- [x] O arquivo não deve exceder 2MB de tamanho;
- [x] O arquivo deve ser do tipo PNG, JPG, JPEG ou PDF;
- [x] O tipo MIME do arquivo deve ser validado;
- [x] O ID do anexo deve ser um UUID válido;

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

## Clean Code Aplicado

### Princípios Aplicados
- ✅ **Nomes significativos** para variáveis, funções e classes
- ✅ **Funções pequenas** com responsabilidade única
- ✅ **Comentários úteis** que explicam decisões de negócio
- ✅ **Formatação consistente** com ferramentas automatizadas
- ✅ **Tratamento de erros** funcional e previsível
- ✅ **Estrutura organizada** que facilita navegação
- ✅ **Testes descritivos** que documentam comportamento
- ✅ **Validação robusta** com schemas tipados
- ✅ **Estruturas de dados simples** e coesas
- ✅ **Classes pequenas** com responsabilidade única
- ✅ **Separação de responsabilidades** entre camadas
- ✅ **Refatoração contínua** para melhorar design

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
```### D - Dependency Inversion Principle
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
```### Configuração de Ambiente
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
```## 📚 Documentação da API

### Autenticação
```http
POST /sessions
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```
## 🔓 Rotas Públicas (Não precisam de autenticação)

### Autenticação e Registro
- [x] `POST /sessions` — Login (`AuthenticateController`)
- [x] `POST /accounts` — Criar conta (`CreateAccountController`)

### Leitura de Dados
- [x] `GET /questions` — Listar perguntas recentes (`FetchRecentQuestionsController`)
- [x] `GET /questions/:slug` — Buscar pergunta por slug (`GetQuestionBySlugController`)
- [x] `GET /questions/:id/answers` — Listar respostas (`FetchQuestionAnswersController`)
- [x] `GET /questions/:id/comments` — Listar comentários da pergunta (`FetchQuestionCommentsController`)
- [x] `GET /answers/:id/comments` — Listar comentários da resposta (`FetchAnswerCommentsController`)

---

## 🔒 Rotas Autenticadas (JWT obrigatório)

### Gestão de Perguntas
- [x] `POST /questions` — Criar pergunta (`CreateQuestionController`)
- [x] `PUT /questions/:id` — Editar pergunta (`EditQuestionController`)
- [x] `DELETE /questions/:id` — Excluir pergunta (`DeleteQuestionController`)

### Gestão de Respostas
- [x] `POST /questions/:id/answers` — Responder pergunta (`AnswerQuestionController`)
- [x] `PUT /answers/:id` — Editar resposta (`EditAnswerController`)
- [x] `DELETE /answers/:id` — Excluir resposta (`DeleteAnswerController`)

### Gestão de Comentários
- [x] `POST /questions/:id/comments` — Comentar em pergunta (`CommentOnQuestionController`)
- [x] `POST /answers/:id/comments` — Comentar em resposta (`CommentOnAnswerController`)
- [x] `DELETE /questions/:id/comments/:commentId` — Excluir comentário de pergunta (`DeleteQuestionCommentController`)
- [x] `DELETE /answers/:id/comments/:commentId` — Excluir comentário de resposta (`DeleteAnswerCommentController`)

### Ações Especiais
- [x] `PATCH /answers/:id/choose-as-best` — Marcar melhor resposta (`ChooseQuestionBestAnswerController`)
- [x] `POST /attachments` — Upload de arquivo (`UploadAttachmentController`)
- [x] `PATCH /notifications/:id/read` — Marcar notificação como lida (`ReadNotificationController`)

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
```## 🚀 Deploy

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

















