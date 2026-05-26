import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  Loader2,
  Newspaper,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { NoticiaListItem, Paginated } from '@/types/api'

const FULL_DATE_FMT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const MONTH_FMT = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
const DAY_FMT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit' })
const YEAR_FMT = new Intl.DateTimeFormat('pt-BR', { year: 'numeric' })

function parts(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return {
    day: DAY_FMT.format(d),
    month: MONTH_FMT.format(d).replace('.', '').toUpperCase(),
    year: YEAR_FMT.format(d),
    full: FULL_DATE_FMT.format(d),
  }
}

function NoticiaCard({ n, featured }: { n: NoticiaListItem; featured: boolean }) {
  const date = parts(n.data_publicacao)
  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`grid gap-0 ${featured ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {n.imagem && (
          <div
            className={`relative overflow-hidden ${
              featured ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-[16/9]'
            }`}
          >
            <img
              src={n.imagem}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute left-4 top-4 flex flex-col items-center rounded-md bg-white/95 px-3 py-2 text-center font-mono shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-blue">
                {date.month}
              </span>
              <span className="font-heading text-2xl font-extrabold leading-none text-brand-text">
                {date.day}
              </span>
              <span className="text-[10px] tracking-wider text-brand-gray">
                {date.year}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-brand-gray">
            <CalendarDays className="h-3.5 w-3.5" />
            <time dateTime={n.data_publicacao}>{date.full}</time>
          </div>

          <h3
            className={`font-heading font-extrabold leading-tight text-brand-text ${
              featured ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}
          >
            {n.titulo}
          </h3>

          {n.resumo && (
            <p className="text-sm leading-relaxed text-brand-gray">
              {n.resumo}
            </p>
          )}

          {n.fonte_url && (
            <a
              href={n.fonte_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue hover:text-brand-blue/80"
            >
              <span>
                Fonte: <span className="text-brand-text">{n.fonte_nome}</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function NoticiasPage() {
  const [data, setData] = useState<NoticiaListItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/v1/noticias/', { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as Paginated<NoticiaListItem>
      })
      .then((page) => setData(page.results))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'erro desconhecido')
      })
    return () => ac.abort()
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-12 border-b border-slate-200 pb-12">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-brand-gray">
            § 02
          </span>
          <span className="h-px flex-1 bg-slate-200" />
          <Newspaper className="h-5 w-5 text-brand-blue" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Comunicação
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Notícias
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-gray">
          Anúncios institucionais, conquistas de pesquisa e eventos do
          laboratório COMAIS.
        </p>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar notícias</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!data && !error && (
        <div className="flex items-center gap-2 text-brand-gray">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando…</span>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-brand-gold bg-brand-gold/5 p-8 text-sm text-brand-gray">
          Nenhuma notícia cadastrada.
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.map((n, i) => (
            <NoticiaCard key={n.id} n={n} featured={i === 0} />
          ))}
        </div>
      )}
    </section>
  )
}
