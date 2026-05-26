import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'

import { Button } from '@/components/ui/button'

type PlaceholderPageProps = {
  section: string
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderPage({
  section,
  eyebrow,
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-12 border-b border-slate-200 pb-12">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-brand-gray">
            {section}
          </span>
          <span className="h-px flex-1 bg-slate-200" />
          <Icon className="h-5 w-5 text-brand-blue" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
          {eyebrow}
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-gray">
          {description}
        </p>
      </header>

      <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-brand-gold bg-brand-gold/5 p-8">
        <div className="flex items-center gap-3 text-brand-gold-dark">
          <Construction className="h-5 w-5" />
          <span className="font-heading text-sm font-bold uppercase tracking-[0.18em]">
            Em construção
          </span>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-brand-gray">
          Esta seção será disponibilizada conforme os modelos correspondentes
          do backend forem integrados. Acompanhe a migração no repositório.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-2 gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </section>
  )
}
