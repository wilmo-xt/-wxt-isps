/* ========================================== */
/* SISTEMA DE GAMIFICAÇÃO - CONTADOR DE MOEDAS */
/* ========================================== */

// Variáveis globais do sistema
let coinCount = 0.000;
let currentSection = 1;
let maxSections = 6;
let scrollThreshold = 100; // pixels para ganhar moeda
let lastScrollY = 0;
let isScrolling = false;
let sessionStartTime = Date.now();

// Configurações do sistema
const COIN_CONFIG = {
    scrollReward: 0.001,      // Moedas por scroll
    clickReward: 0.005,       // Moedas por clique em anúncio
    sectionReward: 0.010,     // Moedas por nova seção desbloqueada
    maxCoins: 10.000,         // Meta de moedas
    scrollCooldown: 500,      // Cooldown entre scrolls (ms)
    notificationDuration: 1500 // Duração da notificação (ms)
};

// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    initializeGamificationSystem();
});

// ========================================
// INICIALIZAÇÃO DO SISTEMA
// ========================================

function initializeGamificationSystem() {
    console.log('🎮 Sistema de Gamificação Inicializado');
    
    // Inicializar componentes
    initializeCoinCounter();
    initializeScrollTracking();
    initializeAdClickTracking();
    initializeLazySections();
    initializePageVisibility();
    
    // Mostrar primeira seção
    showSection(1);
    
    // Verificar status dos anúncios após 3 segundos
    setTimeout(checkAdsStatus, 3000);
    
    // Salvar progresso periodicamente
    setInterval(saveProgress, 10000); // A cada 10 segundos
    
    console.log('💰 Sistema de moedas ativo - Meta: 10.000 moedas');
}

// ========================================
// CONTADOR DE MOEDAS
// ========================================

function initializeCoinCounter() {
    // Carregar progresso salvo (se houver)
    loadProgress();
    
    // Atualizar display inicial
    updateCoinDisplay();
    updateProgressBar();
    
    // Adicionar evento de clique no contador
    const coinPopup = document.getElementById('coin-counter-popup');
    if (coinPopup) {
        coinPopup.addEventListener('click', function() {
            showCoinAnimation();
        });
    }
}

function addCoins(amount, reason = 'ação') {
    if (coinCount >= COIN_CONFIG.maxCoins) {
        showMaxCoinsReached();
        return;
    }
    
    coinCount += amount;
    
    // Limitar ao máximo
    if (coinCount > COIN_CONFIG.maxCoins) {
        coinCount = COIN_CONFIG.maxCoins;
    }
    
    // Atualizar displays
    updateCoinDisplay();
    updateProgressBar();
    
    // Mostrar notificação
    showNotification(`+${amount.toFixed(3)} moedas!`, reason);
    
    // Verificar se atingiu a meta
    if (coinCount >= COIN_CONFIG.maxCoins) {
        showMaxCoinsReached();
    }
    
    // Salvar progresso
    saveProgress();
    
    console.log(`💰 +${amount.toFixed(3)} moedas por ${reason}. Total: ${coinCount.toFixed(3)}`);
}

function updateCoinDisplay() {
    const coinAmountElement = document.getElementById('coin-amount');
    if (coinAmountElement) {
        coinAmountElement.textContent = coinCount.toFixed(3);
        
        // Animação de atualização
        coinAmountElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            coinAmountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const percentage = (coinCount / COIN_CONFIG.maxCoins) * 100;
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
    }
}

// ========================================
// TRACKING DE SCROLL
// ========================================

function initializeScrollTracking() {
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        if (isScrolling) return;
        
        const currentScrollY = window.pageYOffset;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);
        
        // Verificar se rolou o suficiente
        if (scrollDifference >= scrollThreshold) {
            isScrolling = true;
            
            // Adicionar moedas por scroll
            addCoins(COIN_CONFIG.scrollReward, 'scroll');
            
            // Verificar se deve mostrar nova seção
            checkSectionUnlock();
            
            // Atualizar última posição
            lastScrollY = currentScrollY;
            
            // Cooldown
            setTimeout(() => {
                isScrolling = false;
            }, COIN_CONFIG.scrollCooldown);
        }
        
        // Debounce para otimização
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            checkVisibleSections();
        }, 100);
    });
}

