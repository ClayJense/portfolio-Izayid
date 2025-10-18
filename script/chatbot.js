document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://portfolio-backend-syhd.onrender.com/api';

  let conversationHistory = [];
  let isOpen = false;

  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const typingIndicator = document.getElementById('typingIndicator');
  const promoBubble = document.getElementById('promoBubble');

  if (!chatToggle || !chatWindow) {
    console.warn("⚠️ Chatbot non initialisé : éléments manquants dans le DOM.");
    return;
  }

  const promoMessages = [
    "👋 Salut, je suis Nora !<br><small>Clique pour découvrir mon créateur 😊</small>",
    "✨ Besoin d'infos sur Izayid ?<br><small>Je suis là pour toi ! 💬</small>",
    "🚀 Curieux de connaître les projets d'Izayid ?<br><small>Discute avec moi ! 😄</small>",
    "💡 Une question ? Un projet ?<br><small>Je suis ton assistante IA ! 🤖</small>"
  ];

  let promoIndex = 0;
  setInterval(() => {
    if (!isOpen && promoBubble) {
      promoIndex = (promoIndex + 1) % promoMessages.length;
      promoBubble.innerHTML = promoMessages[promoIndex];
    }
  }, 5000);

  chatToggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.classList.toggle('active');
    chatToggle.classList.toggle('active');
    
    if (isOpen) {
      promoBubble.classList.add('hidden');
      chatInput.focus();
      if (conversationHistory.length === 0) {
        loadWelcomeMessage();
      }
    } else {
      setTimeout(() => promoBubble.classList.remove('hidden'), 300);
    }
  });

  async function loadWelcomeMessage() {
    try {
      const response = await fetch(`${API_URL}/chat/welcome`);
      const data = await response.json();
      if (data.success) addMessage('nora', data.response);
    } catch {
      addMessage('nora', "Salut, moi c'est Nora 👋 — comment puis-je t'aider ?");
    }
  }

  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'nora' ? '🤖' : '👤';
    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    conversationHistory.push({
      role: sender === 'user' ? 'user' : 'assistant',
      content: text
    });
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    addMessage('user', message);
    chatInput.value = '';
    typingIndicator.classList.add('active');
    try {
      const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ message, conversation_history: conversationHistory })
      });
      const data = await response.json();
      typingIndicator.classList.remove('active');
      if (data.success) setTimeout(() => addMessage('nora', data.response), 500);
      else addMessage('nora', "Oups ! J'ai rencontré un petit problème. Réessaye !");
    } catch (error) {
      console.error('Erreur:', error);
      typingIndicator.classList.remove('active');
      addMessage('nora', "Désolée, je ne peux pas me connecter pour le moment. 🌟");
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  promoBubble.addEventListener('click', () => { if (!isOpen) chatToggle.click(); });
});
