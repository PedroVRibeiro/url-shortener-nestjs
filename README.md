# URL Shortener - NestJS

Serviço de encurtamento de links, em NestJS utilizando Typescript. Utiliza banco de dados relacional PostgreSQL, com Role Based Access e autenticação via JWT

---

## Tecnologias Utilizadas

- **Node.js** (v22.14)
- **NestJS** 
- **TypeScript**
- **TypeORM** (ORM para PostgreSQL)
- **PostgreSQL**
- **Docker & Docker Compose**
- **JWT** (JSON Web Tokens) para autenticação
- **Swagger** para documentação da API
- **Husky** para scripts de pré-commit
- **Github Actions** para lint e testes
- **Railway** para deploy em nuvem

---

## Pré-requisitos

- Git  
- Node.js  
- Docker & Docker Compose (caso queira rodar em container)  
- PostgreSQL (local ou container)    

---

## Acessando via URL (deploy no Railway)

[https://url-shortener-nestjs-production.up.railway.app/swagger](https://url-shortener-nestjs-production.up.railway.app/swagger)

## Rodando Localmente

1. **Clone o repositório**
  ```env  
   git clone https://github.com/seu-usuario/url-shortener.git
   ```

2. **Acesse a pasta do projeto**    
   ```sh
   cd url-shortener
   ```
3. **Configure variáveis de ambiente**
  ```bash
  cp .env.example .env

  NODE_ENV=development
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  DATABASE_USER=seu_usuario
  DATABASE_PASS=sua_senha
  DATABASE_NAME=url_shortener
  JWT_SECRET=umSegredoMuitoForte
  JWT_EXPIRATION=3600s
  ```

4. **Executar Docker Compose**
```sh
 docker compose up -d
```
```sh
A API estará disponível em http://localhost:3000
Documentação Swagger: http://localhost:3000/swagger
```

## Possíveis pontos de melhoria para escalar horizontalmente:
- **Uso de load balancers, como AWS Elastic Load Balancing**
- **Implementação de Cache, como Redis**
- **Aprimorar observabilidade, utilizando Prometheus/Grafana ou outros**'

## Desafios para o escalonamento:
- **Deploy e orquestraçao, utilizando Docker Swarm, Kubernetes ou ECS**


