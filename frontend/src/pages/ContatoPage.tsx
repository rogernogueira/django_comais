import { Mail, MapPin } from 'lucide-react'

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d26418.003900915173!2d-48.35507667391182!3d-10.175796844112822!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6908f8e88d9f46e1!2sComais%20Labs!5e0!3m2!1spt-BR!2sbr!4v1657227187835!5m2!1spt-BR!2sbr'

export function ContatoPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-12 border-b border-slate-200 pb-12">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-brand-gray">
            § 06
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Fale conosco
        </p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Contato
        </h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-brand-blue" />
              <h4 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-text">
                Localização
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-brand-gray">
              Quadra 109 Norte, Avenida NS-15,
              <br />
              ALCNO-14, Bloco III, Sala 105,
              <br />
              Plano Diretor Norte
              <br />
              Palmas/TO · CEP 77001-090
              <br />
              Brasil
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand-blue" />
              <h4 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-text">
                E-mail
              </h4>
            </div>
            <a
              href="mailto:comais@uft.edu.br"
              className="text-sm text-brand-text hover:text-brand-blue"
            >
              comais@uft.edu.br
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 lg:col-span-3">
          <iframe
            title="Localização do COMAIS Labs no mapa"
            src={MAP_SRC}
            className="h-[420px] w-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
