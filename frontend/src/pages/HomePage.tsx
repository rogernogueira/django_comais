import { Link } from 'react-router-dom'
import { ArrowRight, Network, Sparkles, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

const OBJETIVOS = [
  {
    number: '§ 01',
    title: 'Integração',
    accent: 'bg-brand-blue',
    icon: Network,
    description: 'Ser um ambiente que estimule a integração.',
  },
  {
    number: '§ 02',
    title: 'Multidisciplinaridade',
    accent: 'bg-brand-green',
    icon: Users,
    description:
      'Trabalhar multidisciplinaridade de forma colaborativa e criativa.',
  },
  {
    number: '§ 03',
    title: 'Inovação',
    accent: 'bg-brand-gold',
    icon: Sparkles,
    description: 'Propiciar a geração de projetos inovadores.',
  },
] as const

const DOMINIOS = ['Judicial', 'Segurança Pública', 'Ambiental', 'Social'] as const

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,theme(colors.brand-blue/12),transparent_60%),radial-gradient(ellipse_at_bottom_left,theme(colors.brand-green/10),transparent_55%)]"
        />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[3fr_2fr]">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                COMAIS Labs · UFT
              </p>
              <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-text sm:text-5xl lg:text-6xl">
                Modelagem Computacional
                <br />
                de Soluções de{' '}
                <span className="text-brand-blue">Inteligência Artificial</span>.
              </h1>
              <p className="mt-6 max-w-2xl font-mono text-xs uppercase tracking-[0.18em] text-brand-gray sm:text-sm">
                Computational Modeling of Artificial Intelligence Solutions
              </p>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-brand-gray">
                Laboratório multidisciplinar do{' '}
                <span className="text-brand-text">
                  Programa de Pós-Graduação em Governança e Transformação Digital
                </span>{' '}
                da Universidade Federal do Tocantins.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/projetos">
                    Projetos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://www.youtube.com/watch?v=jsd29YgSaM4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Assistir vídeo
                  </a>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link to="/galeria">Fotos</Link>
                </Button>
              </div>
            </div>

            <div className="relative order-first flex justify-center lg:order-last">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,theme(colors.brand-blue/15),transparent_65%)] blur-2xl"
              />
              <img
                src="/brand/comais-lab.png"
                alt="COMAIS Labs — engrenagem e cérebro de circuitos representando IA aplicada"
                width={520}
                height={555}
                className="h-auto w-full max-w-sm animate-hero-float drop-shadow-sm lg:max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sobre / Missão */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                Sobre
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
                Missão
              </h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-brand-gray">
              <p>
                A missão do laboratório COMAIS é{' '}
                <span className="text-brand-text">
                  catalisar a colaboração entre pesquisadores, empresas e
                  governo
                </span>
                , para formulação de soluções tecnológicas, que possuem seus
                valores agregados potencializados pelo uso de inteligência
                artificial.
              </p>
              <p>
                O laboratório tem em seu portfólio diversos projetos que usam
                técnicas de Inteligência Artificial. A concepção e modelagem
                desses projetos requerem uma equipe multidisciplinar, uma vez
                que são desenvolvidos para atuarem em diversas áreas de
                conhecimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objetivos / Pilares */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
            O COMAIS visa
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Três objetivos,
            <br />
            uma metodologia.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {OBJETIVOS.map(({ number, title, accent, icon: Icon, description }) => (
              <article
                key={title}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-md"
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 ${accent}`}
                />
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-brand-gray">
                    {number}
                  </span>
                  <Icon className="h-5 w-5 text-brand-gray transition-colors group-hover:text-brand-blue" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-brand-text">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-brand-gray">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Domínios de atuação */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                Áreas de atuação
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-text">
                Onde aplicamos IA.
              </h2>
            </div>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-4 sm:grid-cols-4">
              {DOMINIOS.map((d, i) => (
                <li key={d} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-brand-gray">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-heading text-lg font-semibold text-brand-text">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
