// Configuration de l'API
const API_URL = 'https://portfolio-backend-syhd.onrender.com/api';

// Variables globales
let currentUser = null;
let dashboardStats = null;
let visitsChart = null;

// Récupérer le token d'authentification
function getAuthToken() {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

// Vérifier l'authentification
function checkAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Headers pour les requêtes authentifiées
function getAuthHeaders() {
    return {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

// Fonction pour faire des requêtes API
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            // Token invalide, rediriger vers login
            logout();
            return null;
        }

        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
    } catch (error) {
        console.error('Erreur API:', error);
        showNotification('Erreur de connexion au serveur', 'error');
        return null;
    }
}

// Notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Charger le profil utilisateur
async function loadUserProfile() {
    const result = await fetchAPI('/profile');
    if (result && result.ok) {
        currentUser = result.data;
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('profileRole').textContent = currentUser.role_id === 1 ? 'Admin' : 'Utilisateur';
    }
}

// Charger les statistiques du dashboard
async function loadDashboardStats() {
    const result = await fetchAPI('/admin/stats/dashboard');
    if (result && result.ok) {
        dashboardStats = result.data;
        
        // Mettre à jour les cartes de stats
        document.getElementById('totalVisits').textContent = dashboardStats.general_stats.total_visits;
        document.getElementById('totalContacts').textContent = dashboardStats.general_stats.total_contacts;
        document.getElementById('todayVisits').textContent = dashboardStats.general_stats.today_visits;
        
        // Badge de nouveaux contacts
        const newContacts = dashboardStats.general_stats.today_contacts;
        const badge = document.getElementById('contactBadge');
        badge.textContent = newContacts;
        badge.style.display = newContacts > 0 ? 'block' : 'none';
        
        // Charger le graphique des visites
        loadVisitsChart(dashboardStats.last_7_days);
        
        // Charger les pages populaires
        loadPopularPages(dashboardStats.popular_pages);
    }
}

// Charger les stats en temps réel
async function loadRealTimeStats() {
    const result = await fetchAPI('/admin/stats/realtime');
    if (result && result.ok) {
        document.getElementById('onlineUsers').textContent = result.data.online_last_5_min;
    }
}

// Graphique des visites des 7 derniers jours
function loadVisitsChart(data) {
    const ctx = document.getElementById('visitsChart');
    
    if (visitsChart) {
        visitsChart.destroy();
    }
    
    const labels = data.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
    });
    
    const values = data.map(item => item.visits);
    
    visitsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Visites',
                data: values,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Afficher les pages populaires
function loadPopularPages(pages) {
    const container = document.getElementById('popularPages');
    
    if (!pages || pages.length === 0) {
        container.innerHTML = '<p style="color: #64748b;">Aucune donnée disponible</p>';
        return;
    }
    
    const maxVisits = Math.max(...pages.map(p => p.visits));
    
    container.innerHTML = '<ul class="page-list">' + 
        pages.slice(0, 5).map(page => `
            <li class="page-item">
                <span>${page.page_visited || 'Page inconnue'}</span>
                <strong>${page.visits}</strong>
            </li>
            <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${(page.visits / maxVisits) * 100}%"></div>
            </div>
        `).join('') + 
    '</ul>';
}

// Charger les contacts
async function loadContacts() {
    const result = await fetchAPI('/admin/contacts');
    const container = document.getElementById('contactsList');
    
    if (!result || !result.ok) {
        container.innerHTML = '<div class="loader">Erreur de chargement des messages</div>';
        return;
    }
    
    const contacts = result.data;
    
    if (contacts.length === 0) {
        container.innerHTML = '<div class="loader">Aucun message pour le moment</div>';
        return;
    }
    
    container.innerHTML = contacts.map(contact => `
        <div class="contact-card" data-id="${contact.id}">
            <div class="contact-header">
                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p>${contact.email}</p>
                </div>
                <div class="contact-meta">
                    <div class="contact-date">${formatDate(contact.created_at)}</div>
                    ${contact.replied ? 
                        '<span class="badge-replied">Répondu</span>' : 
                        '<span class="badge-new">Nouveau</span>'
                    }
                </div>
            </div>
            <div class="contact-body">
                <div class="contact-subject">${contact.subject}</div>
                <div class="contact-message">${contact.message}</div>
            </div>
            <div class="contact-actions">
                ${!contact.replied ? 
                    `<button class="btn-primary" onclick="openReplyModal(${contact.id})">
                        <i class="fas fa-reply"></i> Répondre
                    </button>` : ''
                }
                <button class="btn-danger" onclick="deleteContact(${contact.id})">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `).join('');
    
    // Afficher les contacts récents sur le dashboard
    loadRecentContacts(contacts.slice(0, 5));
}

