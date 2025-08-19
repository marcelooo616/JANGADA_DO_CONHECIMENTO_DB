// __tests__/comment.test.js

const request = require('supertest');
const app = require('../src/index');
const { sequelize, User, Role, Category, Article, Comment } = require('../src/models');

let adminToken;
let authorToken;
let randomUserToken; // Um terceiro usuário para testar permissões
let testArticleId;
let testCommentId;

describe('Comment Endpoints', () => {

  beforeAll(async () => {
    // Limpeza
    await Comment.destroy({ where: {} });
    await Article.destroy({ where: {} });
    await User.destroy({ where: { email: ['comment.admin@example.com', 'comment.author@example.com', 'random.user@example.com'] } });
    
    // Setup de papéis e categoria
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const category = await Category.findOne({ where: { slug: 'geral' } });
    
    // Criação dos usuários
    await request(app).post('/api/auth/register').send({ full_name: 'Comment Admin', username: 'commentadmin', email: 'comment.admin@example.com', password: 'Password123!' });
    await request(app).post('/api/auth/register').send({ full_name: 'Comment Author', username: 'commentauthor', email: 'comment.author@example.com', password: 'Password123!' });
    await request(app).post('/api/auth/register').send({ full_name: 'Random User', username: 'randomuser', email: 'random.user@example.com', password: 'Password123!' });

    // Promove um para admin
    const adminUser = await User.findOne({ where: { email: 'comment.admin@example.com' }});
    await adminUser.update({ roleId: adminRole.id });

    // Login e obtenção dos tokens
    const adminLoginRes = await request(app).post('/api/auth/login').send({ email: 'comment.admin@example.com', password: 'Password123!' });
    adminToken = adminLoginRes.body.token;
    const authorLoginRes = await request(app).post('/api/auth/login').send({ email: 'comment.author@example.com', password: 'Password123!' });
    authorToken = authorLoginRes.body.token;
    const randomUserLoginRes = await request(app).post('/api/auth/login').send({ email: 'random.user@example.com', password: 'Password123!' });
    randomUserToken = randomUserLoginRes.body.token;
    
    // Admin cria um artigo
    const articleRes = await request(app).post('/api/articles').set('Authorization', `Bearer ${adminToken}`).send({ title: 'Artigo Para Comentar v2', content: 'Conteúdo...', categoryId: category.id });
    testArticleId = articleRes.body.id;
  });

  // Testes de LEITURA E CRIAÇÃO
  describe('Create and Read Comments', () => {
    it('deve retornar uma lista vazia de comentários', async () => {
      const res = await request(app).get(`/api/comments/article/${testArticleId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('deve criar um comentário com sucesso com token de autor', async () => {
      const res = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ content: 'Comentário original do autor.', articleId: testArticleId });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.content).toBe('Comentário original do autor.');
      testCommentId = res.body.id; // Salva o ID do comentário para o teste de deleção
    });

    it('deve listar o comentário recém-criado', async () => {
      const res = await request(app).get(`/api/comments/article/${testArticleId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
    });
  });

  // Testes de DELEÇÃO
  describe('DELETE /api/comments/:id', () => {
    it('deve falhar ao tentar deletar o comentário de outro usuário (403)', async () => {
      const res = await request(app)
        .delete(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${randomUserToken}`); // Usuário aleatório tentando deletar
      expect(res.statusCode).toEqual(403);
    });

    it('deve permitir que o autor original delete seu próprio comentário (204)', async () => {
      const res = await request(app)
        .delete(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${authorToken}`); // O próprio autor deletando
      expect(res.statusCode).toEqual(204);
    });

    it('deve retornar uma lista vazia de comentários após a deleção', async () => {
        const res = await request(app).get(`/api/comments/article/${testArticleId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
      
    it('deve permitir que um admin delete o comentário de qualquer usuário (204)', async () => {
      // Primeiro, o autor cria um novo comentário
      const newCommentRes = await request(app).post('/api/comments').set('Authorization', `Bearer ${authorToken}`).send({ content: 'Outro comentário para o admin deletar.', articleId: testArticleId });
      const newCommentId = newCommentRes.body.id;

      // Agora, o admin deleta esse comentário
      const res = await request(app)
        .delete(`/api/comments/${newCommentId}`)
        .set('Authorization', `Bearer ${adminToken}`); // Admin deletando
      expect(res.statusCode).toEqual(204);
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});