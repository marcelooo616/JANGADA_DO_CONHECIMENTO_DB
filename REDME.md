**Documentação Técnica da API da Plataforma de Artigos**

**Versão:** 1.0  
**Data:** 10 de Agosto de 2025  


**1. Introdução**  
Este documento narra o processo de construção da API para a Plataforma de Artigos, detalhando as decisões de arquitetura, os desafios enfrentados e a estrutura final do projeto. Ele serve como um registro histórico do desenvolvimento e um guia técnico para a API.  


**2. A Gênese do Projeto: Da Ideia à Estrutura**  
O projeto nasceu com o objetivo de criar uma API robusta para uma plataforma de conteúdo. A primeira decisão estratégica foi a separação clara entre back-end e front-end, focando 100% na construção de uma API sólida antes de qualquer desenvolvimento de interface.  


**2.1. A Escolha da Stack de Tecnologia**  
A base tecnológica foi definida visando escalabilidade, segurança e produtividade:

- **Runtime:** Node.js, por seu ecossistema maduro e natureza assíncrona.
- **Framework:** Express.js, pelo seu minimalismo e poder para a construção de APIs.
- **Banco de Dados:** Oracle Cloud (Autonomous Database), escolhido por sua robustez e pelo generoso plano gratuito.
- **ORM:** Sequelize, para abstrair a complexidade do SQL e modelar nossos dados em JavaScript.
- **Ferramentas de Desenvolvimento:** Nodemon, Dotenv, bcryptjs, jsonwebtoken.  


**2.2. Construindo a Fundação**  
O projeto foi iniciado com uma estrutura de diretórios profissional, separando as responsabilidades do código:

```bash
# Criação da estrutura inicial
mkdir plataforma-de-artigos-api
cd plataforma-de-artigos-api
npm init -y
mkdir src src/config src/models src/controllers src/routes src/services src/middleware
```

Essa estrutura provou ser fundamental para a organização à medida que o projeto crescia, com cada pasta tendo um propósito claro:

- **config:** Conexão com o banco de dados.
- **models:** Definição das tabelas e suas relações.
- **services:** Lógica de negócio principal.
- **controllers:** Lida com as requisições e respostas HTTP.
- **routes:** Mapeamento das URLs para os controllers.
- **middleware:** Funções intermediárias, como a verificação de tokens.  


**3. A Saga da Conexão com o Oracle Cloud**  
A etapa mais desafiadora foi estabelecer a conexão com o banco de dados Oracle na nuvem. Os obstáculos enfrentados foram:

- **Primeiro Obstáculo (ORA-12506 - Connection Refused):** Configuração da Access Control List (ACL).
- **Segundo Obstáculo (ORA-01017 - Invalid Username/Password):** Redefinição da senha do usuário ADMIN.
- **Desafio Final (Conexão Segura mTLS):** Configuração do Oracle Wallet para autenticação mútua.  


**4. Evolução da Arquitetura e Implementação**  
Com a conexão estabelecida, a construção da API progrediu rapidamente.

**4.1. Modelagem de Dados com Sequelize**  
Definimos os modelos para Roles, Users, Categories, Articles e Comments, centralizando a lógica do banco de dados em `src/models/index.js`.  


**4.2. A Camada de Serviço**  
A lógica de negócio foi movida dos controllers para os services, resultando em:

- **Controllers "Magros":** Apenas gerenciam requisições e respostas.
- **Serviços "Gordos":** Contêm a lógica de validação e manipulação de dados.  


**4.3. Autenticação e Autorização**  
Implementamos um sistema de autenticação com JWT e um middleware (verifyToken) para proteger as rotas. A lógica de autorização foi refinada para garantir que apenas administradores pudessem gerenciar artigos e categorias.  


**5. Testes Automatizados: A Garantia de Qualidade**  
Foi implementada uma suíte de testes completa usando Jest e Supertest, cobrindo cenários de sucesso e falha. Os desafios enfrentados incluíram:

- **Concorrência de Testes:** Uso da flag `--runInBand` para evitar conflitos.
- **Dependência de Dados:** Refatoração para criar dados dinamicamente.  

O resultado final é uma suíte com 25 testes automatizados que validam toda a funcionalidade da API.  


**Guia de Referência da API (Endpoints)**  
**URL Base (Desenvolvimento):** http://localhost:3000  


**Autenticação**  
Esta API utiliza JSON Web Tokens (JWT) para proteger endpoints. Para acessar rotas protegidas, o cliente deve obter um token através do endpoint de login e enviá-lo no cabeçalho Authorization.  

**Formato do Cabeçalho:**  
`Authorization: Bearer SEU_TOKEN_JWT_AQUI`  


**Endpoints de Autenticação (/api/auth)**  

