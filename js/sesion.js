// ================================================
// ARCHIVO: js/sesion.js (Inyección de Enlaces y Lógica de Sesión)
// DESCRIPCIÓN: Script global para construir, manejar la visibilidad y el cierre de sesión automáticamente.
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    
    const nombreUsuario = localStorage.getItem('usuarioNombre');
    const sesionIniciada = localStorage.getItem('sesionIniciada') === 'true';
    
    // El selector busca la lista de navegación principal para inyectar los enlaces
    const navList = document.querySelector('.navbar-nav.ms-auto');

    if (!navList) {
        // Mensaje de advertencia corregido. ¡Cuidado con las comillas!
        console.warn("No se encontró la lista de navegación (ul.navbar-nav.ms-auto). No se puede inyectar la lógica de sesión.");
        return;
    }

    // ----------------------------------------------------
    // 1. INYECCIÓN DE ELEMENTOS DE SESIÓN EN EL NAV
    // ----------------------------------------------------

    let loginNavItem = document.getElementById('navLoginLink');
    let userNavItem = document.getElementById('navUserLink');

    if (!loginNavItem) {
        // Crear el <li> para "Iniciar Sesión" si no existe
        loginNavItem = document.createElement('li');
        loginNavItem.className = 'nav-item';
        loginNavItem.id = 'navLoginLink';
       loginNavItem.innerHTML = `<a class="nav-link" href="login2.html"><i class="bi bi-person-circle"></i> Iniciar Sesión</a>`;
        navList.appendChild(loginNavItem);
    }

    if (!userNavItem) {
        // Crear el <li> para el Dropdown del Usuario si no existe
        userNavItem = document.createElement('li');
        userNavItem.className = 'nav-item dropdown'; // Clase requerida para el menú desplegable de Bootstrap
        userNavItem.id = 'navUserLink';
        navList.appendChild(userNavItem);
    }
    
    // ----------------------------------------------------
    // 2. LÓGICA DE ESTADO DE SESIÓN Y VISIBILIDAD
    // ----------------------------------------------------

    if (sesionIniciada && nombreUsuario) {
        // SESIÓN ACTIVA: 
        
        // Ocultar el enlace de Iniciar Sesión
        loginNavItem.style.display = 'none'; 

        // Mostrar el botón de usuario/Cerrar Sesión
        userNavItem.style.display = 'block'; 
        
        // Rellenar el <li> con el Dropdown de Cerrar Sesión
        userNavItem.innerHTML = `
            <a class="nav-link active dropdown-toggle" href="#" id="navbarDropdownUser" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-fill"></i> ${nombreUsuario}
            </a>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDropdownUser">
                <li><a class="dropdown-item" href="#" id="cerrarSesionBtn"><i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión</a></li>
            </ul>
        `;
        
        // 3. Asignar el evento de Cierre de Sesión
        const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Limpia los datos de sesión y redirige
                localStorage.removeItem('usuarioNombre');
                localStorage.removeItem('sesionIniciada');
                // Al cerrar sesión, lo llevamos a inicio.html
                window.location.href = 'inicio.html'; 
            });
        }

    } else {
        // SESIÓN INACTIVA:
        
        // Asegurar que el botón de Iniciar Sesión sea visible
        loginNavItem.style.display = 'block';
        
        // Ocultar el placeholder del nombre de usuario
        userNavItem.style.display = 'none';
    }
});