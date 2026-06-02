import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2, Network, Sparkles, Users } from 'lucide-react'
import Marquee from 'react-fast-marquee'

import { Button } from '@/components/ui/button'
import type { NoticiaListItem, Paginated } from '@/types/api'

const PARCEIROS = [
  { nome: 'Universidade Federal do Tocantins', src: '/brand/partners/uft.png' },
  {
    nome: 'Programa de Pós-Graduação em Governança e Transformação Digital',
    src: '/brand/partners/logo_reduzida_400x300_transparente.png',
  },
  {
    nome: 'Fundação de Apoio Científico e Tecnológico do Tocantins',
    src: '/brand/partners/fapto.png',
  },
  { nome: 'Softex', src: '/brand/partners/softex.png' },
  { nome: 'Huawei', src: '/brand/partners/huawei.svg' },
] as const

const OBJETIVOS = [
  {
    number: '§ 01',
    title: 'Integração',
    accent: 'bg-brand-blue',
    icon: Network,
    description: 'Ser um ambiente que estimule a integração.',
  },
  {
    number: '§ 02',
    title: 'Multidisciplinaridade',
    accent: 'bg-brand-green',
    icon: Users,
    description:
      'Trabalhar multidisciplinaridade de forma colaborativa e criativa.',
  },
  {
    number: '§ 03',
    title: 'Inovação',
    accent: 'bg-brand-gold',
    icon: Sparkles,
    description: 'Propiciar a geração de projetos inovadores.',
  },
] as const

const DOMINIOS = ['Judicial', 'Segurança Pública', 'Ambiental', 'Social'] as const

const FULL_DATE_FMT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return FULL_DATE_FMT.format(d)
}

/**
 * Mosaico de pixels do hero — releitura, na paleta PPGGTD, das "tiles" em
 * cascata do hero da fireworks.ai. Triângulo no canto superior direito cuja
 * densidade/opacidade aumenta em direção ao canto.
 */
const MOSAIC_TILE = 34 // px (inclui 4px de respiro entre quadrados)
const MOSAIC_COLS = 12
const MOSAIC_ROWS = 9
const MOSAIC_ACCENTS: Record<string, string> = {
  '0-2': 'bg-brand-green',
  '1-4': 'bg-brand-gold',
  '2-1': 'bg-brand-gold',
  '3-5': 'bg-brand-green',
  '4-2': 'bg-brand-gold',
  '5-0': 'bg-brand-green',
}

function HeroMosaic() {
  const tiles = []
  for (let r = 0; r < MOSAIC_ROWS; r++) {
    for (let c = 0; c < MOSAIC_COLS; c++) {
      // intensidade cai conforme afasta do canto superior direito (c=0, r=0)
      const intensity = 1 - (c * 0.09 + r * 0.12)
      if (intensity <= 0.05) continue
      const color = MOSAIC_ACCENTS[`${r}-${c}`] ?? 'bg-brand-blue'
      tiles.push(
        <span
          key={`${r}-${c}`}
          className={`absolute ${color}`}
          style={{
            width: MOSAIC_TILE - 4,
            height: MOSAIC_TILE - 4,
            top: r * MOSAIC_TILE,
            right: c * MOSAIC_TILE,
            opacity: Math.min(0.85, intensity),
          }}
        />,
      )
    }
  }
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 z-0 hidden sm:block"
    >
      {tiles}
    </div>
  )
}

