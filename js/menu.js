document.querySelector('.icono-menu').addEventListener('click', function() {
    
    this.classList.toggle("change");

    // Alternamos estilos para el menú y body
    document.querySelector('#menu').classList.toggle('active');
    document.body.classList.toggle('opacity');

})