1. **Registrar um Novo Usuário**  
   - **Endpoint:** POST /api/auth/register  
   - **Acesso:** Público  
   - **Corpo da Requisição (application/json):**  
     | Campo | Tipo | Descrição |
     | :--- | :--- | :--- |
     | full_name| String | Nome completo do usuário. |
     | username | String | Nome de usuário único. |
     | email | String | E-mail único do usuário. |
     | password | String | Senha do usuário. |

   - **Exemplo de Requisição:**
   ```json
   {
       "full_name": "Marcelo Santos",
       "username": "marcelosantos",
       "email": "marcelo@exemplo.com",
       "password": "senha123"
   }
   ```

   - **Respostas:**
     - **201 Created:** Sucesso.
     - **409 Conflict:** Se o email ou username já existirem.
     - **400 Bad Request:** Se algum campo obrigatório estiver faltando.  


2. **Login de Usuário**  
   - **Endpoint:** POST /api/auth/login  
   - **Acesso:** Público  
   - **Corpo da Requisição (application/json):**  
     | Campo | Tipo | Descrição |
     | :--- | :--- | :--- |
     | email | String | E-mail do usuário. |
     | password| String | Senha do usuário. |

   - **Exemplo de Requisição:**
   ```json
   {
       "email": "marcelo@exemplo.com",
       "password": "senha123"
   }
   ```

   - **Respostas:**
     - **200 OK:** Sucesso.
     - **401 Unauthorized:** Se as credenciais estiverem incorretas.  


3. **Obter Perfil do Usuário Logado**  
   - **Endpoint:** GET /api/auth/me  
   - **Acesso:** Protegido (Requer token de qualquer usuário logado)  

   - **Respostas:**
     - **200 OK:** Sucesso.
     - **401 Unauthorized:** Se nenhum token for fornecido.
     - **403 Forbidden:** Se o token for inválido ou expirado.  


**Endpoints de Artigos (/api/articles)**  

1. **Criar um Artigo**  
   - **Endpoint:** POST /api/articles  
   - **Acesso:** Protegido (Requer token de admin)  
   - **Corpo da Requisição (application/json):**  
     | Campo | Tipo | Descrição |
     | :--- | :--- | :--- |
     | title | String | Título do artigo. |
     | content | String | Conteúdo completo do artigo. |
     | categoryId| Integer| ID da categoria à qual o artigo pertence. |

   - **Respostas:**
     - **201 Created:** Retorna o objeto do artigo recém-criado.
     - **403 Forbidden:** Se o usuário não for um admin.  


2. **Listar Todos os Artigos**  
   - **Endpoint:** GET /api/articles  
   - **Acesso:** Público  
   - **Parâmetros de Query (Opcionais):**  
     - `page`: Número da página. Padrão: 1.
     - `limit`: Itens por página. Padrão: 10.

   - **Respostas:**
     - **200 OK:** Retorna um objeto com a lista de artigos e metadados de paginação.  


3. **Obter um Artigo Específico**  
   - **Endpoint:** GET /api/articles/:slug  
   - **Acesso:** Público  

   - **Respostas:**
     - **200 OK:** Retorna o objeto completo do artigo.
     - **404 Not Found:** Se o artigo não for encontrado.  


4. **Atualizar um Artigo**  
   - **Endpoint:** PUT /api/articles/:id  
   - **Acesso:** Protegido (Requer token de admin)  
   - **Corpo da Requisição (application/json):**  
     | Campo | Tipo | Descrição |
     | :--- | :--- | :--- |
     | title | String | Novo título do artigo. |
     | content | String | Novo conteúdo do artigo. |
     | categoryId| Integer| Novo ID da categoria. |

   - **Respostas:**
     - **200 OK:** Retorna o objeto do artigo atualizado.
     - **403 Forbidden:** Se o usuário não for admin.
     - **404 Not Found:** Se o artigo não for encontrado.  


5. **Deletar um Artigo**  
   - **Endpoint:** DELETE /api/articles/:id  
   - **Acesso:** Protegido (Requer token de admin)  

   - **Respostas:**
     - **204 No Content:** Sucesso.
     - **403 Forbidden:** Se o usuário não for admin.
     - **404 Not Found:** Se o artigo não for encontrado.  


**Endpoints de Categorias (/api/categories)**  
- **GET /api/categories:** Público. Lista todas as categorias.
- **POST /api/categories:** Protegido (admin). Cria uma nova categoria.
- **PUT /api/categories/:id:** Protegido (admin). Atualiza uma categoria.
- **DELETE /api/categories/:id:** Protegido (admin). Deleta uma categoria.  


**Endpoints de Comentários (/api/comments)**  
- **POST /api/comments:** Protegido (Qualquer usuário logado). Cria um novo comentário.
- **GET /api/comments/article/:articleId:** Público. Lista todos os comentários de um artigo específico.
- **DELETE /api/comments/:id:** Protegido (Autor do comentário ou admin). Deleta um comentário.  
