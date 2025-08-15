// Importa as ferramentas necessárias
require('dotenv').config(); // Para carregar as variáveis de ambiente (BLOB_READ_WRITE_TOKEN)
const { list, del } = require('@vercel/blob');
const { Article } = require('../models'); // Importa seu modelo de Artigo
const { sequelize } = require('../models'); // Importa a instância do Sequelize para fechar a conexão

/**
 * Função principal que executa a limpeza de arquivos órfãos no Vercel Blob.
 */
async function runCleanup() {
  console.log(`[${new Date().toISOString()}] Iniciando script de limpeza de blobs...`);

  try {
    // 1. Pega todas as URLs do Vercel Blob
    const { blobs } = await list();
    // Usamos um Set para performance otimizada na busca
    const allBlobUrls = new Set(blobs.map(blob => blob.url));
    console.log(`- Encontrados ${allBlobUrls.size} arquivos no Vercel Blob.`);

    // 2. Pega todas as URLs em uso no seu banco de dados
    const articles = await Article.findAll({
      attributes: ['content', 'cover_image_url'],
    });
    const usedBlobUrls = new Set();

    articles.forEach(article => {
      // Adiciona a imagem de capa, se existir e for do Vercel Blob
      if (article.cover_image_url && article.cover_image_url.includes('vercel-storage.com')) {
        usedBlobUrls.add(article.cover_image_url);
      }
      
      // Procura por URLs de imagem dentro do conteúdo JSON do Lexical
      if (article.content) {
        try {
          const contentJson = JSON.parse(article.content);
          // Navega na estrutura do JSON para encontrar nós do tipo 'image'
          if (contentJson && contentJson.root && contentJson.root.children) {
            contentJson.root.children.forEach(node => {
              node.children?.forEach(childNode => {
                if (childNode.type === 'image' && childNode.src && childNode.src.includes('vercel-storage.com')) {
                  usedBlobUrls.add(childNode.src);
                }
              });
            });
          }
        } catch (e) { /* Ignora conteúdos que não são JSON ou têm formato inesperado */ }
      }
    });
    console.log(`- Encontradas ${usedBlobUrls.size} URLs em uso no banco de dados.`);

    // 3. Compara as listas para encontrar os órfãos
    const orphanedUrls = [];
    for (const url of allBlobUrls) {
      if (!usedBlobUrls.has(url)) {
        orphanedUrls.push(url);
      }
    }
    
    if (orphanedUrls.length === 0) {
      console.log('- Nenhum arquivo órfão encontrado. Tudo limpo!');
      return; // Finaliza o script se não há nada para deletar
    }
    
    console.log(`- Encontrados ${orphanedUrls.length} arquivos órfãos para deletar:`);
    orphanedUrls.forEach(url => console.log(`  - ${url}`));


    // 4. Deleta os órfãos
    await del(orphanedUrls);
    console.log('✅ Limpeza concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante a execução do script de limpeza:', error);
  } finally {
    // 5. Fecha a conexão com o banco de dados para o script terminar
    await sequelize.close();
    console.log(`[${new Date().toISOString()}] Script finalizado. Conexão com o banco de dados fechada.`);
  }
}

// Executa a função
runCleanup();