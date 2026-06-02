import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Database, ExternalLink, FileText, LifeBuoy, Loader2, Network, Sparkles, Users } from 'lucide-react'
import Marquee from 'react-fast-marquee'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NoticiaListItem, ProjetoListItem, TipoProjeto, Colaborador, Paginated } from '@/types/api'

function stripHtml(value: string | null | undefined) {
  if (!value) return ''
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]!)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

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

type Servico = {
  name: string
  url: string
  external: boolean
  description: string
  icon: typeof Database
}

const SERVICOS: Servico[] = [
  {
    name: 'RedCap',
    url: 'http://redcap.comais.uft.edu.br/',
    external: true,
    description: 'Plataforma web segura para construir e gerenciar bancos de dados e pesquisas online.',
    icon: Database,
  },
  {
    name: 'Conversor PDF',
    url: 'http://pdf.comais.uft.edu.br',
    external: true,
    description: 'Converte arquivos PDF para padrão PDFa e aplica OCR automaticamente.',
    icon: FileText,
  },
  {
    name: 'Smart Review',
    url: 'http://sr.comais.uft.edu.br',
    external: true,
    description: 'Ferramenta de apoio ao processo de revisão bibliográfica.',
    icon: Sparkles,
  },
  {
    name: 'Apoio técnico',
    url: '/registro-ocorrencias',
    external: false,
    description: 'Registro e acompanhamento de solicitações técnicas em pesquisas.',
    icon: LifeBuoy,
  },
]

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
  const [projetos, setProjetos] = useState<ProjetoListItem[] | null>(null)
  const [projetosError, setProjetosError] = useState<string | null>(null)
  const [tipos, setTipos] = useState<TipoProjeto[] | null>(null)
  const [selectedTipoId, setSelectedTipoId] = useState<number | null>(null)
  const [equipe, setEquipe] = useState<Colaborador[] | null>(null)
  const [equipeError, setEquipeError] = useState<string | null>(null)

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

  useEffect(() => {
    const ac = new AbortController()
    Promise.all([
      fetch('/api/v1/projetos/', { signal: ac.signal }).then(async (r) => {
        if (!r.ok) throw new Error(`projetos HTTP ${r.status}`)
        return (await r.json()) as Paginated<ProjetoListItem>
      }),
      fetch('/api/v1/tipos-projeto/', { signal: ac.signal }).then(async (r) => {
        if (!r.ok) throw new Error(`tipos HTTP ${r.status}`)
        return (await r.json()) as Paginated<TipoProjeto>
      }),
    ])
      .then(([pPage, tPage]) => {
        setProjetos(pPage.results)
        setTipos(tPage.results)
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setProjetosError(e instanceof Error ? e.message : 'erro desconhecido')
      })
    return () => ac.abort()
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/v1/colaboradores/?limit=4', { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as Paginated<Colaborador>
      })
      .then((page) => setEquipe(page.results))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setEquipeError(e instanceof Error ? e.message : 'erro desconhecido')
      })
    return () => ac.abort()
  }, [])

  const counts = new Map<number, number>()
  if (projetos) {
    for (const p of projetos) {
      for (const t of p.type) {
        counts.set(t.id, (counts.get(t.id) ?? 0) + 1)
      }
    }
  }

  const filteredProjetos = (() => {
    if (!projetos) return null
    if (selectedTipoId === null) return projetos.slice(0, 3)
    return projetos.filter((p) => p.type.some((t) => t.id === selectedTipoId)).slice(0, 3)
  })()

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

      {/* Projetos */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                Portfólio
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
                Projetos em desenvolvimento
              </h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-2 rounded-none text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue transition-all duration-150 ease-out hover:text-brand-blue/80">
              <Link to="/projetos">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {!projetos && !projetosError && (
            <div className="mt-12 flex items-center gap-2 text-brand-gray">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando projetos…</span>
            </div>
          )}

          {projetos && tipos && tipos.length > 0 && (
            <nav
              aria-label="Filtrar por tipo de projeto"
              className="mb-8 mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-6"
            >
              <button
                type="button"
                onClick={() => setSelectedTipoId(null)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedTipoId === null
                    ? 'bg-brand-blue text-white'
                    : 'bg-slate-100 text-brand-text hover:bg-brand-blue/10 hover:text-brand-blue'
                }`}
              >
                <span>Todos</span>
                <span className={`font-mono text-[10px] tabular-nums tracking-wider ${
                  selectedTipoId === null ? 'text-white/80' : 'text-brand-gray'
                }`}>
                  {String(projetos.length).padStart(2, '0')}
                </span>
              </button>
              {tipos.map((t) => {
                const count = counts.get(t.id) ?? 0
                if (count === 0) return null
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTipoId(t.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedTipoId === t.id
                        ? 'bg-brand-blue text-white'
                        : 'bg-slate-100 text-brand-text hover:bg-brand-blue/10 hover:text-brand-blue'
                    }`}
                  >
                    <span>{t.type}</span>
                    <span className={`font-mono text-[10px] tabular-nums tracking-wider ${
                      selectedTipoId === t.id ? 'text-white/80' : 'text-brand-gray'
                    }`}>
                      {String(count).padStart(2, '0')}
                    </span>
                  </button>
                )
              })}
            </nav>
          )}

          {projetos && filteredProjetos && filteredProjetos.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjetos.map((p) => (
                <Link
                  key={p.id}
                  to={`/projetos/${p.id}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow group-hover:shadow-md">
                    <div className="relative h-44 w-full overflow-hidden">
                      {p.image1 ? (
                        <img
                          src={p.image1}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-brand-blue/10 via-brand-green/10 to-brand-gold/10" />
                      )}
                      <span
                        aria-hidden
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-text opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div>
                        <h3 className="font-heading text-lg font-bold text-brand-text transition-colors group-hover:text-brand-blue">
                          {p.name}
                        </h3>
                        <p className="mt-1 text-xs text-brand-gray">
                          {p.title}
                        </p>
                      </div>
                      <p className="line-clamp-3 text-sm leading-relaxed text-brand-gray">
                        {stripHtml(p.description)}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {p.type.map((t) => (
                          <span
                            key={t.id}
                            className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-semibold text-brand-blue"
                          >
                            {t.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Serviços — inspirado em Model Library Fireworks */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
              Plataformas
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
              Serviços online
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-brand-gray">
              Plataformas e ferramentas desenvolvidas pelo COMAIS para apoiar pesquisadores e parceiros.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICOS.map(({ name, url, external, description, icon: Icon }) => {
              const linkProps = external
                ? { href: url, target: '_blank', rel: 'noopener noreferrer' as const }
                : { href: url }
              return (
                <a
                  key={name}
                  {...linkProps}
                  className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-blue/30 hover:shadow-md hover:shadow-brand-blue/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    {external && (
                      <ArrowUpRight className="h-4 w-4 text-brand-gray opacity-0 transition-all group-hover:opacity-100" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="font-heading font-bold text-brand-text transition-colors group-hover:text-brand-blue">
                      {name}
                    </h3>
                    <p className="text-sm leading-relaxed text-brand-gray">
                      {description}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Equipe — Fireworks aesthetic */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
              Pessoas
            </p>
            <h2 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
              Nossa equipe
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-brand-gray">
              Pesquisadores, docentes e colaboradores que conduzem a inovação no COMAIS.
            </p>
          </div>

          {!equipe && !equipeError && (
            <div className="flex items-center justify-center gap-2 text-brand-gray py-16">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando equipe…</span>
            </div>
          )}

          {equipe && equipe.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {equipe.map((membro) => (
                <a
                  key={membro.id}
                  href={membro.url_lattes || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:shadow-lg hover:border-brand-blue/30 overflow-hidden"
                >
                  {/* Avatar circular — grande e destacado */}
                  <div className="flex justify-center mb-6">
                    {membro.foto ? (
                      <img
                        src={membro.foto}
                        alt={membro.name}
                        loading="lazy"
                        className="h-40 w-40 rounded-full object-cover ring-4 ring-brand-blue/10 transition-all group-hover:ring-brand-blue/30"
                      />
                    ) : (
                      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 via-brand-green/20 to-brand-gold/20 font-heading text-5xl font-extrabold text-brand-blue ring-4 ring-brand-blue/10 group-hover:ring-brand-blue/30">
                        {initials(membro.name)}
                      </div>
                    )}
                  </div>

                  {/* Info — centrado e destacado */}
                  <div className="text-center">
                    <h3 className="font-heading text-2xl font-extrabold text-brand-text group-hover:text-brand-blue transition-colors">
                      {membro.name}
                    </h3>
                    <p className="mt-2 text-base font-semibold text-brand-blue">
                      {membro.funcao}
                    </p>
                    {membro.url_lattes && (
                      <div className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue/10 px-4 py-2 transition-all group-hover:bg-brand-blue/20">
                        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-blue">
                          Currículo Lattes
                        </span>
                        <ExternalLink className="h-4 w-4 text-brand-blue transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    )}
                  </div>
                </a>
              ))}
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
