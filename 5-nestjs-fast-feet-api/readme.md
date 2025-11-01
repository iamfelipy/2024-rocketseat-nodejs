Esse projeto foi desenvolvido por mim como solução para o desafio disponível em:  
https://efficient-sloth-d85.notion.site/Desafio-04-a3a2ef9297ad47b1a94f89b197274ffd

O layout utilizado está disponível no Figma:  
https://www.figma.com/design/dpfmRdV3J2GmZmAqFvHGM0/FastFeet--Copy-?node-id=0-1&p=f&t=QmL4ZaW6FjpYz6dC-0

O objetivo foi criar uma API para controle de encomendas de uma transportadora fictícia, a FastFeet.

### Cobertura de Testes

- Testes unitários (use-cases): 30
- Testes E2E (controllers): 32
- **Total:** 62 testes

### Regras da aplicação

- [x] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- [x] Deve ser possível realizar login com CPF e Senha
- [x] Deve ser possível realizar o CRUD dos entregadores
- [x] Deve ser possível realizar o CRUD das encomendas
- [x] Deve ser possível realizar o CRUD dos destinatários
- [x] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- [x] Deve ser possível retirar uma encomenda
- [x] Deve ser possível marcar uma encomenda como entregue
- [x] Deve ser possível marcar uma encomenda como devolvida
- [x] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- [x] Deve ser possível alterar a senha de um usuário
- [x] Deve ser possível listar as entregas de um usuário
- [x] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de negócio

- [x] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [x] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [x] Somente o admin pode alterar a senha de um usuário
- [x] Não deve ser possível um entregador listar as encomendas de outro entregador

### Conceitos que pode praticar

- DDD, Domain Events, Clean Architecture
- Autenticação e Autorização (RBAC)
- Testes unitários e e2e
- Integração com serviços externos
