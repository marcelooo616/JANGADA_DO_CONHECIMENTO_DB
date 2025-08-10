// __tests__/category.test.js

const request = require('supertest');
const app = require('../src/index');
const { sequelize, User, Role, Category } = require('../src/models');

let adminToken;
let authorToken;
let categoryId;

describe('Category Endpoints', () => {

  beforeAll(async () => {
    // Limpeza inicial
    await Category.destroy({ where: {} });
    await User.destroy({ where: { email: ['cat.admin@example.com', 'cat.author@example.com'] } });
    
    // Pega os papéis que já devem existir
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    
    // Cria usuários específicos para este teste
    await request(app).post('/api/auth/register').send({
      full_name: 'Category Admin', username: 'catadmin', email: 'cat.admin@example.com', password: 'Password123!',
    });
    await request(app).post('/api/auth/register').send({
      full_name: 'Category Author', username: 'catauthor', email: 'cat.author@example.com', password: 'Password123!',
    });

    // Promove um usuário para admin
    const adminUser = await User.findOne({ where: { email: 'cat.admin@example.com' }});
    await adminUser.update({ roleId: adminRole.id });

    // Obtém os tokens de login
    const adminLoginRes = await request(app).post('/api/auth/login').send({ email: 'cat.admin@example.com', password: 'Password123!' });
    adminToken = adminLoginRes.body.token;

    const authorLoginRes = await request(app).post('/api/auth/login').send({ email: 'cat.author@example.com', password: 'Password123!' });
    authorToken = authorLoginRes.body.token;
  });

  // Testes de CRIAÇÃO (POST)
  describe('POST /api/categories', () => {
    it('deve falhar ao criar categoria com token de autor (403)', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ name: 'Categoria Proibida' });
      expect(res.statusCode).toEqual(403);
    });

    it('deve criar uma categoria com sucesso com token de admin (201)', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Tecnologia' });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Tecnologia');
      categoryId = res.body.id; // Salva o ID para os próximos testes
    });
  });

  // Teste de LEITURA (GET)
  describe('GET /api/categories', () => {
    it('deve listar todas as categorias sem precisar de autenticação (200)', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0); // Deve ter pelo menos a categoria 'Geral' e a que criamos
    });
  });
  
  // Testes de ATUALIZAÇÃO (PUT)
  describe('PUT /api/categories/:id', () => {
    it('deve falhar ao atualizar categoria com token de autor (403)', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ name: 'Nome não autorizado' });
      expect(res.statusCode).toEqual(403);
    });

    it('deve atualizar uma categoria com sucesso com token de admin (200)', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Tecnologia Avançada' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Tecnologia Avançada');
    });
  });

  // Testes de DELEÇÃO (DELETE)
  describe('DELETE /api/categories/:id', () => {
    it('deve falhar ao deletar categoria com token de autor (403)', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authorToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it('deve deletar uma categoria com sucesso com token de admin (204)', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(204);
    });
  });

  afterAll(async () => {
    // A conexão já é fechada pelos outros arquivos de teste, não precisamos fechar de novo aqui
    // para evitar o erro de 'connection manager closed'.
  });
});