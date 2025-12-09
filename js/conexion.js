// ================================================
// ARCHIVO: conexion.js
// DESCRIPCIÓN: Conexión asíncrona a MySQL y funciones de consulta (mysql2/promise)
// ================================================

const mysql = require('mysql2/promise');

// ⚙️ CONFIGURACIÓN DE LA BASE DE DATOS
const dbConfig = {
    host: 'localhost',      
    user: 'root',           
    // Usa la contraseña que sabes que funciona, o prueba con '' si 12345 falla.
    password: 'JesusR20',      
    // ¡CORREGIDO! Usamos la BD 'gamerzone' que acabas de crear
    database: 'gamerzone' 
};

/**
 * Función para establecer la conexión a MySQL.
 */
async function conectarDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexión exitosa a la base de datos gamerzone.');
        return connection;
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
        throw error;
    }
}

/**
 * Función de ejemplo para obtener todos los productos y probar la conexión.
 */
async function obtenerTodosLosProductos() {
    let connection;
    try {
        connection = await conectarDB();
        
        // Esta consulta usará las nuevas tablas y datos
        const [rows] = await connection.execute(
            'SELECT p.nombre, p.precio, p.url_imagen, c.nombre AS categoria ' +
            'FROM Productos p ' +
            'JOIN Categorias c ON p.id_categoria = c.id_categoria ' +
            'LIMIT 10'
        );
        
        console.log('\nDatos obtenidos de la BD (Primeros 10 productos):', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        return [];
    } finally {
        if (connection) {
            await connection.end(); // Cierra la conexión
            console.log('\nConexión a DB cerrada.');
        }
    }
}

// ----------------------------------------------------
// 🚀 INICIAR PRUEBA
// ----------------------------------------------------
obtenerTodosLosProductos(); // <--- Ejecuta la prueba

// Exportar funciones 
module.exports = {
    conectarDB,
    obtenerTodosLosProductos
};