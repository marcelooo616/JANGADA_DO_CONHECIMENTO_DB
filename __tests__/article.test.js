// __tests__/article.test.js

const request = require('supertest');
const app = require('../src/index');
const { sequelize, User, Role, Category, Article } = require('../src/models');

// Variáveis para guardar os tokens e os identificadores do artigo criado
let adminToken;
let authorToken;
let articleSlug; // O slug ainda é útil para o teste de GET
let articleId;   // A nova variável para guardar o ID

// Bloco de testes para os endpoints de Artigos
describe('Article Endpoints', () => {

  // Hook que roda ANTES de todos os testes
   beforeAll(async () => {
    // Limpeza
    await Article.destroy({ where: {} });
    await User.destroy({ where: { email: ['test.admin@example.com', 'test.author@example.com'] } });
    
    // Pega o papel de admin
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    
    // Garante que a categoria de teste existe E guarda ela na variável
    [testCategory] = await Category.findOrCreate({ 
      where: { name: 'Test Category', slug: 'test-category' },
      defaults: { name: 'Test Category', slug: 'test-category' }
    });
    
    // Cria os usuários
    await request(app).post('/api/auth/register').send({ full_name: 'Test Admin', username: 'testadmin', email: 'test.admin@example.com', password: 'Password123!' });
    await request(app).post('/api/auth/register').send({ full_name: 'Test Author', username: 'testauthor', email: 'test.author@example.com', password: 'Password123!' });

    // Promove um para admin
    const adminUser = await User.findOne({ where: { email: 'test.admin@example.com' }});
    await adminUser.update({ roleId: adminRole.id });

    // Login e obtenção dos tokens
    const adminLoginRes = await request(app).post('/api/auth/login').send({ email: 'test.admin@example.com', password: 'Password123!' });
    adminToken = adminLoginRes.body.token;
    const authorLoginRes = await request(app).post('/api/auth/login').send({ email: 'test.author@example.com', password: 'Password123!' });
    authorToken = authorLoginRes.body.token;
  });
  
  // Testes de CRIAÇÃO (POST)
  describe('POST /api/articles', () => {
    it('deve falhar ao criar artigo com token de autor (403)', async () => {
      const res = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ title: 'Falha', content: '...', categoryId: testCategory.id });
      expect(res.statusCode).toEqual(403);
    });

    it('deve criar um artigo com sucesso com token de admin (201)', async () => {
      const res = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Artigo de Teste do Admin', content: 'Conteúdo de teste.', categoryId: testCategory.id });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Artigo de Teste do Admin');
      
      // Salva os dois identificadores para os próximos testes
      articleSlug = res.body.slug;
      articleId = res.body.id;
    });
  });

  // Testes de ATUALIZAÇÃO (PUT)
  describe('PUT /api/articles/:id', () => {
    it('deve falhar ao atualizar artigo com token de autor (403)', async () => {
      const res = await request(app)
        .put(`/api/articles/${articleId}`) // Usa o ID
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ title: 'Título não autorizado' });
      expect(res.statusCode).toEqual(403);
    });

    it('deve atualizar um artigo com sucesso com token de admin (200)', async () => {
      const res = await request(app)
        .put(`/api/articles/${articleId}`) // Usa o ID
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Título Atualizado pelo Admin' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe('Título Atualizado pelo Admin');
    });
  });

  // Testes de DELEÇÃO (DELETE)
  describe('DELETE /api/articles/:id', () => {
    it('deve falhar ao deletar artigo com token de autor (403)', async () => {
      const res = await request(app)
        .delete(`/api/articles/${articleId}`) // Usa o ID
        .set('Authorization', `Bearer ${authorToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it('deve deletar um artigo com sucesso com token de admin (204)', async () => {
      const res = await request(app)
        .delete(`/api/articles/${articleId}`) // Usa o ID
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(204);
    });

    it('deve falhar ao tentar buscar o artigo deletado (404)', async () => {
      // Após deletar, tentamos buscar pelo slug para confirmar que ele não existe mais
      const res = await request(app).get(`/api/articles/${articleSlug}`);
      expect(res.statusCode).toEqual(404);
    });
  });

  // Hook que roda DEPOIS de todos os testes
  afterAll(async () => {
    await sequelize.close(); // Fecha a conexão com o banco
  });
});