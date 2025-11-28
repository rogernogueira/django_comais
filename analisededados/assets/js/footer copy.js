document.addEventListener("DOMContentLoaded", function () {
    // Detecta se estamos em uma subpasta para ajustar os caminhos das imagens
    // Lógica simples: se o URL contém "/pages/", precisamos subir dois níveis "../../"
    // Se estiver na raiz (index.html ou anomalia.html etc), usa "assets/"

    const isPagesDir = window.location.pathname.includes("/pages/");
    const pathPrefix = isPagesDir ? "../../assets/" : "assets/";

    const footerHTML = `
    <footer class="mt-20 w-full border-t border-primary/20 bg-bg-surface/95 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row justify-between items-center gap-8">

          <!-- Logos e Instituição -->
          <div class="flex flex-col md:flex-row items-center gap-8">
            <!-- Logos -->
            <div class="flex items-center gap-6">
                 <a href="https://ww2.uft.edu.br/" target="_blank" class="transition-transform hover:scale-105">
                    <img src="${pathPrefix}logo_uft.svg" alt="UFT" class="h-16 w-auto opacity-90 hover:opacity-100">
                 </a>
                 <div class="h-12 w-px bg-white/10 hidden md:block"></div>
                 <a href="https://comais.uft.edu.br" target="_blank" class="transition-transform hover:scale-105">
                    <img src="${pathPrefix}logo_comais.svg" alt="COMAIS" class="h-14 w-auto opacity-90 hover:opacity-100">
                 </a>
            </div>

            <!-- Texto Laboratório -->
            <!-- Texto Laboratório -->
            <div class="text-center md:text-left">
                <a href="https://comais.uft.edu.br" target="_blank" class="group flex items-center justify-center md:justify-start gap-2 text-lg font-bold text-white hover:text-primary transition-colors">
                    <span>Laboratório COMAIS</span>
                    <svg class="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                </a>
                <p class="text-sm text-text-secondary">Computação, Modelagem e Inteligência de Sistemas</p>
                <p class="text-xs text-text-muted mt-1">Universidade Federal do Tocantins</p>
            </div>
          </div>

          <!-- Desenvolvedor -->
          <div class="flex flex-col items-center md:items-end text-center md:text-right">
              <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1">Desenvolvido por</p>
              <h3 class="text-lg font-bold text-white">Dr. Rogério Nogueira de Sousa</h3>
              <div class="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                  <a href="mailto:roger@uft.edu.br" class="flex items-center gap-2 hover:text-primary transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      roger@uft.edu.br
                  </a>
                  <span class="text-white/20">•</span>
                  <a href="http://lattes.cnpq.br/1141051053490143" target="_blank" class="flex items-center gap-2 hover:text-primary transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      Currículo Lattes
                  </a>
              </div>
          </div>

        </div>

        <!-- Copyright -->
        <div class="mt-12 pt-8 border-t border-white/5 text-center text-xs text-text-muted">
          <p>&copy; 2025 Estatística Interativa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
    `;

    // Insere o rodapé no final do body se ele ainda não existir
    if (!document.querySelector('footer')) {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    } else {
        // Se já existir um footer (ex: estático no index.html), podemos optar por substituir ou não fazer nada.
        // Neste caso, para evitar duplicidade em páginas que já tenham o footer hardcoded, 
        // vamos assumir que o script é para páginas que NÃO têm footer ou para substituir um placeholder.
        // Mas como queremos padronizar, podemos forçar a substituição se o footer existente tiver uma classe específica ou ID.
        // Por segurança, vamos apenas adicionar se não houver.
        console.log("Footer already exists, skipping dynamic insertion.");
    }
});