function checkSectionUnlock() {
    const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
    const targetSection = Math.floor((scrollPercent / 100) * maxSections) + 1;
    
    if (targetSection > currentSection && targetSection <= maxSections) {
        unlockSection(targetSection);
    }
}

function unlockSection(sectionNumber) {
    if (sectionNumber <= currentSection) return;
    
    currentSection = sectionNumber;
    showSection(sectionNumber);
    
    // Recompensa por desbloquear nova seção
    addCoins(COIN_CONFIG.sectionReward, `nova seção ${sectionNumber}`);
    
    console.log(`🔓 Seção ${sectionNumber} desbloqueada!`);
}

function showSection(sectionNumber) {
    const section = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (section && section.style.display === 'none') {
        section.style.display = 'block';
        
        // Animação de entrada
        setTimeout(() => {
            section.classList.add('visible');
        }, 100);
        
        // Efeito especial para nova seção
        if (sectionNumber > 1) {
            section.style.animation = 'slideInUp 0.8s ease-out';
        }
    }
}

function checkVisibleSections() {
    const sections = document.querySelectorAll('.lazy-section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !section.classList.contains('visible')) {
            section.classList.add('visible');
        }
    });
}

// ========================================
// TRACKING DE CLIQUES EM ANÚNCIOS
// ========================================

function initializeAdClickTracking() {
    // Adicionar listeners para anúncios clicáveis
    const clickableAds = document.querySelectorAll('.clickable-ad');
    
    clickableAds.forEach(ad => {
        ad.addEventListener('click', function(e) {
            // Prevenir clique duplo
            if (this.classList.contains('clicked')) return;
            
            this.classList.add('clicked');
            
            // Adicionar moedas por clique
            addCoins(COIN_CONFIG.clickReward, 'clique em anúncio');
            
            // Efeito visual
            showClickEffect(e.pageX, e.pageY);
            
            // Remover classe após cooldown
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 2000);
            
            console.log('🎯 Anúncio clicado!');
        });
        
        // Efeito hover especial
        ad.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        ad.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function showClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.innerHTML = '💰+0.005';
    effect.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        color: #FFD700;
        font-weight: bold;
        font-size: 18px;
        pointer-events: none;
        z-index: 20000;
        animation: floatUp 2s ease-out forwards;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 2000);
}

// ========================================
// SISTEMA DE NOTIFICAÇÕES
// ========================================

function showNotification(text, reason = '') {
    const notification = document.getElementById('notification-popup');
    const notificationText = document.getElementById('notification-text');
    
    if (notification && notificationText) {
        notificationText.textContent = text;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, COIN_CONFIG.notificationDuration);
    }
}

function showMaxCoinsReached() {
    const notification = document.getElementById('notification-popup');
    const notificationText = document.getElementById('notification-text');
    
    if (notification && notificationText) {
        notificationText.innerHTML = '🎉 META ATINGIDA! Tire um print e envie via WhatsApp!';
        notification.classList.add('show');
        
        // Efeito especial
        notification.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.98), rgba(255, 140, 0, 0.98))';
        notification.style.border = '3px solid #FFD700';
        notification.style.animation = 'pulse 1s infinite';
        
        setTimeout(() => {
            notification.classList.remove('show');
            notification.style.animation = '';
        }, 5000);
    }
    
    // Destacar botão WhatsApp
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.style.animation = 'pulse 1s infinite';
        whatsappBtn.innerHTML = '📱 <span>ENVIAR PRINT AGORA!</span>';
    }
}

function showCoinAnimation() {
    const coinIcon = document.querySelector('.coin-icon');
    if (coinIcon) {
        coinIcon.style.animation = 'bounce 0.6s ease-out';
        setTimeout(() => {
            coinIcon.style.animation = 'bounce 2s infinite';
        }, 600);
    }
}

// ========================================
// LAZY LOADING DE SEÇÕES
// ========================================

function initializeLazySections() {
    // Esconder todas as seções exceto a primeira
    const sections = document.querySelectorAll('.lazy-section');
    sections.forEach((section, index) => {
        const sectionNumber = parseInt(section.dataset.section);
        if (sectionNumber > 1) {
            section.style.display = 'none';
            section.classList.add('hidden');
        }
    });
    
    console.log('📱 Sistema de carregamento gradual ativado');
}

// ========================================
// CONTROLE DE VISIBILIDADE DA PÁGINA
// ========================================

