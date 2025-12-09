// ================================================
// ARCHIVO: js/usuario.js
// DESCRIPCIÓN: Funciones para interactuar con la tabla 'usuarios'
// ================================================

// Asegúrate que la ruta a 'conexion.js' sea correcta
const { conectarDB } = require('./conexion'); 
const bcrypt = require('bcrypt'); // Librería para hasheo (ya instalada)

const saltRounds = 10; 

/**
 * Función para registrar un nuevo usuario en la base de datos,
 * mapeando los campos del formulario a la estructura de la BD.
 * * NOTA: El rol se fija automáticamente como 'cliente'.
 */
async function registrarUsuario(nombres, apellidos, direccion, email, password) {
    let connection;
    try {
        // 1. Preprocesar datos: Combinar Nombres y Apellidos
        const nombre_completo = `${nombres} ${apellidos}`;
        
        // 2. Conectar a la base de datos
        connection = await conectarDB();

        // 3. Hashear la contraseña por seguridad
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Consulta SQL: El campo 'rol' siempre será 'cliente'
        const query = 'INSERT INTO usuarios (nombre_completo, email, password, direccion, rol) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.execute(query, [nombre_completo, email, hashedPassword, direccion, 'cliente']);

        console.log(`[DB] ✅ Nuevo usuario registrado: ID ${result.insertId}, Email: ${email}`);
        return result;

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            // Error de correo duplicado
            console.error('❌ Error de registro: El correo electrónico ya está registrado.');
            throw new Error('El correo electrónico ya está registrado.');
        } else {
            console.error('❌ Error al registrar el usuario:', error.message);
            throw new Error('Error interno del servidor.');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Exportamos la función
module.exports = {
    registrarUsuario,
};