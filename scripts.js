/**
 * ========================================
 * PORTFÓLIO PESSOAL - JAVASCRIPT
 * ========================================
 * Script principal para gerenciar a navegação e interações
 * Autor: Célio Marcos Moreira Santiago - UNINTER
 * Versão: 1.0
 */

// Aguarda o carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // SELEÇÃO DE ELEMENTOS DO DOM
    // ========================================
    
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const header = document.querySelector('.main-header');
    const submitButton = document.querySelector('.submit-button');
    const contactForm = document.querySelector('.contact-form');
    
    // ========================================
    // NAVEGAÇÃO ENTRE SEÇÕES
    // ========================================
    
    /**
     * Esconde todas as seções e remove a classe 'active' dos links
     */
    function hideAllSections() {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    }
    
    /**
     * Mostra a seção especificada e marca o link como ativo
     * @param {string} sectionId - ID da seção a ser exibida
     */
    function showSection(sectionId) {
        hideAllSections();
        
        // Encontra e ativa a seção
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Marca o link correspondente como ativo
            const targetLink = document.querySelector(`a[href="${sectionId}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
            }
            
            // Rola suavemente até o topo da seção
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    
    // Adiciona evento de clique em cada link de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);
            
            // Salva a seção atual no localStorage
            localStorage.setItem('currentSection', targetId);
        });
    });
    
    // ========================================
    // PERSISTÊNCIA DE NAVEGAÇÃO
    // ========================================
    
    /**
     * Restaura a última seção visitada ao recarregar a página
     */
    function restoreLastSection() {
        const lastSection = localStorage.getItem('currentSection');
        if (lastSection) {
            showSection(lastSection);
        } else {
            // Se não houver seção salva, mostra "Sobre Mim"
            showSection('#sobre');
        }
    }
    
    // Restaura a última seção visitada
    restoreLastSection();
    
    // ========================================
    // EFEITO DE SCROLL NO HEADER
    // ========================================
    
    /**
     * Adiciona sombra ao header quando a página é rolada
     */
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona ou remove classe baseado no scroll
        if (scrollTop > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ========================================
    // VALIDAÇÃO E ENVIO DO FORMULÁRIO
    // ========================================
    
    /**
     * Manipula o envio do formulário com Formspree
     */
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-button');
    
    if (form) {
        async function handleSubmit(event) {
            event.preventDefault();
            
            // Obtém os valores dos campos para validação
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            
            // Validação básica
            if (nome.length < 3) {
                showFormMessage('Por favor, insira um nome válido (mínimo 3 caracteres).', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Por favor, insira um email válido.', 'error');
                return;
            }
            
            if (mensagem.length < 10) {
                showFormMessage('Por favor, escreva uma mensagem mais detalhada (mínimo 10 caracteres).', 'error');
                return;
            }
            
            // Mostra estado de envio
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            submitBtn.classList.add('sending');
            
            // Envia o formulário
            const data = new FormData(event.target);
            
            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Sucesso
                    showFormMessage('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                    form.reset();
                    
                    // Efeito de sucesso
                    form.classList.add('form-success');
                    setTimeout(() => {
                        form.classList.remove('form-success');
                    }, 1000);
                } else {
                    // Erro no servidor
                    const errorData = await response.json();
                    if (errorData.errors) {
                        const errorMessages = errorData.errors.map(error => error.message).join(', ');
                        showFormMessage(`❌ Erro: ${errorMessages}`, 'error');
                    } else {
                        showFormMessage('❌ Oops! Houve um problema ao enviar sua mensagem. Tente novamente.', 'error');
                    }
                }
            } catch (error) {
                // Erro de rede
                showFormMessage('❌ Erro de conexão. Verifique sua internet e tente novamente.', 'error');
                console.error('Erro ao enviar formulário:', error);
            } finally {
                // Restaura o botão
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensagem';
                submitBtn.classList.remove('sending');
            }
        }
        
        // Adiciona o listener do formulário
        form.addEventListener('submit', handleSubmit);
    }
    
    /**
     * Exibe mensagem de status do formulário
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo da mensagem (success, error)
     */
    function showFormMessage(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Remove a mensagem após 5 segundos se for sucesso
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
    
    /**
     * Valida formato de email
     * @param {string} email - Email a ser validado
     * @returns {boolean} - True se o email for válido
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ========================================
    // ANIMAÇÕES E INTERAÇÕES
    // ========================================
    
    /**
     * Anima as barras de nível de idiomas quando visíveis
     */
    function animateLanguageBars() {
        const languageBars = document.querySelectorAll('.level-fill');
        
        languageBars.forEach(bar => {
            // Salva a largura original
            const width = bar.style.width;
            
            // Reset a largura para 0
            bar.style.width = '0';
            
            // Anima após um pequeno delay
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }
    
    // Anima as barras quando a seção de formação é exibida
    document.querySelector('a[href="#formacao"]').addEventListener('click', function() {
        setTimeout(animateLanguageBars, 100);
    });
    
    // ========================================
    // EFEITOS VISUAIS NOS PROJETOS
    // ========================================
    
    /**
     * Adiciona efeito de parallax aos ícones dos projetos
     */
    const projectIcons = document.querySelectorAll('.project-icon');
    
    projectIcons.forEach(icon => {
        icon.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            this.style.transform = `
                perspective(1000px)
                rotateY(${deltaX * 10}deg)
                rotateX(${-deltaY * 10}deg)
                scale(1.1)
            `;
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
        });
    });
    
    // ========================================
    // LAZY LOADING DE IMAGENS
    // ========================================
    
    /**
     * Implementa lazy loading para otimizar carregamento
     */
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ========================================
    // MODO ESCURO (PREPARAÇÃO FUTURA)
    // ========================================
    
    /**
     * Preparação para implementação de modo escuro
     * Atualmente o site já usa tema escuro por padrão
     */
    function toggleDarkMode() {
        document.body.classList.toggle('light-mode');
        const isDarkMode = !document.body.classList.contains('light-mode');
        localStorage.setItem('darkMode', isDarkMode);
    }
    
    // ========================================
    // ACESSIBILIDADE
    // ========================================
    
    /**
     * Melhora a navegação por teclado
     */
    document.addEventListener('keydown', function(e) {
        // Navegação por setas entre seções
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const activeLink = document.querySelector('.nav-link.active');
            const allLinks = Array.from(navLinks);
            const currentIndex = allLinks.indexOf(activeLink);
            
            let newIndex;
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % allLinks.length;
            } else {
                newIndex = (currentIndex - 1 + allLinks.length) % allLinks.length;
            }
            
            allLinks[newIndex].click();
        }
        
        // Tecla ESC fecha formulários ou modais
        if (e.key === 'Escape') {
            // Implementar fechamento de modais futuros
        }
    });
    
    // ========================================
    // MENSAGENS DE FEEDBACK
    // ========================================
    
    /**
     * Exibe mensagens de feedback ao usuário
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo da mensagem (success, error, info)
     */
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `feedback-message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
    
    // ========================================
    // PERFORMANCE
    // ========================================
    
    /**
     * Debounce para otimizar eventos de scroll e resize
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Otimiza eventos de redimensionamento
    const optimizedResize = debounce(() => {
        // Código para lidar com redimensionamento
        console.log('Janela redimensionada');
    }, 250);
    
    window.addEventListener('resize', optimizedResize);
    
    // ========================================
    // CONSOLE EASTER EGG
    // ========================================
    
    console.log('%c🚀 Bem-vindo ao meu portfólio!', 
        'font-size: 20px; color: #2563eb; font-weight: bold;');
    console.log('%c💻 Desenvolvido com HTML, CSS e JavaScript puro', 
        'font-size: 14px; color: #10b981;');
    console.log('%c📧 Entre em contato: celiomarcos@gmail.com', 
        'font-size: 14px; color: #94a3b8;');
});
