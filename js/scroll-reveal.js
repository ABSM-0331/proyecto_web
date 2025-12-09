// js/scroll-reveal.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleccionar todos los elementos que queremos animar.
    const targets = document.querySelectorAll('.animate-on-scroll');
    
    // 2. Definir las opciones para el Intersection Observer.
    // El threshold de 0.2 significa que la animación se disparará cuando el 20% del elemento sea visible.
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 
    };

    // 3. Definir la función que se ejecuta cuando un elemento entra o sale del viewport.
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el elemento es visible, agregamos la clase 'is-visible'
                entry.target.classList.add('is-visible');
                // Dejamos de observarlo, ya que solo queremos que la animación se dispare una vez.
                observer.unobserve(entry.target);
            }
        });
    };

    // 4. Crear la instancia del observador.
    const observer = new IntersectionObserver(observerCallback, options);

    // 5. Aplicar el observador a cada elemento objetivo.
    targets.forEach(target => {
        observer.observe(target);
    });
});