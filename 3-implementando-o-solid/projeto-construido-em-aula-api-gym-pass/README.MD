# GymPass API - Clean Architecture com Fastify

> **Projeto de demonstração de competências em arquitetura de software, implementando Clean Architecture, princípios SOLID e boas práticas com Fastify e TypeScript.**

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
6. [Princípios SOLID Aplicados](#principios-solid-aplicados)
7. [Segurança Implementada](#seguranca-implementada)
8. [Performance e Otimizações](#performance-e-otimizacoes)
9. [Como Executar](#como-executar)
   - [Pré-requisitos](#pre-requisitos)
   - [Setup Rápido](#setup-rapido)
   - [Configuração de Ambiente](#configuracao-de-ambiente)
10. [Documentação da API](#documentacao-da-api)
11. [Scripts Disponíveis](#scripts-disponiveis)
12. [Deploy](#deploy)
13. [Licença](#licenca)
14. [Competências Demonstradas](#competencias-demonstradas)

## Visão Geral

Este projeto implementa uma API completa de sistema de check-in para academias (estilo GymPass), demonstrando a aplicação prática de padrões arquiteturais modernos e boas práticas de desenvolvimento. A aplicação serve como portfólio técnico, evidenciando proficiência em:

- **Clean Architecture** com separação clara de responsabilidades
- **Princípios SOLID** aplicados consistentemente
- **Testes automatizados** com cobertura abrangente
- **Segurança** com autenticação JWT
- **Geolocalização** para validação de proximidade
- **Sistema de roles** para controle de acesso

## Requisitos e Regras de Negócio

### RFs (Requisitos Funcionais)

#### **Gestão de Usuários**
- [x] Deve ser possível se cadastrar com nome, email e senha;
- [x] Deve ser possível se autenticar com email e senha;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível validar credenciais de forma segura;
- [x] Deve ser possível controlar acesso baseado em roles (ADMIN/MEMBER);

#### **Sistema de Academias**
- [x] Deve ser possível cadastrar academias com nome, descrição e localização;
- [x] Deve ser possível buscar academias por nome;
- [x] Deve ser possível buscar academias próximas (até 10km);
- [x] Deve ser possível listar academias com paginação;
- [x] Deve ser possível obter detalhes de uma academia específica;

#### **Sistema de Check-in**
- [x] Deve ser possível realizar check-in em uma academia;
- [x] Deve ser possível validar check-in de um usuário;
- [x] Deve ser possível obter histórico de check-ins do usuário;
- [x] Deve ser possível obter número total de check-ins do usuário;
- [x] Deve ser possível listar check-ins com paginação;
- [x] Deve ser possível verificar proximidade para check-in;

#### **Sistema de Geolocalização**
- [x] Deve ser possível calcular distância entre coordenadas;
- [x] Deve ser possível validar proximidade para check-in (100m);
- [x] Deve ser possível buscar academias por raio de distância;
- [x] Deve ser possível armazenar coordenadas de academias;

#### **Sistema de Controle de Acesso**
- [x] Deve ser possível diferenciar usuários ADMIN e MEMBER;
- [x] Deve ser possível restringir ações apenas para ADMIN;
- [x] Deve ser possível validar permissões por role;
- [x] Deve ser possível proteger rotas por autenticação;

### RNs (Regras de Negócio)

#### **Validação de Dados**
- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O nome do usuário deve ser obrigatório;
- [x] O email do usuário deve ter formato válido;
- [x] A senha do usuário deve ser obrigatória;
- [x] O nome da academia deve ser obrigatório;
- [x] As coordenadas da academia devem ser obrigatórias;
- [x] A latitude deve estar entre -90 e 90;
- [x] A longitude deve estar entre -180 e 180;
- [x] A página para paginação deve ser no mínimo 1;

#### **Regras de Check-in**
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após criado;
- [x] O check-in só pode ser validado por administradores;
- [x] O check-in deve ser associado a um usuário e uma academia;
- [x] O check-in deve registrar data e hora de criação;
- [x] O check-in validado deve registrar data e hora de validação;

#### **Regras de Acesso**
- [x] Apenas usuários autenticados podem realizar check-in;
- [x] Apenas usuários autenticados podem buscar academias;
- [x] Apenas usuários autenticados podem ver seu perfil;
- [x] Apenas administradores podem cadastrar academias;
- [x] Apenas administradores podem validar check-ins;
- [x] Apenas administradores podem acessar rotas administrativas;

#### **Regras de Geolocalização**
- [x] A distância máxima para check-in deve ser 100 metros;
- [x] A distância máxima para busca de academias deve ser 10km;
- [x] O cálculo de distância deve usar fórmula de Haversine;
- [x] As coordenadas devem ser armazenadas como Decimal;
- [x] A validação de proximidade deve ser obrigatória;

#### **Regras de Paginação**
- [x] Todas as listas devem ter no máximo 20 itens por página;
- [x] A página mínima deve ser 1;
- [x] O cálculo de skip deve ser (página - 1) * 20;
- [x] As consultas devem ser ordenadas por data de criação (mais recentes primeiro);

#### **Regras de Domínio**
- [x] O usuário deve ter role MEMBER por padrão;
- [x] O check-in deve ter status de validação (validado/não validado);
- [x] A academia deve ter informações de contato opcionais;
- [x] O histórico de check-ins deve ser ordenado por data;

### RNFs (Requisitos Não-Funcionais)

#### **Segurança**
- [x] A senha do usuário precisa estar criptografada;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);
- [x] O JWT deve ter tempo de expiração configurável;
- [x] A validação de dados deve ser feita com schemas Zod;
- [x] O controle de acesso deve ser granular por role;
- [x] As rotas devem ser protegidas por middleware de autenticação;

#### **Persistência**
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] O ORM deve ter type safety (Prisma);
- [x] As migrações devem ser versionadas;
- [x] Os relacionamentos devem ser bem definidos;
- [x] Os índices devem ser otimizados para consultas de geolocalização;

#### **Performance**
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [x] As consultas de geolocalização devem ser otimizadas;
- [x] O cálculo de distância deve ser eficiente;
- [x] As consultas devem usar índices apropriados;

#### **Arquitetura**
- [x] A aplicação deve seguir Clean Architecture;
- [x] Os princípios SOLID devem ser aplicados;
- [x] A separação de responsabilidades deve ser clara;
- [x] A independência de frameworks deve ser mantida;
- [x] Os testes devem ter cobertura abrangente;

#### **Qualidade**
- [x] O código deve ser padronizado com ESLint;
- [x] Os testes devem ser automatizados;
- [x] A validação deve ser robusta;
- [x] O tratamento de erros deve ser consistente;
- [x] Os testes E2E devem cobrir fluxos principais;

#### **Infraestrutura**
- [x] A aplicação deve ser containerizada com Docker;
- [x] As variáveis de ambiente devem ser configuráveis;
- [x] A aplicação deve ser escalável;
- [x] O build deve ser otimizado com tsup;
- [x] O desenvolvimento deve ter hot-reload;

## Arquitetura

### Estrutura de Pastas

#### Clean Architecture - Estrutura em Camadas

```
src/
├── use-cases/              # Casos de uso da aplicação
│   ├── register.ts         # Registro de usuário
│   ├── authenticate.ts     # Autenticação
│   ├── check-in.ts         # Realizar check-in
│   ├── validate-check-in.ts # Validar check-in
│   ├── search-gyms.ts      # Buscar academias
│   └── factories/          # Factories para injeção
├── repositories/           # Abstração da camada de dados
│   ├── users-repository.ts # Interface de usuários
│   ├── check-ins-repository.ts # Interface de check-ins
│   ├── gyms-repository.ts  # Interface de academias
│   └── prisma/            # Implementações Prisma
├── http/                  # Camada de apresentação
│   ├── controllers/       # Controllers Fastify
│   ├── middlewares/       # Middlewares de autenticação
│   └── routes/           # Definição de rotas
├── lib/                  # Utilitários e configurações
├── env/                  # Configuração de ambiente
└── @types/              # Tipos TypeScript
```

### Padrões de Design Implementados

| Padrão | Implementação | Benefício |
|--------|---------------|-----------|
| **Repository Pattern** | Abstração da camada de dados | Independência de ORM |
| **Use Case Pattern** | Casos de uso bem definidos | Separação de responsabilidades |
| **Factory Pattern** | Factories para injeção | Baixo acoplamento |
| **Strategy Pattern** | Estratégias de validação | Flexibilidade |
| **Dependency Injection** | Inversão de dependências | Testabilidade |

## Stack Tecnológica

### Core Framework
- **Fastify 4.26.2**: Framework web rápido e eficiente
- **TypeScript 5.4.4**: Linguagem com tipagem estática
- **Node.js 20.12.5+**: Runtime JavaScript

### Persistência
- **PostgreSQL**: Banco de dados relacional
- **Prisma 5.12.1**: ORM com type safety

### Segurança e Validação
- **JWT**: Autenticação com tokens
- **bcryptjs 2.4.3**: Hash seguro de senhas
- **Zod 3.22.4**: Validação de schemas

### Testes e Qualidade
- **Vitest 1.5.0**: Framework de testes rápido
- **Supertest 7.0.0**: Testes de integração HTTP
- **ESLint**: Padronização de código

### Build e Deploy
- **tsup 8.0.2**: Build tool otimizado
- **tsx 4.7.2**: TypeScript executor
- **Docker**: Containerização

## Qualidade e Testes

### Estratégia de Testes
```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:coverage

# Interface de testes
npm run test:ui
```

### Padrões de Teste
- **Testes unitários**: Use cases e lógica de negócio
- **Testes de integração**: Repositórios e serviços
- **Testes E2E**: Fluxos completos da API
- **Factories**: Criação de dados de teste
- **Mocks**: Simulação de dependências externas

## Princípios SOLID Aplicados

### S - Single Responsibility Principle
```typescript
// Cada classe tem uma única responsabilidade
class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}
  
  async execute(request: CheckInRequest): Promise<CheckInResponse> {
    // Apenas lógica para realizar check-in
  }
}
```

### O - Open/Closed Principle
```typescript
// Sistema extensível sem modificar código existente
interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<void>
}

class PrismaUsersRepository implements UsersRepository { /* ... */ }
class InMemoryUsersRepository implements UsersRepository { /* ... */ }
```

### L - Liskov Substitution Principle
```typescript
// Implementações podem ser substituídas
class PrismaCheckInsRepository implements CheckInsRepository {
  // Implementação para produção
}

class InMemoryCheckInsRepository implements CheckInsRepository {
  // Implementação para testes
}
```

### I - Interface Segregation Principle
```typescript
// Interfaces específicas e coesas
interface HashComparer {
  compare(plain: string, hash: string): Promise<boolean>
}

interface HashGenerator {
  hash(plain: string): Promise<string>
}
```

### D - Dependency Inversion Principle
```typescript
// Dependências de abstrações, não de implementações
class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
  ) {}
}
```

## Segurança Implementada

### Autenticação JWT
- **Tokens seguros** com secret configurável
- **Payload mínimo** para reduzir overhead
- **Validação robusta** com middleware

### Validação de Dados
```typescript
// Schemas Zod para validação de entrada
const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})
```

### Controle de Acesso
- **Middleware** para rotas protegidas
- **Verificação de roles** (ADMIN/MEMBER)
- **Validação de propriedade** de recursos

## Performance e Otimizações

### Otimizações de Banco
- **Índices otimizados** no Prisma schema
- **Queries eficientes** com eager loading
- **Paginação implementada** para listagens

### Geolocalização
- **Cálculo de distância** otimizado
- **Busca por proximidade** eficiente
- **Validação de coordenadas** robusta

## Como Executar

### Pré-requisitos
- Node.js 20.12.5+
- Docker e Docker Compose
- PostgreSQL

### Setup Rápido
```bash
# 1. Clone e instale dependências
git clone <url-do-repositorio>
cd projeto-construido-em-aula-api-gym-pass
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
DATABASE_URL="postgresql://postgres:docker@localhost:5432/gympass_db"

# JWT
JWT_SECRET="your_super_secret_key"

# App
PORT=3333
```

## Documentação da API

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
- `POST /users` - Criar conta
- `POST /sessions` - Autenticar
- `GET /me` - Obter perfil

#### Academias
- `POST /gyms` - Criar academia (ADMIN)
- `GET /gyms/search` - Buscar academias
- `GET /gyms/nearby` - Academias próximas

#### Check-ins
- `POST /check-ins` - Realizar check-in
- `PATCH /check-ins/:id/validate` - Validar check-in (ADMIN)
- `GET /check-ins/history` - Histórico de check-ins
- `GET /check-ins/metrics` - Métricas de check-ins

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Servidor com hot-reload
npm run start              # Executar build

# Build
npm run build              # Compilar TypeScript

# Testes
npm run test               # Testes unitários
npm run test:e2e           # Testes E2E
npm run test:coverage      # Cobertura de testes
npm run test:ui            # Interface de testes

# Qualidade de Código
npm run lint               # ESLint
```

## Deploy

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY build ./build
EXPOSE 3333
CMD ["node", "build/server.js"]
```

### Variáveis de Produção
- Configuração de banco de produção
- JWT secret de produção
- Configuração de ambiente

## Licença

Este projeto está sob a licença **ISC**.

---

## Competências Demonstradas

### Arquitetura de Software
- ✅ **Clean Architecture** com separação clara de camadas
- ✅ **Princípios SOLID** aplicados consistentemente
- ✅ **Independência de frameworks** no domínio
- ✅ **Padrões de design** bem implementados

### Qualidade de Código
- ✅ **Testes automatizados** com cobertura abrangente
- ✅ **TypeScript** com tipagem forte
- ✅ **ESLint** para padronização
- ✅ **Zod** para validação robusta

### Tecnologias Modernas
- ✅ **Fastify** com performance otimizada
- ✅ **Prisma** com type safety
- ✅ **Vitest** para testes rápidos
- ✅ **Docker** para containerização

### Padrões de Design
- ✅ **Repository Pattern** para abstração de dados
- ✅ **Use Case Pattern** para casos de uso
- ✅ **Factory Pattern** para injeção
- ✅ **Strategy Pattern** para flexibilidade

### Segurança
- ✅ **JWT** com autenticação segura
- ✅ **bcryptjs** para hash de senhas
- ✅ **Validação** com Zod
- ✅ **Controle de acesso** por roles

### Funcionalidades Avançadas
- ✅ **Geolocalização** com cálculos de distância
- ✅ **Sistema de roles** (ADMIN/MEMBER)
- ✅ **Validação de proximidade** para check-ins
- ✅ **Histórico e métricas** de check-ins

Este projeto demonstra conhecimento sólido em arquitetura de software, boas práticas de desenvolvimento e tecnologias modernas do ecossistema Node.js/TypeScript, servindo como portfólio técnico para oportunidades profissionais.