export function HomePage() {
  const [noticias, setNoticias] = useState<NoticiaListItem[] | null>(null)
  const [noticiasError, setNoticiasError] = useState<string | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/v1/noticias/?limit=2', { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as Paginated<NoticiaListItem>
      })
      .then((page) => setNoticias(page.results))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setNoticiasError(e instanceof Error ? e.message : 'erro desconhecido')
      })
    return () => ac.abort()
  }, [])

  return (
    <>
      {/* Hero — layout inspirado na fireworks.ai, adaptado à marca COMAIS/PPGGTD */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,theme(colors.brand-blue/10),transparent_60%)]"
        />
        <HeroMosaic />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-8 pt-12 sm:pb-12 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-blue">
                Laboratório de Inteligência Artificial · UFT
              </p>
              <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-[-0.02em] text-brand-text animation-slideInBottom sm:text-5xl lg:text-[4rem]">
                Modelagem Computacional de Soluções de{' '}
                <span className="text-brand-blue">Inteligência Artificial</span>
              </h1>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-gray sm:text-sm">
                Computational Modeling of AI Solutions
              </p>
              <p className="mt-6 hidden max-w-xl text-base leading-relaxed text-brand-gray">
                Laboratório multidisciplinar do{' '}
                <span className="font-semibold text-brand-text">
                  Programa de Pós-Graduação em Governança e Transformação Digital
                </span>{' '}
                da Universidade Federal do Tocantins.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button asChild size="lg" className="gap-2 rounded-none px-6 transition-all duration-150 ease-out hover:opacity-90">
                  <Link to="/projetos">
                    Conheça os projetos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="gap-2 rounded-none text-xs font-semibold uppercase tracking-[0.18em] text-brand-text transition-all duration-150 ease-out hover:text-brand-blue"
                >
                  <Link to="/sobre">Sobre o laboratório</Link>
                </Button>
              </div>
            </div>

            <div className="relative order-first flex justify-center lg:order-last">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,theme(colors.brand-blue/12),transparent_65%)] blur-2xl"
              />
              <img
                src="/brand/logo-comais1188x713.png"
                alt="COMAIS Lab — modelagem computacional de soluções de inteligência artificial"
                width={1188}
                height={713}
                className="h-auto w-full max-w-sm animate-hero-float drop-shadow-sm lg:max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Faixa de parceiros — marquee (análogo da logo cloud do fireworks) */}
      <section className="border-y border-slate-200 bg-white py-2">
        <p className="mb-3 text-center font-mono text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brand-gray">
          Parceiros
        </p>
        <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <Marquee autoFill pauseOnHover speed={40}>
            {PARCEIROS.map((p) => (
              <div key={p.nome} className="mx-12 flex items-center" title={p.nome}>
                <img
                  src={p.src}
                  alt={p.nome}
                  className="h-9 w-auto object-contain opacity-90 transition duration-300 hover:opacity-100 sm:h-12"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Notícias */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                Novidades
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
                Notícias do laboratório
              </h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-2 rounded-none text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue transition-all duration-150 ease-out hover:text-brand-blue/80">
              <Link to="/noticias">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {!noticias && !noticiasError && (
            <div className="mt-12 flex items-center gap-2 text-brand-gray">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando notícias…</span>
            </div>
          )}

          {noticias && noticias.length > 0 && (
            <div className="mt-12 space-y-8">
              {/* Primeira notícia — destaque em layout lado-a-lado */}
              {noticias[0] && (
                <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
                  <div className="grid gap-0 lg:grid-cols-2">
                    {noticias[0].imagem && (
                      <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:h-full">
                        <img
                          src={noticias[0].imagem}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-center gap-6 p-8 lg:p-10">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
                          {formatDate(noticias[0].data_publicacao)}
                        </p>
                        <h3 className="font-heading mt-3 text-2xl font-extrabold leading-tight text-brand-text sm:text-3xl">
                          {noticias[0].titulo}
                        </h3>
                      </div>
                      {noticias[0].resumo && (
                        <p className="text-base leading-relaxed text-brand-gray">
                          {noticias[0].resumo}
                        </p>
                      )}
                      <Button asChild size="sm" className="w-fit gap-2 rounded-none px-6 transition-all duration-150 ease-out hover:opacity-90">
                        <Link to="/noticias">
                          Ler notícia
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              )}

              {/* Segunda notícia — card compacto com imagem à direita */}
              {noticias[1] && (
                <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
                  <div className="flex flex-col gap-0 sm:grid sm:grid-cols-[2fr_1fr]">
                    <div className="flex flex-col justify-between gap-4 p-6 sm:order-first">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
                          {formatDate(noticias[1].data_publicacao)}
                        </p>
                        <h3 className="font-heading mt-2 text-lg font-bold text-brand-text">
                          {noticias[1].titulo}
                        </h3>
                      </div>
                      {noticias[1].resumo && (
                        <p className="text-sm leading-relaxed text-brand-gray line-clamp-2">
                          {noticias[1].resumo}
                        </p>
                      )}
                      <Link to="/noticias" className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue transition-colors hover:text-brand-blue/80">
                        Ler mais →
                      </Link>
                    </div>
                    {noticias[1].imagem && (
                      <div className="relative aspect-[16/9] overflow-hidden sm:aspect-auto sm:h-full sm:order-last">
                        <img
                          src={noticias[1].imagem}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                </article>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Sobre / Missão */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                Sobre
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
                Missão
              </h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-brand-gray">
              <p>
                A missão do laboratório COMAIS é{' '}
                <span className="text-brand-text">
                  catalisar a colaboração entre pesquisadores, empresas e
                  governo
                </span>
                , para formulação de soluções tecnológicas, que possuem seus
                valores agregados potencializados pelo uso de inteligência
                artificial.
              </p>
              <p>
                O laboratório tem em seu portfólio diversos projetos que usam
                técnicas de Inteligência Artificial. A concepção e modelagem
                desses projetos requerem uma equipe multidisciplinar, uma vez
                que são desenvolvidos para atuarem em diversas áreas de
                conhecimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objetivos / Pilares */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
            O COMAIS visa
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Três objetivos,
            <br />
            uma metodologia.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {OBJETIVOS.map(({ number, title, accent, icon: Icon, description }) => (
              <article
                key={title}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-md"
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 ${accent}`}
                />
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-brand-gray">
                    {number}
                  </span>
                  <Icon className="h-5 w-5 text-brand-gray transition-colors group-hover:text-brand-blue" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-brand-text">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-brand-gray">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Domínios de atuação */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                Áreas de atuação
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text">
                Onde aplicamos IA.
              </h2>
            </div>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-4 sm:grid-cols-4">
              {DOMINIOS.map((d, i) => (
                <li key={d} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-brand-gray">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-heading text-lg font-semibold text-brand-text">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
