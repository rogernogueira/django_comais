import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SobreModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SobreModal({ isOpen, onClose }: SobreModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-8">
        <div className="relative w-full max-w-2xl bg-white shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 p-1 text-brand-gray hover:text-brand-text transition-colors"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Content */}
          <div className="p-8 sm:p-12">
            <div className="mb-12">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                COMAIS Labs
              </p>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-brand-text">
                Sobre
              </h1>
            </div>

            {/* Missão */}
            <div className="mb-12 border-b border-slate-200 pb-12">
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-text">
                Missão
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-brand-gray">
                <p>
                  A missão do laboratório COMAIS é{' '}
                  <span className="font-semibold text-brand-text">
                    catalisar a colaboração entre pesquisadores, empresas e governo
                  </span>
                  , para formulação de soluções tecnológicas que possuem seus valores
                  agregados potencializados pelo uso de inteligência artificial.
                </p>
                <p>
                  O laboratório tem em seu portfólio diversos projetos que usam técnicas
                  de Inteligência Artificial. A concepção e modelagem desses projetos
                  requerem uma equipe multidisciplinar, uma vez que são desenvolvidos para
                  atuarem em diversas áreas de conhecimento.
                </p>
              </div>
            </div>

            {/* Visão */}
            <div className="mb-12">
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-text">
                Visão
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-brand-gray">
                <p>
                  Ser um ambiente inovador e inclusivo que estimule a integração,
                  multidisciplinaridade e colaboração criativa para gerar soluções
                  tecnológicas transformadoras baseadas em inteligência artificial.
                </p>
                <p>
                  Pretendemos consolidar o COMAIS como centro de excelência em pesquisa
                  e aplicação de IA, contribuindo significativamente para o desenvolvimento
                  regional e nacional, com soluções que impactam positivamente a sociedade
                  nos domínios judicial, ambiental, de segurança pública e social.
                </p>
              </div>
            </div>

            {/* Close button */}
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-brand-blue text-white hover:bg-brand-blue/90"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
