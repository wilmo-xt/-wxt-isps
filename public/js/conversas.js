// Chat Anônimo - JavaScript
class AnonymousChat {
    constructor() {
        this.messages = [];
        this.users = new Set();
        this.currentUser = this.generateAnonymousName();
        this.typingUsers = new Set();
        this.typingTimeout = null;
        this.isTyping = false;
        
        this.initializeElements();
        this.bindEvents();
        this.simulateOnlineUsers();
        this.startHeartbeat();
        
        console.log(`Você está conectado como: ${this.currentUser}`);
    }
    
    initializeElements() {
        // Elementos principais
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.imageUploadBtn = document.getElementById('imageUploadBtn');
        this.imageInput = document.getElementById('imageInput');
        this.onlineCount = document.getElementById('onlineCount');
        this.charCount = document.getElementById('charCount');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        // Modal de imagem
        this.imageModal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalClose = document.getElementById('modalClose');
        this.modalBackdrop = document.getElementById('modalBackdrop');
        
        // Preview de upload
        this.uploadPreview = document.getElementById('uploadPreview');
        this.previewImage = document.getElementById('previewImage');
        this.previewSend = document.getElementById('previewSend');
        this.previewCancel = document.getElementById('previewCancel');
        
        this.currentImageFile = null;
    }
    
