// ================================================
// ARCHIVO: server.js (BACKEND EXPRESS.JS)
// LÓGICA: Maneja Registro/Compra (UPDATE/INSERT) y Login (SELECT)
// ================================================

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// ----------------------------------------------------
// 1. CONFIGURACIÓN DE LA BASE DE DATOS
// ----------------------------------------------------
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    password: 'JesusR20', // <--- Asegúrate que esta contraseña sea correcta
    database: 'gamerzone', 
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('✅ Conexión a MySQL establecida correctamente.');
});

// ----------------------------------------------------
// 2. RUTA PARA REGISTRO/FINALIZAR COMPRA (/registro)
// USADO POR: login.html (Realiza INSERT si es nuevo, o UPDATE si ya existe)
// ----------------------------------------------------
app.post('/registro', (req, res) => {
    const data = req.body;
    console.log('Datos recibidos del formulario de registro/compra:', data);

    const nombreCompleto = `${data.nombres} ${data.apellidos}`;

    const { 
        email, 
        password, 
        direccion, 
        nombre_titular_tarjeta,
        numero_tarjeta, 
        caducidad_tarjeta, 
        cvv_tarjeta 
    } = data;
    
    // 1. Verificar si el usuario ya existe por email
    const checkSql = 'SELECT email FROM usuarios WHERE email = ?';

    db.query(checkSql, [email], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error al verificar email:', checkErr);
            return res.status(500).json({ message: 'Error interno del servidor al verificar el usuario.' });
        }

        if (checkResults.length > 0) {
            // =========================
            // LÓGICA DE ACTUALIZACIÓN (Usuario ya existe y está comprando)
            // =========================
            const updateSql = `
                UPDATE usuarios SET
                    nombre_completo = ?,
                    direccion = ?, 
                    nombre_titular_tarjeta = ?, 
                    numero_tarjeta = ?, 
                    caducidad_tarjeta = ?, 
                    cvv_tarjeta = ?
                WHERE email = ?
            `;
            const updateValues = [
                nombreCompleto, 
                direccion || null, 
                nombre_titular_tarjeta || null, 
                numero_tarjeta || null, 
                caducidad_tarjeta || null, 
                cvv_tarjeta || null,
                email
            ];

            db.query(updateSql, updateValues, (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Error al actualizar en MySQL:', updateErr);
                    return res.status(400).json({ message: 'Error al actualizar los datos de la compra.' });
                }
                res.status(200).json({ 
                    message: 'Compra procesada y datos de envío/pago actualizados con éxito.', 
                    nombre_completo: nombreCompleto,
                    email: email
                });
            });

        } else {
            // =========================
            // LÓGICA DE INSERCIÓN (Usuario nuevo, se registra y compra)
            // =========================
            if (!password) {
                // Esto no debería pasar si el login.html está correcto y pide la contraseña al no estar logueado.
                return res.status(400).json({ message: 'Error: La contraseña es requerida para crear una nueva cuenta.' });
            }

            const insertSql = `
                INSERT INTO usuarios (
                    nombre_completo, 
                    email, 
                    password, 
                    direccion, 
                    nombre_titular_tarjeta, 
                    numero_tarjeta, 
                    caducidad_tarjeta, 
                    cvv_tarjeta,
                    rol 
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'cliente')
            `;

            const insertValues = [
                nombreCompleto, 
                email, 
                password, 
                direccion || null, 
                nombre_titular_tarjeta || null, 
                numero_tarjeta || null, 
                caducidad_tarjeta || null, 
                cvv_tarjeta || null
            ];

            db.query(insertSql, insertValues, (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Error al insertar en MySQL:', insertErr);
                    return res.status(400).json({ message: 'Error en la base de datos. Verifica tus datos de registro.' });
                }
                
                res.status(201).json({ 
                    message: 'Compra procesada y cuenta creada con éxito.', 
                    nombre_completo: nombreCompleto,
                    email: email
                });
            });
        }
    });
});

// ----------------------------------------------------
// 3. RUTA PARA INICIAR SESIÓN (/login)
// USADO POR: login2.html (Verificación de credenciales)
// ----------------------------------------------------
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Error: Faltan el email o la contraseña.' });
    }

    // Busca nombre_completo y password en la misma tabla de usuarios
    const sql = 'SELECT nombre_completo, password FROM usuarios WHERE email = ?';

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error de consulta en MySQL:', err);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas. Email no encontrado.' });
        }

        const user = results[0];

        // Comparamos la contraseña
        if (password === user.password) {
            res.status(200).json({ 
                message: 'Inicio de sesión exitoso.', 
                nombre_completo: user.nombre_completo 
            });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas. Contraseña inválida.' });
        }
    });
});

// ----------------------------------------------------
// 4. RUTA DE OBTENCIÓN DE DATOS DE USUARIO (/obtener-datos-usuario)
// USADO POR: login.html (Para precargar el formulario de compra)
// ----------------------------------------------------
app.get('/obtener-datos-usuario', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Falta el email.' });
    }

    const sql = `
        SELECT 
            nombre_completo, 
            email, 
            direccion, 
            nombre_titular_tarjeta, 
            numero_tarjeta, 
            caducidad_tarjeta, 
            cvv_tarjeta 
        FROM usuarios 
        WHERE email = ?
    `;

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error al obtener datos del usuario:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ success: true, usuario: results[0] });
    });
});


// ----------------------------------------------------
// 5. INICIO DEL SERVIDOR EXPRESS
// ----------------------------------------------------
app.listen(port, () => {
    console.log(`🚀 Servidor Express.js corriendo en: http://localhost:${port}`);
});