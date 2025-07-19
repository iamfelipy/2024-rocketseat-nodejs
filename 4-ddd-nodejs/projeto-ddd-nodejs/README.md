
# Projeto DDD Node.js


Este projeto implementa os princípios do **Domain-Driven Design (DDD)**, com foco na criação de um fórum de perguntas e respostas, incluindo funcionalidades de notificação. Desenvolvido com **Node.js** e **TypeScript**, a aplicação adota padrões como **Repository Pattern**, **Pub/Sub** para comunicação assíncrona e **Error Handling** utilizando o padrão **Either**. Os testes unitários são realizados com **Vitest**.

## Arquitetura do Projeto

A arquitetura segue o conceito de **Clean Architecture**, promovendo a separação de responsabilidades e facilitando a manutenção e escalabilidade.

### Camadas Arquiteturais

- [ ] **Apresentação**: Controladores e interfaces com o usuário.
- [x] **Aplicação**: Casos de uso e lógica de orquestração.
- [x] **Domínio**: Modelos de domínio e lógica de negócios.
- [x] **Infraestrutura**: Implementações específicas, como repositórios e comunicação externa.

## Tecnologias Utilizadas

- **Node.js** e **TypeScript** para desenvolvimento.
- **DDD (Domain-Driven Design)** para modelagem do domínio.
- **Vitest** para testes unitários.
- **Pub/Sub** para comunicação assíncrona.
- **Either** para tratamento funcional de erros.
- **ESLint** para linting e padronização de código.
- **Faker** para geração de dados de teste.

## Estrutura de Pastas

```plaintext
src/
├── core/                     # Núcleo da aplicação (domínio e lógica central)
├── domain/
│   ├── forum/                # Casos de uso relacionados ao fórum
│   │   ├── create-question.ts
│   │   ├── edit-question.ts
│   │   ├── fetch-recent-questions.ts
│   │   └── ...
│   ├── notification/         # Casos de uso relacionados às notificações
│       ├── send-notification.ts
│       └── read-notification.ts
├── tests/                    # Configuração e dependências para testes unitários
│   ├── factories/            # Fábricas de dados para testes
│   └── repositories/         # Repositórios InMemory para testes
```

## Casos de Uso

### Fórum

1. **Criação e Respostas**
    - `create-question.ts`: Criação de perguntas.
    - `answer-question.ts`: Criação de respostas.

2. **Comentários**
    - `comment-on-question.ts`: Adicionar comentários em perguntas.
    - `comment-on-answer.ts`: Adicionar comentários em respostas.

3. **Edições**
    - `edit-question.ts`: Edição de perguntas.
    - `edit-answer.ts`: Edição de respostas.

4. **Exclusões**
    - `delete-question.ts`: Exclusão de perguntas.
    - `delete-answer.ts`: Exclusão de respostas.
    - `delete-question-comment.ts`: Exclusão de comentários em perguntas.
    - `delete-answer-comment.ts`: Exclusão de comentários em respostas.

5. **Gerenciamento**
    - `choose-question-best-answer.ts`: Seleção da melhor resposta.

6. **Exibição e Busca**
    - `fetch-recent-questions.ts`: Busca de perguntas recentes.
    - `fetch-question-answers.ts`: Busca de respostas de uma pergunta.
    - `fetch-question-comments.ts`: Busca de comentários de uma pergunta.
    - `fetch-answer-comments.ts`: Busca de comentários de uma resposta.
    - `get-question-by-slug.ts`: Busca de uma pergunta pelo slug.

### Notificações

1. **Envio**
    - `send-notification.ts`: Envio de notificações para usuários.

2. **Leitura**
    - `read-notification.ts`: Leitura de notificações.

## Instalação

Siga os passos abaixo para configurar o projeto localmente:

### 1. Clone o repositório
```bash
git clone https://github.com/usuario/projeto-ddd-nodejs.git
cd projeto-ddd-nodejs
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute os testes
```bash
npm run test
```

### 4. Verifique o código com ESLint
```bash
npm run lint
```

## Scripts Disponíveis

- **`npm run test`**: Executa os testes unitários com Vitest.
- **`npm run test:watch`**: Executa os testes no modo "watch".
- **`npm run lint`**: Verifica a qualidade do código com ESLint.
- **`npm run lint:fix`**: Corrige automaticamente problemas detectados pelo ESLint.

