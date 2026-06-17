import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Loader2,
  X,
  ZoomIn,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { GaleriaFoto, Paginated } from '@/types/api'

type Foto = {
  src: string
  projeto: string
  legenda: string
  categoria: string
}

const TODAS = 'Todas'

function toFoto(item: GaleriaFoto): Foto {
  return {
    src: item.imagem,
    projeto: item.titulo,
    legenda: item.descricao || item.titulo,
    categoria: item.categoria || 'Geral',
  }
}

export function GaleriaPage() {
  const [todasFotos, setTodasFotos] = useState<Foto[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<string>(TODAS)
  const [aberta, setAberta] = useState<number | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/v1/galeria/', { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as GaleriaFoto[] | Paginated<GaleriaFoto>
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.results
        setTodasFotos(items.map(toFoto))
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'erro desconhecido')
      })
    return () => ac.abort()
  }, [])

  const categorias = useMemo(() => {
    const set = new Set<string>()
    ;(todasFotos ?? []).forEach((f) => set.add(f.categoria))
    return [TODAS, ...Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))]
  }, [todasFotos])

  const fotos = useMemo(() => {
    const all = todasFotos ?? []
    return filtro === TODAS ? all : all.filter((f) => f.categoria === filtro)
  }, [todasFotos, filtro])

  const mostrar = useCallback(
    (delta: number) => {
      setAberta((atual) => {
        if (atual === null || fotos.length === 0) return atual
        return (atual + delta + fotos.length) % fotos.length
      })
    },
    [fotos.length],
  )

  // Navegação por teclado quando o lightbox está aberto
  useEffect(() => {
    if (aberta === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberta(null)
      else if (e.key === 'ArrowRight') mostrar(1)
      else if (e.key === 'ArrowLeft') mostrar(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberta, mostrar])

  const fotoAberta = aberta !== null ? fotos[aberta] : null

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-12 border-b border-slate-200 pb-12">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-brand-gray">
            § 07
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Registros
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Galeria de Fotos
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-gray">
          Um panorama visual das atividades, projetos e iniciativas do
          laboratório em Modelagem Computacional e Inteligência Artificial.
        </p>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar a galeria</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!todasFotos && !error && (
        <div className="flex items-center gap-2 text-brand-gray">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando…</span>
        </div>
      )}

      {todasFotos && todasFotos.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-brand-gold bg-brand-gold/5 p-12 text-center text-sm text-brand-gray">
          <ImageOff className="h-8 w-8 text-brand-gold-dark" />
          Nenhuma imagem disponível no momento.
        </div>
      )}

      {todasFotos && todasFotos.length > 0 && (
        <>
          {/* Filtros por categoria */}
          {categorias.length > 2 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFiltro(cat)}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors',
                    filtro === cat
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : 'border-slate-200 bg-white text-brand-gray hover:border-brand-blue hover:text-brand-blue',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid masonry */}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {fotos.map((foto, i) => (
              <button
                key={`${foto.src}-${i}`}
                type="button"
                onClick={() => setAberta(i)}
                className="group relative block w-full break-inside-avoid overflow-hidden border border-slate-200 bg-slate-100"
                aria-label={`Abrir imagem: ${foto.legenda}`}
              >
                <img
                  src={foto.src}
                  alt={foto.legenda}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Overlay no hover */}
                <span className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-brand-text/80 via-brand-text/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="font-heading text-sm font-bold leading-tight text-white">
                    {foto.projeto}
                  </span>
                  <span className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/70">
                    {foto.categoria}
                  </span>
                </span>
                <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-text opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-brand-gray">
            {fotos.length} {fotos.length === 1 ? 'imagem' : 'imagens'}
          </p>
        </>
      )}

      {/* Lightbox */}
      {fotoAberta && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-brand-text/95 backdrop-blur-sm animate-in fade-in-0"
          role="dialog"
          aria-modal="true"
          aria-label={fotoAberta.legenda}
          onClick={() => setAberta(null)}
        >
          {/* Barra superior */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 text-white">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
              {(aberta ?? 0) + 1} / {fotos.length}
            </span>
            <button
              type="button"
              onClick={() => setAberta(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Área da imagem */}
          <div
            className="flex flex-1 items-center justify-center px-4 pb-4 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fotoAberta.src}
              alt={fotoAberta.legenda}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Legenda */}
          <div
            className="px-6 pb-6 text-center text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-heading text-base font-bold">
              {fotoAberta.projeto}
            </p>
            <p className="mt-0.5 text-sm text-white/70">{fotoAberta.legenda}</p>
          </div>

          {/* Setas de navegação */}
          {fotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  mostrar(-1)
                }}
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  mostrar(1)
                }}
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
