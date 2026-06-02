# COMAIS — Design & Effects Specification

Especificação visual e de efeitos do site baseada na adaptação do layout fireworks.ai (junho 2026).

---

## 🎨 Paleta de Cores (PPGGTD/COMAIS)

| Uso | Valor HSL | Valor Hex | CSS Var |
|-----|-----------|-----------|---------|
| **Primary (Azul)** | `hsl(211 38% 52%)` | `#5B84B1` | `--color-brand-blue` |
| **Secondary (Ouro)** | `hsl(47 48% 69%)` | `#D6C68B` | `--color-brand-gold` |
| **Accent (Verde)** | `hsl(107 20% 65%)` | `#9CB994` | `--color-brand-green` |
| **Text (Cinza)** | — | `#5A5B5D` | `--color-brand-gray` |
| **Text (Escuro)** | — | `#333333` | `--color-brand-text` |
| **Background** | `hsl(0 0% 100%)` | `#FFFFFF` | — |

---

## 📐 Tipografia

### Fontes
- **Display / Headings**: `Montserrat` (wght 600, 700, 800)
- **Body / UI**: `Open Sans` (wght 400, 500, 600)
- **Labels / Eyebrows**: `system-ui` monospace, uppercase, tracking `0.18–0.28em`

### Escalas

| Elemento | Tamanho | Peso | Leading | Tracking | Notas |
|----------|---------|------|---------|----------|-------|
| **H1 Hero** | 3.75rem (lg) / 2.5rem (mobile) | 800 | 1.04 | -0.02em | Condensado, entrada suave |
| **H2** | 2rem | 700 | — | — | Seções |
| **Eyebrow** | 0.7rem | 600 | — | 0.28em | Maiúsculas, mono, brand-blue |
| **Body** | 1rem | 400–500 | 1.6–1.7 | — | Open Sans |
| **Button** | 0.875–1rem | 600 | — | — | Rounded-none, transição 150ms |

---

## 🎬 Animações & Efeitos

### Hero Section

#### H1 "Modelagem Computacional..."
- **Animation**: `slideInBottom` 0.5s cubic-bezier(0.33, 1, 0.68, 1)
- **Keyframes**:
  ```css
  @keyframes slideInBottom {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  ```
- **Trigger**: On page load (aplicada via `animation-slideInBottom` classe)
- **Effect**: Texto sobe da base com fade suave, easing snappy

#### Logo (COMAISLAB na direita)
- **Animation**: `hero-float` 6s ease-in-out infinite
- **Keyframes**:
  ```css
  @keyframes hero-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  ```
- **Effect**: Logo flutua suavemente; cria movimento delicado

#### Mosaico de Pixels (canto superior direito)
- **Type**: Decorativo (gradiente visual, não animado)
- **Colors**: brand-blue (ouro/verde acentos) com opacidade fade
- **Effect**: Tiles em cascata diagonal, esmaecimento natural (mask-image)
- **Purpose**: Reforça tema "infraestrutura/compute"

### Botões/CTAs

#### Estado Normal
- **Color**: brand-blue (`#5B84B1`)
- **Background**: solid blue ou transparent (outline)
- **Border-radius**: `0px` (sharp, assinatura)
- **Padding**: `12px 16px` (CTA) / standard (outline)