    bindEvents() {
        // Envio de mensagem
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize do textarea
        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateCharCount();
            this.handleTyping();
        });
        
        // Upload de imagem
        this.imageUploadBtn.addEventListener('click', () => {
            this.imageInput.click();
        });
        
        this.imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
        
        // Modal de imagem
        this.modalClose.addEventListener('click', () => this.closeImageModal());
        this.modalBackdrop.addEventListener('click', () => this.closeImageModal());
        
        // Preview de upload
        this.previewSend.addEventListener('click', () => this.sendImageMessage());
        this.previewCancel.addEventListener('click', () => this.cancelImageUpload());
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImageModal();
                this.cancelImageUpload();
            }
        });
    }
    
    generateAnonymousName() {
        const adjectives = [
            'Misterioso', 'Curioso', 'Brilhante', 'Criativo', 'Divertido',
            'Inteligente', 'Corajoso', 'Gentil', 'Sábio', 'Aventureiro',
            'Alegre', 'Calmo', 'Esperto', 'Amigável', 'Único'
        ];
        
        const nouns = [
            'Explorador', 'Pensador', 'Sonhador', 'Artista', 'Cientista',
            'Escritor', 'Músico', 'Viajante', 'Inventor', 'Filósofo',
            'Navegador', 'Descobridor', 'Criador', 'Observador', 'Visionário'
        ];
        
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const number = Math.floor(Math.random() * 999) + 1;
        
        return `${adjective}${noun}${number}`;
    }
    
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = count;
        
        if (count > 450) {
            this.charCount.style.color = '#ff6b6b';
        } else if (count > 400) {
            this.charCount.style.color = '#ffa500';
        } else {
            this.charCount.style.color = 'var(--text-muted)';
        }
    }
    
    handleTyping() {
        if (!this.isTyping && this.messageInput.value.trim()) {
            this.isTyping = true;
            this.broadcastTyping(true);
        }
        
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            if (this.isTyping) {
                this.isTyping = false;
                this.broadcastTyping(false);
            }
        }, 1000);
    }
    
    broadcastTyping(typing) {
        // Simula broadcast de digitação
        if (typing) {
            this.simulateOtherUserTyping();
        } else {
            this.hideTypingIndicator();
        }
    }
    
    simulateOtherUserTyping() {
        // Simula ocasionalmente outros usuários digitando
        if (Math.random() < 0.3) {
            setTimeout(() => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    if (Math.random() < 0.7) {
                        this.simulateIncomingMessage();
                    }
                }, 2000 + Math.random() * 3000);
            }, 500 + Math.random() * 2000);
        }
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;
        
        const message = {
            id: Date.now(),
            username: this.currentUser,
            text: text,
            timestamp: new Date(),
            isOwn: true
        };
        
        this.addMessage(message);
        this.messageInput.value = '';
        this.autoResizeTextarea();
        this.updateCharCount();
        
        // Simula resposta de outros usuários
        this.simulateResponse();
    }
    
    sendImageMessage() {
        if (!this.currentImageFile) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const message = {
                id: Date.now(),
                username: this.currentUser,
                image: e.target.result,
                timestamp: new Date(),
                isOwn: true
            };
            
            this.addMessage(message);
            this.cancelImageUpload();
            
            // Simula reação de outros usuários
            setTimeout(() => {
                this.simulateImageReaction();
            }, 1000 + Math.random() * 3000);
        };
        
        reader.readAsDataURL(this.currentImageFile);
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validação de arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('A imagem deve ter no máximo 5MB.');
            return;
        }
        
        this.currentImageFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.uploadPreview.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }
    
    cancelImageUpload() {
        this.uploadPreview.style.display = 'none';
        this.currentImageFile = null;
        this.imageInput.value = '';
    }
    
    addMessage(message) {
        this.messages.push(message);
        
        const messageElement = this.createMessageElement(message);
        
        // Remove mensagem de boas-vindas se existir
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Limita o número de mensagens para performance
        if (this.messages.length > 100) {
            this.messages.shift();
            const firstMessage = this.chatMessages.querySelector('.message');
            if (firstMessage) {
                firstMessage.remove();
            }
        }
    }
    
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.isOwn ? 'own' : ''}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        
        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'username';
        usernameSpan.textContent = message.username;
        
        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'timestamp';
        timestampSpan.textContent = this.formatTime(message.timestamp);
        
        headerDiv.appendChild(usernameSpan);
        headerDiv.appendChild(timestampSpan);
        contentDiv.appendChild(headerDiv);
        
        if (message.text) {
            const textDiv = document.createElement('div');
            textDiv.className = 'message-text';
            textDiv.textContent = message.text;
            contentDiv.appendChild(textDiv);
        }
        
        if (message.image) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'message-image';
            
            const img = document.createElement('img');
            img.src = message.image;
            img.alt = 'Imagem compartilhada';
            img.addEventListener('click', () => this.openImageModal(message.image));
            
            imageDiv.appendChild(img);
            contentDiv.appendChild(imageDiv);
        }
        
        messageDiv.appendChild(contentDiv);
        return messageDiv;
    }
    
    openImageModal(imageSrc) {
        this.modalImage.src = imageSrc;
        this.imageModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeImageModal() {
        this.imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    simulateIncomingMessage() {
        const responses = [
            'Olá pessoal! Como estão?',
            'Alguém aqui gosta de música?',
            'Que dia lindo hoje!',
            'Estou aprendendo programação 🚀',
            'Qual o filme favorito de vocês?',
            'Boa tarde, galera!',
            'Alguém quer conversar?',
            'Que legal esse chat!',
            'Como foi o dia de vocês?',
            'Estou aqui estudando...',
            'Quem mais está online?',
            'Vamos conversar sobre tecnologia?',
            'Adorei o design deste chat!',
            'Alguém aqui é do Brasil?',
            'Que horas são aí?'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const randomUser = this.generateAnonymousName();
        
        const message = {
            id: Date.now(),
            username: randomUser,
            text: randomResponse,
            timestamp: new Date(),
            isOwn: false
        };
        
        this.addMessage(message);
        this.users.add(randomUser);
        this.updateOnlineCount();
    }
    
    simulateImageReaction() {
        const reactions = [
            'Que foto legal! 📸',
            'Muito bonita essa imagem!',
            'Adorei a foto!',
            'Que lugar incrível!',
            'Foto top! 👏',
            'Que imagem interessante!',
            'Muito legal essa foto!'
        ];
        
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        const randomUser = this.generateAnonymousName();
        
        const message = {
            id: Date.now(),
            username: randomUser,
            text: randomReaction,
            timestamp: new Date(),
            isOwn: false
        };
        
        this.addMessage(message);
    }
    
    simulateResponse() {
        // 60% de chance de receber uma resposta
        if (Math.random() < 0.6) {
            setTimeout(() => {
                this.simulateIncomingMessage();
            }, 2000 + Math.random() * 5000);
        }
    }
    
    simulateOnlineUsers() {
        // Simula usuários online
        const baseUsers = Math.floor(Math.random() * 15) + 5; // 5-20 usuários
        this.users.add(this.currentUser);
        
        for (let i = 0; i < baseUsers; i++) {
            this.users.add(this.generateAnonymousName());
        }
        
        this.updateOnlineCount();
        
        // Simula flutuação de usuários
        setInterval(() => {
            if (Math.random() < 0.3) {
                if (Math.random() < 0.5 && this.users.size > 3) {
                    // Remove usuário
                    const usersArray = Array.from(this.users);
                    const randomUser = usersArray[Math.floor(Math.random() * usersArray.length)];
                    if (randomUser !== this.currentUser) {
                        this.users.delete(randomUser);
                    }
                } else if (this.users.size < 25) {
                    // Adiciona usuário
                    this.users.add(this.generateAnonymousName());
                }
                this.updateOnlineCount();
            }
        }, 10000 + Math.random() * 20000);
    }
    
    updateOnlineCount() {
        this.onlineCount.textContent = this.users.size;
    }
    
    startHeartbeat() {
        // Simula mensagens ocasionais de outros usuários
        setInterval(() => {
            if (Math.random() < 0.2) { // 20% de chance a cada intervalo
                this.simulateIncomingMessage();
            }
        }, 15000 + Math.random() * 30000); // 15-45 segundos
    }
    
    // Função para limpar dados (não armazena nada permanentemente)
    clearData() {
        this.messages = [];
        this.users.clear();
        this.users.add(this.currentUser);
        this.updateOnlineCount();
        
        // Limpa mensagens da tela
        const messages = this.chatMessages.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
        
        console.log('Dados limpos - nenhuma informação armazenada');
    }
}

// Inicializa o chat quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.chat = new AnonymousChat();
    
    // Adiciona algumas mensagens de exemplo após um tempo
    setTimeout(() => {
        if (window.chat.messages.length === 0) {
            window.chat.simulateIncomingMessage();
        }
    }, 3000);
    
    setTimeout(() => {
        if (window.chat.messages.length <= 1) {
            window.chat.simulateIncomingMessage();
        }
    }, 8000);
});

// Limpa dados quando a página é fechada (não armazena nada)
window.addEventListener('beforeunload', () => {
    if (window.chat) {
        window.chat.clearData();
    }
});

// Previne zoom no iOS quando focando inputs
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.addEventListener('touchstart', () => {}, true);
}

