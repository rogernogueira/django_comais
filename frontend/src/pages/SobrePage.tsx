import { Check } from 'lucide-react'

const OBJETIVOS = [
  'Ser um ambiente que estimule a integração',
  'Trabalhar multidisciplinaridade de forma colaborativa e criativa',
  'Propiciar a geração de projetos inovadores',
] as const

export function SobrePage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-12 border-b border-slate-200 pb-12">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-brand-gray">
            § 01
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Quem somos
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Sobre o COMAIS
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-brand-gray">
          Computational Modeling of Artificial Intelligence Solutions
        </p>
      </header>

      <div className="space-y-10 text-base leading-relaxed text-brand-gray">
        <p>
          A missão do laboratório COMAIS{' '}
          <span className="text-brand-text">
            (Computational Modeling of Artificial Intelligence Solutions Labs.)
          </span>{' '}
          é catalisar a colaboração entre pesquisadores, empresas e governo,
          para formulação de soluções tecnológicas, que possuem seus valores
          agregados potencializados pelo uso de inteligência artificial.
        </p>

        <div>
          <p className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-text">
            O COMAIS visa:
          </p>
          <ul className="space-y-3">
            {OBJETIVOS.map((obj) => (
              <li
                key={obj}
                className="flex items-start gap-3 border-l-2 border-brand-blue/30 pl-4"
              >
                <Check className="mt-1 h-4 w-4 shrink-0 text-brand-blue" />
                <span className="text-brand-text">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <p>
          O laboratório tem em seu portfólio diversos projetos que usam
          técnicas de Inteligência Artificial. A concepção e modelagem desses
          projetos requerem uma equipe multidisciplinar, uma vez que são
          desenvolvidos para atuarem em diversas áreas de conhecimento, tais
          como: <span className="text-brand-text">judicial</span>,{' '}
          <span className="text-brand-text">segurança pública</span>,{' '}
          <span className="text-brand-text">ambiental</span> e{' '}
          <span className="text-brand-text">social</span>.
        </p>

        <p>
          Concomitante contribuindo com a comunidade científica, validando o
          aprendizado dos acadêmicos envolvidos e agregando de forma
          qualitativa e quantitativa em sua produção científica.
        </p>
      </div>
    </section>
  )
}
