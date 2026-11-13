// Prevenir recarga del formulario por defecto y mostrar alerta de confirmación
document.addEventListener("DOMContentLoaded", () => {
    
    const quoteForm = document.getElementById('quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí se integrará la lógica para enviar el correo o conectar a la base de datos
            alert('¡Formulario enviado! Su solicitud de cotización será procesada a la brevedad.');
            
            // Limpia los campos después de enviar
            this.reset();
        });
    }
});