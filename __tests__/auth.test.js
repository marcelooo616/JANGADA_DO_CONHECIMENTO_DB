// __tests__/auth.test.js

const request = require('supertest');
const app = require('../src/index'); // Importa nossa app Express configurada
const { sequelize, User } = require('../src/models');

// Bloco que agrupa todos os testes de autenticação
describe('Auth Endpoints', () => {
  
  // Hook que roda ANTES de todos os testes neste arquivo
  beforeAll(async () => {
    // Garante que o banco de dados esteja limpo para os testes de registro
    await User.destroy({ where: { email: 'test.user@example.com' } });
  });

  // Dados do usuário que vamos usar nos testes
  const testUser = {
    full_name: 'Test User',
    username: 'testuser',
    email: 'test.user@example.com',
    password: 'Password123!',
  };

  // Teste 1: Registro de um novo usuário
  it('deve registrar um novo usuário com sucesso', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    // Verificamos o status da resposta
    expect(res.statusCode).toEqual(201);
    // Verificamos se a resposta tem as propriedades que esperamos
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(testUser.email);
  });

  // Teste 2: Tentar registrar o mesmo usuário novamente (deve falhar)
  it('deve falhar ao tentar registrar um e-mail duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
      
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toBe('Este e-mail já está em uso.');
  });

  // Teste 3: Fazer login com o usuário criado
  it('deve fazer login com sucesso e retornar um token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  // Teste 4: Tentar fazer login com senha errada
  it('deve falhar ao tentar fazer login com senha incorreta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });
      
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Credenciais inválidas.');
  });
  
  // Hook que roda DEPOIS de todos os testes neste arquivo
  afterAll(async () => {
    // Limpa os dados de teste que criamos
    await User.destroy({ where: { email: testUser.email } });
    // Fecha a conexão com o banco de dados para o Jest encerrar
    // await sequelize.close();
  });

});