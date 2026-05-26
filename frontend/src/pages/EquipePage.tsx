import type { ComponentType, SVGProps } from 'react'
import { useEffect, useState } from 'react'
import { AlertCircle, ExternalLink, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Colaborador, Paginated } from '@/types/api'
import { cn } from '@/lib/utils'

type SocialKey = 'url_twitter' | 'url_facebook' | 'url_instagram' | 'url_linkedin'
type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>

const LinkedinIcon: SocialIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.87 0-2.15 1.46-2.15 2.95v5.66H9.34V9h3.41v1.56h.05c.47-.9 1.64-1.86 3.38-1.86 3.61 0 4.27 2.38 4.27 5.47v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
)

const TwitterIcon: SocialIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon: SocialIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.025 1.792-4.696 4.533-4.696 1.312 0 2.686.234 2.686.234v2.962h-1.514c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
)

const InstagramIcon: SocialIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
)

const SOCIALS: ReadonlyArray<{
  key: SocialKey
  label: string
  Icon: SocialIcon
}> = [
  { key: 'url_linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'url_twitter', label: 'Twitter', Icon: TwitterIcon },
  { key: 'url_facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'url_instagram', label: 'Instagram', Icon: InstagramIcon },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]!)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function MemberCard({ c }: { c: Colaborador }) {
  return (
    <article className="group relative flex gap-5 rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="shrink-0">
        {c.foto ? (
          <img
            src={c.foto}
            alt={c.name}
            loading="lazy"
            className="h-24 w-24 rounded-lg object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-24 w-24 items-center justify-center rounded-lg bg-brand-blue/10 font-heading text-xl font-extrabold text-brand-blue"
          >
            {initials(c.name)}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-heading text-lg font-bold leading-tight text-brand-text">
          {c.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand-blue">{c.funcao}</p>

        <a
          href={c.url_latters}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-text hover:text-brand-blue"
        >
          Currículo Lattes
          <ExternalLink className="h-3 w-3" />
        </a>

        <div className="mt-auto flex flex-wrap items-center gap-1 pt-4">
          {SOCIALS.map(({ key, label, Icon }) => {
            const href = c[key]
            if (!href) return null
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} de ${c.name}`}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-gray transition-colors',
                  'hover:bg-brand-blue/10 hover:text-brand-blue',
                )}
              >
                <Icon className="h-4 w-4" />
              </a>
            )
          })}
        </div>
      </div>
    </article>
  )
}

export function EquipePage() {
  const [data, setData] = useState<Colaborador[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/v1/colaboradores/', { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as Paginated<Colaborador>
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
            § 05
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Pessoas
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Equipe
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-gray">
          Pesquisadores, docentes e colaboradores que sustentam a atuação do
          COMAIS Labs. Acesse o currículo Lattes de cada membro pelo CNPq.
        </p>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Falha ao carregar equipe</AlertTitle>
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
          Nenhum colaborador cadastrado.
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.map((c) => (
            <MemberCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </section>
  )
}
