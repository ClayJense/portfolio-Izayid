// Configuration de l'API
const API_URL = 'https://portfolio-backend-syhd.onrender.com/api';

// Éléments du DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loginBtn = document.getElementById('loginBtn');
const btnText = loginBtn.querySelector('.btn-text');
const btnLoader = loginBtn.querySelector('.btn-loader');
const alertMessage = document.getElementById('alertMessage');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Fonction pour afficher les messages d'alerte
function showAlert(message, type = 'error') {
    alertMessage.textContent = message;
    alertMessage.className = `alert show ${type}`;
    
    setTimeout(() => {
        alertMessage.className = 'alert';
    }, 5000);
}

// Fonction pour afficher les erreurs de champs
function showFieldError(field, message) {
    const input = field === 'email' ? emailInput : passwordInput;
    const errorElement = field === 'email' ? emailError : passwordError;
    
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Fonction pour réinitialiser les erreurs
function clearErrors() {
    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');
    emailError.classList.remove('show');
    passwordError.classList.remove('show');
    alertMessage.classList.remove('show');
}

// Fonction pour activer/désactiver le bouton de chargement
function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
    } else {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Fonction pour sauvegarder le token
function saveToken(token, rememberMe) {
    if (rememberMe) {
        localStorage.setItem('auth_token', token);
    } else {
        sessionStorage.setItem('auth_token', token);
    }
}

// Fonction pour sauvegarder les données utilisateur
function saveUserData(user) {
    const userData = JSON.stringify(user);
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('user_data', userData);
    } else {
        sessionStorage.setItem('user_data', userData);
    }
}

// Fonction de connexion
async function handleLogin(e) {
    e.preventDefault();
    
    // Réinitialiser les erreurs
    clearErrors();
    
    // Récupérer les valeurs
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;
    
    // Validation côté client
    if (!email) {
        showFieldError('email', 'L\'email est requis');
        return;
    }
    
    if (!password) {
        showFieldError('password', 'Le mot de passe est requis');
        return;
    }
    
    // Activer le chargement
    setLoading(true);
    
    try {
        // Envoi de la requête au backend
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Gérer les erreurs de validation
            if (data.errors) {
                if (data.errors.email) {
                    showFieldError('email', data.errors.email[0]);
                }
                if (data.errors.password) {
                    showFieldError('password', data.errors.password[0]);
                }
            } else if (data.message) {
                showAlert(data.message, 'error');
            } else {
                showAlert('Les identifiants sont incorrects', 'error');
            }
            return;
        }
        
        // Connexion réussie
        showAlert('Connexion réussie ! Redirection...', 'success');
        
        // Sauvegarder le token et les données utilisateur
        saveToken(data.access_token, rememberMe);
        saveUserData(data.user);
        
        // Redirection vers le tableau de bord après 1 seconde
        setTimeout(() => {
            window.location.href = '/x9v2lq_p8z3t_admin_core_hidden_panel/index.html'; // Changez selon votre URL de dashboard
        }, 1000);
        
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
        setLoading(false);
    }
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
function checkIfLoggedIn() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (token) {
        // Rediriger vers le dashboard si déjà connecté
        window.location.href = '/x9v2lq_p8z3t_admin_core_hidden_panel/index.html';
    }
}

// Écouteur d'événements pour le formulaire
loginForm.addEventListener('submit', handleLogin);

// Réinitialiser les erreurs lors de la saisie
emailInput.addEventListener('input', () => {
    emailInput.classList.remove('error');
    emailError.classList.remove('show');
});

passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('error');
    passwordError.classList.remove('show');
});

// Vérifier la connexion au chargement
checkIfLoggedIn();

// Fonction utilitaire pour récupérer le token (à utiliser dans d'autres pages)
function getAuthToken() {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

// Fonction utilitaire pour se déconnecter (à utiliser dans le dashboard)
async function logout() {
    const token = getAuthToken();
    
    if (!token) return;
    
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    } finally {
        // Nettoyer le stockage local
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_data');
        
        // Rediriger vers la page de connexion
        window.location.href = '/x9v2lq_p8z3t_admin_core_hidden_panel/auth/login.html';
    }
}

// Exporter les fonctions utilitaires si vous utilisez des modules
// export { getAuthToken, logout };