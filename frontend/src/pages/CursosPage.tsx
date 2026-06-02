import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Code,
  Loader2,
  MessageCircle,
  TrendingUp,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import type { CursoListItem, Paginated } from '@/types/api'

const DATE_FMT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

function formatDate(iso: string) {
  return DATE_FMT.format(new Date(`${iso}T00:00:00`))
}

function modalityFor(local: string) {
  const l = local.toLowerCase()
  if (l.includes('ead') || l.includes('online') || l.includes('remoto'))
    return 'EaD'
  if (l.includes('híbrido') || l.includes('hibrido')) return 'Híbrido'
  return 'Presencial'
}

function iconFor(titulo: string) {
  const t = titulo.toLowerCase()
  if (t.includes('python')) return Code
  if (t.includes('machine learning') || t.includes('ml')) return Brain
  if (t.includes('r ') || t.includes(' r')) return BookOpen
  if (t.includes('pln') || t.includes('linguagem')) return MessageCircle
  if (t.includes('estatística') || t.includes('analise')) return TrendingUp
  return Code
}

export function CursosPage() {
  const [data, setData] = useState<CursoListItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/v1/cursos/', { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as Paginated<CursoListItem>
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
            § 03
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Capacitação
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Cursos e Formações
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-gray">
          Explore nossos programas de capacitação em Inteligência Artificial e
          Modelagem Computacional.
        </p>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar cursos</AlertTitle>
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
          Nenhum curso disponível no momento.
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((curso) => {
            const IconComponent = iconFor(curso.titulo)
            return (
              <a
                key={curso.id}
                href={`/cursos/${curso.id}`}
                className="group flex flex-col border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-slate-300"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue/10">
                  <IconComponent className="h-5 w-5 text-brand-blue" />
                </div>

                {/* Title */}
                <h3 className="mb-2 font-heading text-lg font-bold text-brand-text line-clamp-2">
                  {curso.titulo}
                </h3>

                {/* Description */}
                <p className="mb-4 flex-1 text-sm text-brand-gray line-clamp-2">
                  {curso.descricao}
                </p>

                {/* Metadata */}
                <div className="mb-4 space-y-2 text-xs text-brand-gray">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{curso.carga_horaria}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-brand-text">
                      {modalityFor(curso.local)}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {formatDate(curso.data_inicio)}
                  </Badge>
                </div>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-blue opacity-0 transition-all group-hover:opacity-100">
                  Ver detalhes
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
