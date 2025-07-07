// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // Seleciona todos os links de navegação e seções de conteúdo
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Função para esconder todas as seções e remover a classe 'active' dos links
    function hideAllSections() {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Adiciona um evento de clique a cada link da navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Previne o comportamento padrão do link (que seria rolar a página)
            event.preventDefault();

            // Esconde todas as seções e desativa todos os links
            hideAllSections();

            // Adiciona a classe 'active' ao link clicado
            this.classList.add('active');

            // Obtém o ID da seção alvo a partir do atributo href do link
            const targetId = this.getAttribute('href');
            
            // Seleciona a seção de conteúdo correspondente
            const targetSection = document.querySelector(targetId);

            // Se a seção alvo existir, adiciona a classe 'active' para exibi-la
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Garante que a primeira seção ("Sobre Mim") esteja visível ao carregar a página
    // O estado inicial já é definido no HTML, mas isso serve como uma garantia.
    if (document.querySelector('#sobre')) {
        document.querySelector('#sobre').classList.add('active');
    }
    if (document.querySelector('a[href="#sobre"]')) {
        document.querySelector('a[href="#sobre"]').classList.add('active');
    }
});