function initializePageVisibility() {
    // Detectar quando usuário sai da página
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('⚠️ Usuário saiu da página - progresso pode ser perdido');
            showWarningNotification();
        } else {
            console.log('👁️ Usuário voltou à página');
            // Verificar se deve resetar (opcional)
            checkSessionValidity();
        }
    });
    
    // Detectar tentativa de sair da página
    window.addEventListener('beforeunload', function(e) {
        const message = 'ATENÇÃO: Se sair da página, perderá todo o progresso das moedas!';
        e.returnValue = message;
        return message;
    });
}

function showWarningNotification() {
    showNotification('⚠️ Não saia da página!', 'aviso');
}

function checkSessionValidity() {
    const sessionDuration = Date.now() - sessionStartTime;
    const maxSessionTime = 30 * 60 * 1000; // 30 minutos
    
    if (sessionDuration > maxSessionTime) {
        console.log('⏰ Sessão expirada - considerando reset');
        // Opcional: resetar progresso após muito tempo
    }
}

// ========================================
// SISTEMA DE PERSISTÊNCIA
// ========================================

function saveProgress() {
    const progressData = {
        coins: coinCount,
        section: currentSection,
        timestamp: Date.now(),
        sessionStart: sessionStartTime
    };
    
    try {
        localStorage.setItem('coinProgress', JSON.stringify(progressData));
        console.log('💾 Progresso salvo');
    } catch (e) {
        console.warn('⚠️ Erro ao salvar progresso:', e);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('coinProgress');
        if (saved) {
            const data = JSON.parse(saved);
            const timeDiff = Date.now() - data.timestamp;
            
            // Verificar se não passou muito tempo (1 hora)
            if (timeDiff < 60 * 60 * 1000) {
                coinCount = data.coins || 0;
                currentSection = data.section || 1;
                console.log('📂 Progresso carregado:', data);
            } else {
                console.log('⏰ Progresso expirado - iniciando do zero');
                localStorage.removeItem('coinProgress');
            }
        }
    } catch (e) {
        console.warn('⚠️ Erro ao carregar progresso:', e);
    }
}

// ========================================
// CARREGAMENTO DINÂMICO DE CONTEÚDO
// ========================================

function loadMoreContent() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const btnText = loadMoreBtn.querySelector('.btn-text');
    const btnIcon = loadMoreBtn.querySelector('.btn-icon');
    
    // Animação de loading
    btnText.textContent = 'Carregando...';
    btnIcon.style.animation = 'rotate 1s linear infinite';
    loadMoreBtn.disabled = true;
    
    // Adicionar moedas por interação
    addCoins(COIN_CONFIG.sectionReward, 'carregar mais conteúdo');
    
    // Simula carregamento (3 segundos)
    setTimeout(() => {
        // Adiciona novo conteúdo com anúncios
        addNewContentWithAds();
        
        // Restaura botão
        btnText.textContent = 'Carregar Mais Conteúdo';
        btnIcon.style.animation = '';
        loadMoreBtn.disabled = false;
        
        console.log('📱 Novo conteúdo carregado');
    }, 3000);
}

