const API_URL = 'https://portfolio-backend-syhd.onrender.com/api';

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnContent = submitBtn.innerHTML;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Récupérer les données du formulaire
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Désactiver le bouton pendant l'envoi
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Succès - Afficher le message de confirmation
                showSuccessMessage(data.message);
                
                // Réinitialiser le formulaire
                contactForm.reset();
            } else {
                // Erreur de validation
                if (data.errors) {
                    showErrorMessage(formatErrors(data.errors));
                } else {
                    showErrorMessage('Une erreur est survenue. Veuillez réessayer.');
                }
            }
        } catch (error) {
            console.error('Erreur:', error);
            showErrorMessage('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
        } finally {
            // Réactiver le bouton
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
});

// Fonction pour afficher un message de succès
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    // Faire défiler jusqu'au message
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Fonction pour afficher un message d'erreur
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    // Faire défiler jusqu'au message
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Fonction pour formater les erreurs de validation
function formatErrors(errors) {
    const errorMessages = Object.values(errors).flat();
    return errorMessages.join('<br>');
}