// Afficher les contacts récents
function loadRecentContacts(contacts) {
    const container = document.getElementById('recentContacts');
    
    if (contacts.length === 0) {
        container.innerHTML = '<p style="color: #64748b;">Aucun message récent</p>';
        return;
    }
    
    container.innerHTML = contacts.map(contact => `
        <div class="contact-card">
            <div class="contact-header">
                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p>${contact.email}</p>
                </div>
                <div class="contact-meta">
                    <div class="contact-date">${formatDate(contact.created_at)}</div>
                </div>
            </div>
            <div class="contact-body">
                <div class="contact-subject">${contact.subject}</div>
                <div class="contact-message">${truncateText(contact.message, 100)}</div>
            </div>
        </div>
    `).join('');
}

// Ouvrir le modal de réponse
async function openReplyModal(contactId) {
    const result = await fetchAPI(`/admin/contacts/${contactId}`);
    
    if (!result || !result.ok) {
        showNotification('Erreur de chargement du message', 'error');
        return;
    }
    
    const contact = result.data;
    const modal = document.getElementById('replyModal');
    const details = document.getElementById('messageDetails');
    
    details.innerHTML = `
        <h4>Message de ${contact.name}</h4>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Sujet:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
    `;
    
    document.getElementById('replyContactId').value = contactId;
    document.getElementById('replyMessage').value = '';
    modal.classList.add('active');
}

// Fermer le modal
function closeReplyModal() {
    document.getElementById('replyModal').classList.remove('active');
}