#### Hover/Focus
- **Transition**: `all 150ms cubic-bezier(0.4, 0, 0.2, 1)` (material design)
- **Primary CTA**: opacity → 90% (sutil)
- **Ghost/Link**: color → brand-blue (elevação)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` — material motion suave

### Faixa de Parceiros (Marquee)

#### Logos
- **Default**: `opacity-90` (sutil, discreto)
- **Hover**: `opacity-100` (realce)
- **Transition**: `duration-300` (suave)
- **Height**: `h-12 sm:h-16` (normalizado, unificado)
- **Scroll**: `react-fast-marquee` com `autoFill`, `pauseOnHover`, `speed={40}`
- **Masking**: `mask-image: linear-gradient(to_right, transparent, black 10%, black 90%, transparent)` (fade bordas)

---

## 🏗️ Layout & Spacing

### Container
- **Max-width**: `6xl` (1152px)
- **Padding horizontal**: `1.5rem` (mobile) / respira nos lados
- **Grid-cols**: `[1.1fr_0.9fr]` (texto 55%, visual 45%)

### Hero Section
- **Padding-top**: `4rem` (mobile `pt-16`) / `5rem+ sm` (sm:pt-20)
- **Padding-bottom**: `3rem` (mobile `pb-12`) / `4rem+ sm` (sm:pb-16)
- **Gap**: `gap-12` (entre colunas)
- **Total Height**: ~500–600px (cabendo hero + parceiros na dobra de 900px)

### Parceiros Marquee
- **Padding-y**: `1.5rem` (py-6) / `2rem sm` (sm:py-8)
- **Logo Height**: `h-12` (mobile) / `h-16 sm` (tablet+)
- **Spacing**: `mx-12` entre logos
- **Total Height**: ~150px (compacto)

### Dobra (Fold)
- **Viewport**: 900px (desktop padrão)
- **Hero + Parceiros cabem**: ✅ SIM (estimado 650–750px total)
- **Princípio**: Hero + logo cloud visíveis sem scroll, como fireworks.ai

---

## 📱 Breakpoints (Tailwind v4)

| Class Prefix | Min-width | Uso |
|--------------|-----------|-----|
| (default) | 0px | Mobile first |
| `sm:` | 640px | Tablets |
| `lg:` | 1024px | Desktops |
| `xl:` | 1280px | Wide screens |

---

## 🎯 Comportamento Responsivo

### Mobile (< 640px)
- Hero H1: `text-4xl` (reduzido)
- Logo coluna: `order-first` (logo sobe, texto cai)
- Mosaico: `hidden sm:block` (não aparece)
- Parceiros logos: `h-12` (menores)
- Tipografia: eyebrow, buttons em sizing reduzido

### Tablet / Desktop
- Hero H1: `lg:text-[3.75rem]` (grande, impactante)
- Logo coluna: `order-last` (à direita)
- Mosaico: visível, decoração em cascata
- Parceiros logos: `sm:h-16` (maiores)

---

## ✨ Assinaturas de Design (Key Decisions)

1. **Border-radius = 0** (botões, cards)  
   Cantos vivos = estética computacional/moderna, referência fireworks

2. **Dual typography** (Montserrat + Open Sans)  
   Headings humanistas (Montserrat) vs corpo direto (Open Sans) = contraste legível

3. **Mosaico pixel** (top-right do hero)  
   Tiles em cascata diagonal = motivo visual "modelagem", reforça marca COMAIS

4. **Light theme + contraste alto**  
   Fundo branco, texto quase-preto, acento azul sólido = legibilidade, profissional

5. **Efeitos suaves** (not gratuitous)  
   slideInBottom (H1), float (logo), transições 150ms (botões)  
   → movimento delicado, não distrator

6. **Logo cloud grayscale hover** (parceiros)  
   Subtil, fireworks-like, integra marcas externas sem competition

---

## 🔧 Implementação (CSS/Tailwind)

### Animações Registradas
```css
/* index.css @theme */
--animate-slideInBottom: slideInBottom 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards;
--animate-hero-float: hero-float 6s ease-in-out infinite;

@keyframes slideInBottom {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes hero-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Classes Utilitárias
- `animation-slideInBottom` → H1 hero
- `animation-hero-float` → logo hero
- `transition-all duration-150 ease-out` → CTAs
- `opacity-90 hover:opacity-100 transition-opacity duration-300` → logos parceiros

---

## 📋 Checklist de Conformidade

- [x] Hero cabe na dobra (900px) + marquee logo abaixo
- [x] Animação de entrada (slideInBottom) no H1
- [x] Transições suaves nos botões (150ms cubic-bezier)
- [x] Logo flutua (hero-float continuous)
- [x] Mosaico visual (tiles cascata, sem animação)
- [x] Marquee de parceiros (autoFill, pauseOnHover, mask-fade)
- [x] Tipografia dual (Montserrat + Open Sans)
- [x] Paleta PPGGTD (azul, ouro, verde, cinza)
- [x] Responsivo (mobile-first, breakpoints sm/lg)
- [x] Border-radius = 0 (assinatura sharp)

---

**Última atualização**: 2 de junho de 2026  
**Versão**: 1.0 (initial spec)  
**Referência**: fireworks.ai (adaptação visual + efeitos)
