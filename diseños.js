// diseños.js

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configura Express para servir archivos estáticos (HTML, CSS, imágenes, etc.)
// Asumiendo que todos tus archivos están en el directorio raíz o en subcarpetas como 'css' o 'imagenes'.
app.use(express.static(path.join(__dirname)));

// Ruta principal (/) para cargar inicio.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'inicio.html'));
});

// Puedes agregar rutas para los otros archivos HTML si lo deseas, 
// o dejar que el navegador los acceda directamente:
// app.get('/productos.html', (req, res) => { res.sendFile(path.join(__dirname, 'productos.html')); });

// Iniciar el servidor
app.listen(port, () => {
    console.log(`
=====================================================
  ✅ Servidor Node.js y Express corriendo en:
     http://localhost:${port}
=====================================================
`);
});