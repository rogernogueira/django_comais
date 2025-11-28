document.addEventListener("DOMContentLoaded", function () {
    // Detecta se estamos em uma subpasta para ajustar os caminhos das imagens
    const isPagesDir = window.location.pathname.includes("/pages/");
    const pathPrefix = isPagesDir ? "../../assets/" : "assets/";

    const footerHTML = `
    <footer class="mt-20 w-full relative overflow-hidden">
      <!-- Background com gradiente sutil -->
      <div class="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-elevated to-bg-base opacity-95"></div>
      
      <!-- Borda superior com gradiente -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      
      <div class="relative max-w-7xl mx-auto px-8 py-16">
        
        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          <!-- Card 1: UFT -->
          <div class="group bg-bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
            <div class="flex flex-col items-center justify-center h-full gap-4">
              <a href="https://ww2.uft.edu.br/" target="_blank" 
                 class="transition-all duration-300 hover:scale-110 hover:-rotate-3">
                <img src="${pathPrefix}logo_uft.svg" alt="UFT"  class="max-h-[150px] opacity-90 hover:opacity-100 filter drop-shadow-lg">
              </a>
              
             
              
              <!-- Indicador visual -->
              <div class="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity mt-2">
                <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div class="w-2 h-2 bg-primary rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-primary rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>

          <!-- Card 2: COMAIS -->
          <div class="group bg-bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
            <div class="flex flex-col items-center justify-center h-full gap-4">
              <a href="https://comais.uft.edu.br" target="_blank" 
                 class="transition-all duration-300 hover:scale-110 hover:rotate-3">
                <img src="${pathPrefix}logo_comais.svg" alt="COMAIS" class="max-h-[150px] w-auto opacity-90 hover:opacity-100 filter drop-shadow-lg">
              </a>
              
            
              
              <!-- Linha decorativa -->
              <div class="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all"></div>
            </div>
          </div>

          <!-- Card 3: Desenvolvedor -->
          <div class="group bg-bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20 md:col-span-2 lg:col-span-1">
            <div class="flex flex-col h-full justify-center">
              <!-- Badge superior -->
              <div class="inline-flex items-center gap-2 mb-4 self-start">
                <span class="text-xs font-bold text-primary uppercase tracking-wider">Desenvolvido por</span>
              </div>
              
              <h3 class="text-md font-bold text-white mb-2">
                Dr. Rogério Nogueira de Sousa
              </h3>
              <p class="text-sm text-text-secondary leading-relaxed mb-2">
                  Programa de Pós-Graduação em Governança e Transformação Digital  - PPGGTD
                </p>
              
              <!-- Links com ícones -->
              <div class="flex flex-col gap-3">
                <a href="mailto:roger@uft.edu.br" 
                   class="group/email flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-all p-2 rounded-lg hover:bg-primary/10">
                  <div class="p-2 bg-primary/10 rounded-lg group-hover/email:bg-primary/20 transition-colors">
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span class="font-medium">roger@uft.edu.br</span>
                  <svg class="w-4 h-4 ml-auto opacity-0 group-hover/email:opacity-100 group-hover/email:translate-x-1 transition-all" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
                
                <a href="http://lattes.cnpq.br/1141051053490143" target="_blank" 
                   class="group/lattes flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-all p-2 rounded-lg hover:bg-primary/10">
                  <div class="p-2 bg-primary/10 rounded-lg group-hover/lattes:bg-primary/20 transition-colors">
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <span class="font-medium">Currículo Lattes</span>
                  <svg class="w-4 h-4 ml-auto opacity-0 group-hover/lattes:opacity-100 group-hover/lattes:translate-x-1 transition-all" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- Copyright Section -->
        <div class="relative">
          <!-- Linha superior com gradiente -->
          <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <div class="pt-8 text-center">
            <div class="flex items-center justify-center gap-3 mb-2">
              <div class="h-px w-12 bg-gradient-to-r from-transparent to-primary/30"></div>
              <svg class="w-4 h-4 text-primary/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              <div class="h-px w-12 bg-gradient-to-l from-transparent to-primary/30"></div>
            </div>
            
            <p class="text-xs text-text-muted font-medium">
              &copy; 2025 Estatística Interativa. Todos os direitos reservados.
            </p>
            
            <!-- Year indicator animado -->
            <div class="mt-3 flex items-center justify-center gap-1">
              <div class="w-1 h-1 bg-primary/30 rounded-full"></div>
              <div class="w-1 h-1 bg-primary/50 rounded-full"></div>
              <div class="w-1 h-1 bg-primary/70 rounded-full"></div>
            </div>
          </div>
        </div>

      </div>
    </footer>

    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    </style>
    `;

    // Insere o rodapé no final do body se ele ainda não existir
    if (!document.querySelector('footer')) {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    } else {
        console.log("Footer already exists, skipping dynamic insertion.");
    }
});
