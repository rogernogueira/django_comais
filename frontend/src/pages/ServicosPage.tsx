import { ArrowUpRight, Database, FileText, LifeBuoy, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Servico = {
  name: string
  url: string
  external: boolean
  description: string
  icon: LucideIcon
}

const SERVICOS: Servico[] = [
  {
    name: 'RedCap',
    url: 'http://redcap.comais.uft.edu.br/',
    external: true,
    description:
      'REDCap é uma plataforma web segura para construir e gerenciar bancos de dados e pesquisas online.',
    icon: Database,
  },
  {
    name: 'Conversor PDF',
    url: 'http://pdf.comais.uft.edu.br',
    external: true,
    description:
      'Serviço que converte arquivos pdf para o padrão aberto PDFa e aplica OCR.',
    icon: FileText,
  },
  {
    name: 'Smart Review',
    url: 'http://sr.comais.uft.edu.br',
    external: true,
    description: 'Serviço de apoio ao processo de revisão bibliográfica.',
    icon: Sparkles,
  },
  {
    name: 'Apoio técnico',
    url: '/registro-ocorrencias',
    external: false,
    description: 'Registro de solicitação de apoio técnico em Pesquisas.',
    icon: LifeBuoy,
  },
]

export function ServicosPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-12 border-b border-slate-200 pb-12">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-brand-gray">
            § 04
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Soluções
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Serviços
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-gray">
          O laboratório mantém alguns serviços on-line para dar suporte aos
          pesquisadores da Universidade Federal do Tocantins e parceiros.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {SERVICOS.map(({ name, url, external, description, icon: Icon }) => {
          const linkProps = external
            ? { href: url, target: '_blank', rel: 'noopener noreferrer' as const }
            : { href: url }
          return (
            <a
              key={name}
              {...linkProps}
              className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-8 transition-all hover:border-brand-blue/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-brand-gray transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-brand-text">
                  {name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                  {description}
                </p>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
