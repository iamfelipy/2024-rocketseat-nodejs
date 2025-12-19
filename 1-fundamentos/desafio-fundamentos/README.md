# API de Tarefas - Node.js Puro

API REST de gerenciamento de tarefas construída com Node.js puro (sem frameworks), utilizando streams e servidor HTTP nativo.

## 🚀 Tecnologias

- Node.js (ES Modules)
- HTTP Server nativo
- Streams
- CSV Parse

## 📦 Instalação

```bash
npm install
```

## ▶️ Execução

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`

## 📋 Endpoints

- `POST /tasks` - Criar tarefa
- `GET /tasks?search=termo` - Listar tarefas (com busca opcional)
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `PATCH /tasks/:id/complete` - Marcar/desmarcar como completa

## 📊 Importação de CSV

Para importar tarefas de um arquivo CSV:

```bash
node streams/import-csv.js
```

## 💾 Banco de Dados

Os dados são persistidos em `db.json` (banco de dados JSON simples).
