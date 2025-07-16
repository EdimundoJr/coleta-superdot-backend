[![GitHub last commit](https://img.shields.io/github/last-commit/grupac-dev/coleta-superdot-backend)](#)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## Table of Contents
- [Introdução](#-introduction)
- [Como Executar?](#-como-executar)
- [Documentação](#-documentacao)
- [Feedback e Contribuições](#-feedback-e-contribuicoes)

## Introdução
Seja bem vindo ao backend do sistema de coleta SuperDot, uma API RESTful desenvolvida em cima do framework ExpressJS.

Essa API estabelece uma interface entre o banco de dados, em MongoDB, e o [frontend do sistema](https://github.com/grupac-dev/coleta-superdot-frontend).

## Como Executar?
> [!TIP]
> Caso queira executar o projeto inteiro, utilizando docker, você pode utilizar o docker-compose.yml disponível [aqui](https://github.com/grupac-dev/coleta-superdot-infra).

### Pré-requisitos
- [Git](https://git-scm.com)
- [NodeJS](https://nodejs.org/en)
- [NPM](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)
  
#### Configurando o SGBD.
> [!IMPORTANT]
> Certifique-se de que o mongodb esteja escutando na porta 27071. Caso contrário, adapte o arquivo .env conforme a sua configuração.

1. Crie um banco de dados com o nome ***superdot***.
2. Popule a coleção ***samplegroups*** utilizando [este arquivo](https://github.com/grupac-dev/coleta-superdot-infra/blob/master/db/populate-groups.js).
3. Popule a coleção ***sourcequestionsgroups*** utilizando [este arquivo](https://github.com/grupac-dev/coleta-superdot-infra/blob/master/db/populate-questions.js).

### Passo a passo
```shell
# Abra um terminal (Command Prompt ou PowerShell no Windows, Terminal no macOS ou Linux)

# Clone esse repositório
git clone https://github.com/grupac-dev/coleta-superdot-backend.git

# Acesse a pasta com o projeto clonado
cd coleta-superdot-backend

# Instale todas as dependências
npm i

# Renomeie o arquivo com as variáveis de ambiente
mv .env.example .env

# Execute o projeto e seja feliz =D
npm start
```

## Documentação
No momento, a única documentação disponível são os comentários no código.

Estamos trabalhando para construir a documentação na aba [Wiki](https://github.com/grupac-dev/coleta-superdot-backend/wiki) desse repositório. Sinta-se livre para contribuir.

## Feedback e Contribuições
Qualquer sugestão de melhoria, feedback ou dica de refatoração é bem vinda.

Caso tenha algum feedback de melhoria ou tenha encontrado algum problema, abra uma [issue](https://github.com/grupac-dev/coleta-superdot-backend/issues) descrevendo a sugestão/erro.

Caso queira contribuir com o desenvolvimento do projeto, verifique se existe alguma issue aberta, faça um fork do repositório, codifique a mudança e envie um [pull request](https://github.com/grupac-dev/coleta-superdot-backend/pulls) para aprovação.
