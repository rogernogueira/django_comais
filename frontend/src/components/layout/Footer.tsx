import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'

const YEAR = new Date().getFullYear()

const LINKS_UTEIS = [
  { to: '/', label: 'Início' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/projetos', label: 'Projetos' },
] as const

const SERVICOS_LINKS = [
  { href: 'http://redcap.comais.uft.edu.br/', label: 'RedCap', external: true },
  {
    href: 'http://pdf.comais.uft.edu.br',
    label: 'Conversor PDF',
    external: true,
  },
  {
    href: 'http://sr.comais.uft.edu.br',
    label: 'Smart Review',
    external: true,
  },
  { href: '/contato', label: 'Contato', external: false },
] as const

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-4">
        {/* Brand + endereço */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src="/brand/comais-lab.png"
              alt="COMAIS Labs"
              className="h-14 w-14 shrink-0 object-cover object-top"
            />
            <div className="flex flex-col">
              <span className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-extrabold tracking-tight text-brand-text">
                  COMAIS
                </span>
                <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
                  Labs
                </span>
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gray">
                Computational Modeling of AI Solutions
              </span>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-brand-gray">
            Quadra 109 Norte, Avenida NS-15,
            <br />
            ALCNO-14, Plano Diretor Norte
            <br />
            Palmas/TO · CEP 77001-090
            <br />
            Brasil
          </p>
          <p className="mt-3 text-sm text-brand-gray">
            <span className="font-semibold text-brand-text">E-mail:</span>{' '}
            <a
              href="mailto:comais@uft.edu.br"
              className="hover:text-brand-blue"
            >
              comais@uft.edu.br
            </a>
          </p>
        </div>

        {/* Links Úteis */}
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
            Links Úteis
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {LINKS_UTEIS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-brand-gray transition-colors hover:text-brand-blue"
                >
                  › {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Serviços */}
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
            Serviços
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICOS_LINKS.map((item) =>
              item.external ? (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gray transition-colors hover:text-brand-blue"
                  >
                    › {item.label}
                  </a>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-brand-gray transition-colors hover:text-brand-blue"
                  >
                    › {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Localização */}
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
            Onde estamos
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-brand-gray">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              <span>Palmas · Tocantins · Brasil</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              <a
                href="mailto:comais@uft.edu.br"
                className="hover:text-brand-blue"
              >
                comais@uft.edu.br
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-5 text-xs text-brand-gray sm:flex-row sm:items-center">
          <span>
            © Copyright{' '}
            <strong className="font-heading font-extrabold text-brand-text">
              COMAIS Labs.
            </strong>{' '}
            {YEAR}. All Rights Reserved.
          </span>
          <span className="font-mono tracking-wide">
            PPGGTD — Governança e Transformação Digital · UFT
          </span>
        </div>
      </div>
    </footer>
  )
}
