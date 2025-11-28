// Script de prueba para conexión a base de datos MySQL
// Ejecutar con: node test-db-connection.js

const mysql = require('mysql2/promise');

async function testConnection() {
  const dbConfig = {
    host: 'localhost',
    user: 'tienda_user',
    password: 'tu_password',
    database: 'tienda_arquitectura',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  try {
    console.log('🔄 Intentando conectar a la base de datos...');
    const connection = await mysql.createConnection(dbConfig);

    console.log('✅ Conexión exitosa a MySQL');

    // Probar consulta simple
    console.log('🔄 Probando consulta a la tabla site_content...');
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM site_content');
    console.log(`📊 Registros en site_content: ${rows[0].total}`);

    // Probar consulta de productos
    const [products] = await connection.execute('SELECT COUNT(*) as total FROM products');
    console.log(`📦 Registros en products: ${products[0].total}`);

    // Mostrar datos de ejemplo
    const [siteData] = await connection.execute('SELECT hero_title FROM site_content LIMIT 1');
    if (siteData.length > 0) {
      console.log(`🏠 Título del sitio: ${siteData[0].hero_title}`);
    }

    const [productData] = await connection.execute('SELECT name FROM products LIMIT 1');
    if (productData.length > 0) {
      console.log(`🛍️ Primer producto: ${productData[0].name}`);
    }

    await connection.end();
    console.log('✅ Prueba completada exitosamente');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Sugerencia: Verifica el usuario y contraseña');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Sugerencia: Verifica que la base de datos exista');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Sugerencia: Verifica que MySQL esté ejecutándose en XAMPP');
    }
  }
}

testConnection();