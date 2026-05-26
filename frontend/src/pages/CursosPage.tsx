import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  User,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.map((curso) => (
            <Card
              key={curso.id}
              className="group flex flex-col border-slate-200 transition-shadow hover:shadow-md"
            >
              <CardHeader className="gap-2">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="brandBlue" className="font-mono">
                    <Clock className="mr-1 h-3 w-3" />
                    {curso.carga_horaria}h
                  </Badge>
                  <Badge variant="brandGreen">{modalityFor(curso.local)}</Badge>
                </div>
                <CardTitle className="mt-2 text-xl">{curso.titulo}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {curso.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <dl className="grid grid-cols-1 gap-2 text-sm text-brand-gray sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">
                        Início
                      </dt>
                      <dd className="font-medium text-brand-text">
                        {formatDate(curso.data_inicio)}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">
                        Término
                      </dt>
                      <dd className="font-medium text-brand-text">
                        {formatDate(curso.data_termino)}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">
                        Instrutor
                      </dt>
                      <dd className="font-medium text-brand-text">
                        {curso.instrutor}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">
                        Local
                      </dt>
                      <dd className="font-medium text-brand-text">
                        {curso.local}
                      </dd>
                    </div>
                  </div>
                </dl>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="mt-6 self-start gap-1 px-0 text-brand-blue hover:bg-transparent hover:text-brand-blue/80"
                >
                  <a href={`/cursos/${curso.id}`}>
                    Detalhes
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
