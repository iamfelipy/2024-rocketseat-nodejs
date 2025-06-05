# 05-nest-clean

Este projeto utiliza o framework [NestJS](https://nestjs.com/) para implementar uma aplicação seguindo os princípios de **Clean Architecture**. Ele foi desenvolvido com foco em modularidade, escalabilidade e boas práticas de desenvolvimento, como injeção de dependência e uso de repositórios.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações Node.js escaláveis e eficientes.
- **Prisma**: ORM para manipulação de banco de dados.
- **TypeScript**: Linguagem de programação tipada que compila para JavaScript.
- **ESLint e Prettier**: Ferramentas para padronização e formatação de código.

## Scripts Disponíveis

- `build`: Compila o projeto para produção.
- `format`: Formata o código utilizando o Prettier.
- `start`: Inicia a aplicação em modo de produção.
- `start:dev`: Inicia a aplicação em modo de desenvolvimento com hot-reload.
- `start:debug`: Inicia a aplicação em modo de depuração.
- `start:prod`: Executa a aplicação já compilada.
- `lint`: Analisa e corrige problemas de estilo de código com ESLint.

## Estrutura do Projeto

O projeto segue os princípios da **Clean Architecture**, separando responsabilidades em camadas bem definidas:

- **Domain**: Contém as regras de negócio e entidades.
- **Application**: Contém os casos de uso e interfaces.
- **Infrastructure**: Contém implementações concretas, como repositórios e serviços externos.
- **Presentation**: Contém os controladores e a interface com o usuário.

## Configuração e Execução

1. Clone o repositório:
  ```bash
  git clone <url-do-repositorio>
  cd 05-nest-clean
  ```

2. Instale as dependências:
  ```bash
  npm install
  ```

3. Configure o banco de dados no arquivo `prisma/schema.prisma` e gere as migrações:
  ```bash
  npx prisma migrate dev
  ```

4. Inicie a aplicação em modo de desenvolvimento:
  ```bash
  npm run start:dev
  ```

## Licença

Este projeto está sob a licença **UNLICENSED**.  

