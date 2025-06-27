// Script temporário para aplicar as mudanças do menu
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

async function aplicarScript() {
  try {
    // Lê o arquivo SQL
    const sqlScript = fs.readFileSync('./prisma/scripts/reestruturar_menu.sql', 'utf8');
    
    // Extrai a URL de conexão do ambiente
    const databaseUrl = process.env.DATABASE_URL;
    
    // Configura a conexão
    const connection = await mysql.createConnection(databaseUrl);
    
    console.log('Conectado ao banco de dados. Aplicando script de reestruturação do menu...');
    
    // Divide o script em comandos individuais
    const queries = sqlScript
      .split(';')
      .filter(query => query.trim() !== '')
      .map(query => query + ';');
    
    // Executa cada comando
    for (const query of queries) {
      console.log(`Executando: ${query.substring(0, 50)}...`);
      await connection.query(query);
    }
    
    console.log('Script aplicado com sucesso!');
    
    // Fecha a conexão
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao aplicar o script:', error);
    process.exit(1);
  }
}

aplicarScript();
