import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { Paginated, ProjetoListItem, TipoProjeto } from '@/types/api'

function stripHtml(value: string | null | undefined) {
  if (!value) return ''
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const TIPO_PARAM = 'tipo'

export function ProjetosPage() {
  const [projetos, setProjetos] = useState<ProjetoListItem[] | null>(null)
  const [tipos, setTipos] = useState<TipoProjeto[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

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
        setError(e instanceof Error ? e.message : 'erro desconhecido')
      })
    return () => ac.abort()
  }, [])

  const rawSelected = searchParams.get(TIPO_PARAM)
  const selectedId = rawSelected ? Number(rawSelected) : null

  const counts = useMemo(() => {
    const map = new Map<number, number>()
    if (!projetos) return map
    for (const p of projetos) {
      for (const t of p.type) {
        map.set(t.id, (map.get(t.id) ?? 0) + 1)
      }
    }
    return map
  }, [projetos])

  const filtered = useMemo(() => {
    if (!projetos) return null
    if (selectedId === null) return projetos
    return projetos.filter((p) => p.type.some((t) => t.id === selectedId))
  }, [projetos, selectedId])

  const selectType = (id: number | null) => {
    if (id === null) {
      searchParams.delete(TIPO_PARAM)
    } else {
      searchParams.set(TIPO_PARAM, String(id))
    }
    setSearchParams(searchParams, { replace: true })
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
          Portfólio
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Projetos
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-gray">
          Conheça algumas das iniciativas apoiadas pelo COMAIS.
        </p>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar projetos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!projetos && !error && (
        <div className="flex items-center gap-2 text-brand-gray">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando…</span>
        </div>
      )}

      {projetos && tipos && (
        <>
          <nav
            aria-label="Filtrar por tipo de projeto"
            className="mb-10 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-6"
          >
            <FilterPill
              active={selectedId === null}
              onClick={() => selectType(null)}
              count={projetos.length}
            >
              Todos
            </FilterPill>
            {tipos.map((t) => {
              const count = counts.get(t.id) ?? 0
              if (count === 0) return null
              return (
                <FilterPill
                  key={t.id}
                  active={selectedId === t.id}
                  onClick={() => selectType(t.id)}
                  count={count}
                >
                  {t.type}
                </FilterPill>
              )
            })}
          </nav>

          {filtered && filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-brand-gold bg-brand-gold/5 p-8 text-sm text-brand-gray">
              Nenhum projeto encontrado para esse filtro.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered?.map((p) => (
                <Link
                  key={p.id}
                  to={`/projetos/${p.id}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  <Card className="flex h-full flex-col overflow-hidden border-slate-200 transition-shadow group-hover:shadow-md">
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
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl transition-colors group-hover:text-brand-blue">
                        {p.name}
                      </CardTitle>
                      <CardDescription>{p.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                      <p className="line-clamp-3 text-sm leading-relaxed text-brand-gray">
                        {stripHtml(p.description)}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {p.type.map((t) => (
                          <Badge key={t.id} variant="brandBlue">
                            {t.type}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

function FilterPill({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
        active
          ? 'bg-brand-blue text-white'
          : 'bg-slate-100 text-brand-text hover:bg-brand-blue/10 hover:text-brand-blue',
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          'font-mono text-[10px] tabular-nums tracking-wider',
          active ? 'text-white/80' : 'text-brand-gray',
        )}
      >
        {String(count).padStart(2, '0')}
      </span>
    </button>
  )
}