// Envoyer la réponse
async function sendReply(e) {
    e.preventDefault();
    
    const contactId = document.getElementById('replyContactId').value;
    const message = document.getElementById('replyMessage').value;
    
    if (!message.trim()) {
        showNotification('Veuillez écrire une réponse', 'error');
        return;
    }
    
    const result = await fetchAPI(`/admin/contacts/${contactId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply_message: message })
    });
    
    if (result && result.ok) {
        showNotification('Réponse envoyée avec succès!', 'success');
        closeReplyModal();
        loadContacts();
    } else {
        showNotification('Erreur lors de l\'envoi de la réponse', 'error');
    }
}

// Supprimer un contact
async function deleteContact(contactId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
        return;
    }
    
    const result = await fetchAPI(`/admin/contacts/${contactId}`, {
        method: 'DELETE'
    });
    
    if (result && result.ok) {
        showNotification('Message supprimé avec succès', 'success');
        loadContacts();
    } else {
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Charger les statistiques détaillées
async function loadDetailedStats() {
    if (!dashboardStats) return;
    
    // Navigateurs
    const browsersContainer = document.getElementById('browsersStats');
    if (dashboardStats.browsers && dashboardStats.browsers.length > 0) {
        const maxBrowser = Math.max(...dashboardStats.browsers.map(b => b.visits));
        browsersContainer.innerHTML = dashboardStats.browsers.map(browser => `
            <div class="stat-item">
                <span>${browser.browser || 'Inconnu'}</span>
                <strong>${browser.visits}</strong>
            </div>
            <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${(browser.visits / maxBrowser) * 100}%"></div>
            </div>
        `).join('');
    } else {
        browsersContainer.innerHTML = '<p style="color: #64748b;">Aucune donnée</p>';
    }
    
    // Appareils
    const devicesContainer = document.getElementById('devicesStats');
    if (dashboardStats.devices && dashboardStats.devices.length > 0) {
        const maxDevice = Math.max(...dashboardStats.devices.map(d => d.visits));
        devicesContainer.innerHTML = dashboardStats.devices.map(device => `
            <div class="stat-item">
                <span>${device.device || 'Inconnu'}</span>
                <strong>${device.visits}</strong>
            </div>
            <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${(device.visits / maxDevice) * 100}%"></div>
            </div>
        `).join('');
    } else {
        devicesContainer.innerHTML = '<p style="color: #64748b;">Aucune donnée</p>';
    }
    
    // Pays
    const countriesContainer = document.getElementById('countriesStats');
    if (dashboardStats.visits_by_country && dashboardStats.visits_by_country.length > 0) {
        const maxCountry = Math.max(...dashboardStats.visits_by_country.map(c => c.visits));
        countriesContainer.innerHTML = dashboardStats.visits_by_country.slice(0, 10).map(country => `
            <div class="stat-item">
                <span>${country.country || 'Inconnu'}</span>
                <strong>${country.visits}</strong>
            </div>
            <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${(country.visits / maxCountry) * 100}%"></div>
            </div>
        `).join('');
    } else {
        countriesContainer.innerHTML = '<p style="color: #64748b;">Aucune donnée</p>';
    }
}

// Charger les visites
async function loadVisits() {
    const result = await fetchAPI('/admin/stats/visits');
    const tbody = document.getElementById('visitsTableBody');
    
    if (!result || !result.ok) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Erreur de chargement</td></tr>';
        return;
    }
    
    const visits = result.data.data || [];
    
    if (visits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucune visite enregistrée</td></tr>';
        return;
    }
    
    tbody.innerHTML = visits.map(visit => `
        <tr>
            <td>${formatDate(visit.created_at)}</td>
            <td>${visit.page_visited || 'N/A'}</td>
            <td>${visit.country || 'N/A'}</td>
            <td>${visit.browser || 'N/A'}</td>
            <td>${visit.device || 'N/A'}</td>
        </tr>
    `).join('');
}

// Déconnexion
async function logout() {
    await fetchAPI('/logout', { method: 'POST' });
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
    
    window.location.href = '/x9v2lq_p8z3t_admin_core_hidden_panel/auth/login.html';
}

// Navigation dans la sidebar
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const sectionName = item.dataset.section;
            
            // Mettre à jour la navigation active
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Afficher la section correspondante
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${sectionName}-section`).classList.add('active');
            
            // Mettre à jour le titre
            const titles = {
                'dashboard': 'Tableau de bord',
                'contacts': 'Messages de contact',
                'stats': 'Statistiques détaillées',
                'visits': 'Journal des visites',
                'profile': 'Mon profil'
            };
            document.getElementById('pageTitle').textContent = titles[sectionName];
            
            // Charger les données spécifiques
            if (sectionName === 'contacts') {
                loadContacts();
            } else if (sectionName === 'stats') {
                loadDetailedStats();
            } else if (sectionName === 'visits') {
                loadVisits();
            }
            
            // Fermer la sidebar sur mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
}

// Menu toggle pour mobile
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
    
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

// Utilitaires
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'authentification
    if (!checkAuth()) return;
    
    // Configurer la navigation
    setupNavigation();
    setupMobileMenu();
    
    // Charger les données
    loadUserProfile();
    loadDashboardStats();
    loadRealTimeStats();
    loadContacts();
    
    // Actualiser les stats en temps réel toutes les 30 secondes
    setInterval(loadRealTimeStats, 30000);
    
    // Bouton de déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            logout();
        }
    });
    
    // Bouton refresh
    document.getElementById('refreshBtn').addEventListener('click', () => {
        location.reload();
    });
    
    // Bouton refresh contacts
    document.getElementById('refreshContacts').addEventListener('click', () => {
        loadContacts();
    });
    
    // Modal de réponse
    document.getElementById('closeModal').addEventListener('click', closeReplyModal);
    document.getElementById('cancelReply').addEventListener('click', closeReplyModal);
    document.getElementById('replyForm').addEventListener('submit', sendReply);
    
    // Fermer le modal en cliquant en dehors
    document.getElementById('replyModal').addEventListener('click', (e) => {
        if (e.target.id === 'replyModal') {
            closeReplyModal();
        }
    });
});