function addNewContentWithAds() {
    const adsContainer = document.querySelector('.ads-feed');
    const newSectionHTML = `
        <section class="feed-section visible" style="opacity: 0; transform: translateY(30px);">
            <div class="section-header">
                <h2 class="section-title">
                    <span class="section-icon">🆕</span>
                    Conteúdo Novo - Mais Moedas!
                </h2>
                <span class="section-badge">Novo</span>
            </div>
            
            <div class="ad-container featured clickable-ad">
                <div class="ad-label">Conteúdo Patrocinado - Clique para ganhar moedas!</div>
                <div class="native-ad-wrapper">
                    <div class="ad-placeholder">
                        <script async="async" data-cfasync="false" src="//pl27238573.profitableratecpm.com/34b49a846483ba0a3d10f74ef2ee93d5/invoke.js"></script>
                        <div id="container-34b49a846483ba0a3d10f74ef2ee93d5-new-${Date.now()}"></div>
                    </div>
                </div>
            </div>
            
            <div class="content-grid">
                <article class="content-card">
                    <div class="card-image">
                        <div class="image-placeholder">
                            <span class="placeholder-icon">💰</span>
                        </div>
                        <div class="card-category">Moedas</div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Continue Ganhando Moedas!</h3>
                        <p class="card-description">
                            Cada scroll e clique te aproxima da meta de 10.000 moedas.
                        </p>
                        <div class="card-meta">
                            <span class="meta-item">
                                <span class="meta-icon">💰</span>
                                <span>+0.001 por scroll</span>
                            </span>
                            <span class="meta-item">
                                <span class="meta-icon">🎯</span>
                                <span>+0.005 por clique</span>
                            </span>
                        </div>
                    </div>
                </article>
                
                <div class="ad-container inline clickable-ad">
                    <div class="ad-label">Patrocinado - Clique para ganhar moedas!</div>
                    <div class="native-ad-wrapper">
                        <div class="ad-placeholder">
                            <script async="async" data-cfasync="false" src="//pl27238573.profitableratecpm.com/34b49a846483ba0a3d10f74ef2ee93d5/invoke.js"></script>
                            <div id="container-34b49a846483ba0a3d10f74ef2ee93d5-extra-${Date.now()}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Insere antes do botão "Carregar Mais"
    const loadMoreSection = document.querySelector('.load-more-section');
    loadMoreSection.insertAdjacentHTML('beforebegin', newSectionHTML);
    
    // Anima o novo conteúdo
    setTimeout(() => {
        const newSection = document.querySelector('.feed-section:last-of-type');
        newSection.style.opacity = '1';
        newSection.style.transform = 'translateY(0)';
        
        // Reativar tracking para novos anúncios
        initializeAdClickTracking();
    }, 100);
}

// ========================================
// VERIFICAÇÃO DE STATUS DOS ANÚNCIOS
// ========================================

function checkAdsStatus() {
    console.log('🔍 Verificando status dos anúncios...');
    
    const adContainers = document.querySelectorAll('.ad-container');
    const stats = {
        total: adContainers.length,
        loaded: 0,
        blocked: 0
    };
    
    adContainers.forEach(container => {
        const adContent = container.querySelector('[id^="container-34b49a846483ba0a3d10f74ef2ee93d5"]');
        if (adContent && adContent.children.length > 0) {
            stats.loaded++;
        } else {
            stats.blocked++;
            // Adicionar placeholder visual
            if (adContent) {
                adContent.innerHTML = `
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100px;
                        background: rgba(255, 215, 0, 0.1);
                        border: 2px dashed rgba(255, 215, 0, 0.3);
                        border-radius: 8px;
                        color: #FFD700;
                        font-size: 14px;
                        font-weight: 600;
                    ">
                        <span>💰 Espaço Publicitário - Clique para ganhar moedas!</span>
                    </div>
                `;
            }
        }
    });
    
    console.log('📊 Estatísticas dos anúncios:', stats);
    
    // Atualizar estatísticas na sidebar
    updateSidebarStats(stats);
}

function updateSidebarStats(stats) {
    const statsElements = document.querySelectorAll('.stat-value');
    if (statsElements.length >= 3) {
        statsElements[0].textContent = stats.total; // Anúncios Ativos
        statsElements[1].textContent = '∞'; // Moedas Disponíveis
        statsElements[2].textContent = Math.floor(coinCount * 1000); // Progresso
    }
}

// ========================================
// UTILITÁRIOS E ANIMAÇÕES
// ========================================

// Adicionar CSS para animação floatUp
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
    
    .clickable-ad.clicked {
        animation: pulse 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// ========================================
// EVENTOS GLOBAIS
// ========================================

// Redimensionamento da janela
window.addEventListener('resize', function() {
    console.log('📱 Janela redimensionada');
    updateProgressBar();
});

// Detectar inatividade
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        showNotification('💤 Continue rolando para ganhar mais moedas!', 'lembrete');
    }, 30000); // 30 segundos
}

document.addEventListener('scroll', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
resetInactivityTimer();

// ========================================
// CONSOLE LOGS INFORMATIVOS
// ========================================

console.log(`
🎮 ===== SISTEMA DE GAMIFICAÇÃO ATIVO =====
💰 Meta: 10.000 moedas
📈 Recompensas:
   • Scroll: +0.001 moedas
   • Clique em anúncio: +0.005 moedas
   • Nova seção: +0.010 moedas
📱 WhatsApp: +258857270435
⚠️ IMPORTANTE: Não saia da página!
==========================================
`);

// Exporta funções para uso global
window.gamificationSystem = {
    addCoins,
    showNotification,
    loadMoreContent,
    checkAdsStatus,
    saveProgress,
    loadProgress
};

