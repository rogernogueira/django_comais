import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Loader2,
  Tag,
  User,
  ZoomIn,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { ProjetoDetail } from '@/types/api'

const DATE_FMT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

// Force external links to open safely in a new tab
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u',
    'a', 'ul', 'ol', 'li',
    'h2', 'h3', 'h4', 'blockquote', 'span',
  ],
  ALLOWED_ATTR: ['href', 'title'],
}

function sanitizeDescription(html: string | null | undefined) {
  if (!html) return ''
  return DOMPurify.sanitize(html, SANITIZE_CONFIG)
}

function LightboxImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block h-full w-full cursor-zoom-in overflow-hidden bg-slate-100"
          aria-label={`Abrir imagem em tela cheia: ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-text opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl border-0 bg-transparent p-0 shadow-none">
        <img src={src} alt={alt} className="h-auto max-h-[85vh] w-full rounded-lg object-contain" />
      </DialogContent>
    </Dialog>
  )
}

export function ProjetoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<ProjetoDetail | null>(null)
  const [error, setError] = useState<{ status: number; message: string } | null>(
    null,
  )

  useEffect(() => {
    if (!id) return
    const ac = new AbortController()
    setData(null)
    setError(null)
    fetch(`/api/v1/projetos/${id}/`, { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as ProjetoDetail
      })
      .then(setData)
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        const msg = e instanceof Error ? e.message : 'erro desconhecido'
        const status = /HTTP (\d+)/.exec(msg)?.[1]
        setError({ status: status ? Number(status) : 0, message: msg })
      })
    return () => ac.abort()
  }, [id])

  const images = data
    ? [data.image1, data.image2, data.image3].filter(
        (u): u is string => Boolean(u),
      )
    : []

  const formattedDate = data
    ? DATE_FMT.format(new Date(`${data.date}T00:00:00`))
    : ''

  const safeDescription = useMemo(
    () => sanitizeDescription(data?.description),
    [data?.description],
  )

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-8 -ml-3 gap-2 text-brand-gray hover:bg-transparent hover:text-brand-blue"
      >
        <Link to="/projetos">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao portfólio
        </Link>
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error.status === 404
              ? 'Projeto não encontrado'
              : 'Falha ao carregar projeto'}
          </AlertTitle>
          <AlertDescription>
            {error.status === 404
              ? `Não existe projeto com id ${id}.`
              : error.message}
          </AlertDescription>
        </Alert>
      )}

      {!data && !error && (
        <div className="flex items-center gap-2 text-brand-gray">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando…</span>
        </div>
      )}

      {data && (
        <>
          <header className="mb-10 border-b border-slate-200 pb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {data.type.map((t) => (
                <Badge key={t.id} variant="brandBlue">
                  {t.type}
                </Badge>
              ))}
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-5xl lg:text-6xl">
              {data.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-gray sm:text-xl">
              {data.title}
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div>
              {images.length > 0 ? (
                <Carousel
                  className="relative"
                  opts={{ loop: images.length > 1 }}
                >
                  <CarouselContent>
                    {images.map((src, i) => (
                      <CarouselItem key={src}>
                        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <LightboxImage src={src} alt={`${data.name} — imagem ${i + 1}`} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-3 bg-white/95 hover:bg-white" />
                      <CarouselNext className="right-3 bg-white/95 hover:bg-white" />
                    </>
                  )}
                  <CarouselDots className="mt-4" />
                </Carousel>
              ) : (
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-brand-blue/10 via-brand-green/10 to-brand-gold/10" />
              )}
            </div>

            <aside className="space-y-8">
              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gray">
                    <Tag className="h-3 w-3" />
                    Categoria
                  </dt>
                  <dd className="mt-1.5 text-brand-text">
                    {data.type.map((t) => t.type).join(' · ') || '—'}
                  </dd>
                </div>

                {data.client && (
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gray">
                      <User className="h-3 w-3" />
                      Cliente
                    </dt>
                    <dd className="mt-1.5 text-brand-text">{data.client}</dd>
                  </div>
                )}

                <div>
                  <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gray">
                    <Calendar className="h-3 w-3" />
                    Data
                  </dt>
                  <dd className="mt-1.5 text-brand-text">{formattedDate}</dd>
                </div>

                {data.url && (
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gray">
                      <ExternalLink className="h-3 w-3" />
                      Saiba mais
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 break-all text-brand-blue hover:text-brand-blue/80"
                      >
                        {data.url}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {safeDescription && (
                <div className="border-t border-slate-200 pt-6">
                  <h2 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-text">
                    Sobre o projeto
                  </h2>
                  <div
                    className="prose-comais mt-4"
                    dangerouslySetInnerHTML={{ __html: safeDescription }}
                  />
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </section>
  )
}
