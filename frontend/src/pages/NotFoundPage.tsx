import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const error = useRouteError()

  const status = isRouteErrorResponse(error) ? error.status : 404
  const title =
    status === 404 ? 'Página não encontrada' : 'Algo deu errado'
  const description =
    status === 404
      ? 'O endereço que você acessou não existe ou foi movido. Verifique o link ou volte ao início.'
      : 'Não foi possível carregar esta página. Tente novamente em alguns instantes ou retorne ao início.'

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start px-6 py-24 sm:py-32">
      <div className="mb-6 flex items-center gap-3">
        <Compass className="h-5 w-5 text-brand-blue" />
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-brand-gray">
          Erro · {String(status).padStart(3, '0')}
        </span>
      </div>
      <h1 className="font-heading text-5xl font-extrabold tracking-tight text-brand-text sm:text-7xl">
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-gray">
        {description}
      </p>
      <Button asChild size="lg" className="mt-10 gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>
      </Button>
    </section>
  )
}
