import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LogIn, Menu, X, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NAV_ITEMS } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sobreHoverOpen, setSobreHoverOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top institutional band */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[11px] tracking-wide text-brand-gray">
          <span>
            Universidade Federal do Tocantins ·{' '}
            <span className="hidden sm:inline">
              Programa de Pós-Graduação em Governança e Transformação Digital
            </span>
            <span className="sm:hidden">PPGGTD</span>
          </span>
          <div className="flex items-center gap-3">
            <button className="font-semibold text-brand-text">PT</button>
            <span className="text-brand-gray/40">·</span>
            <button className="hover:text-brand-text">EN</button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <img
              src="/brand/comais-lab.png"
              alt=""
              aria-hidden
              className="h-12 w-12 shrink-0 object-cover object-top"
            />
            <span className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-extrabold tracking-tight text-brand-text">
                COMAIS
              </span>
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
                Labs
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              if (item.label === 'Sobre') {
                return (
                  <div
                    key={item.to}
                    className="group relative"
                    onMouseEnter={() => setSobreHoverOpen(true)}
                    onMouseLeave={() => setSobreHoverOpen(false)}
                  >
                    <button
                      className={cn(
                        'relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors',
                        'after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[2px] after:origin-left after:scale-x-0 after:bg-brand-blue after:transition-transform',
                        'text-brand-text hover:text-brand-blue hover:after:scale-x-100',
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Submenu - Fireworks style */}
                    <div
                      className={cn(
                        'absolute left-0 top-full pt-3 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50',
                      )}
                    >
                      <div className="bg-white shadow-xl min-w-max">
                        <a
                          href="#missao"
                          onClick={(e) => {
                            e.preventDefault()
                            const el = document.getElementById('missao')
                            el?.scrollIntoView({ behavior: 'smooth' })
                            setSobreHoverOpen(false)
                          }}
                          className="block px-8 py-6 border-b border-slate-100 transition-colors hover:bg-slate-50 group/item"
                        >
                          <div className="text-sm font-semibold text-brand-blue mb-1">
                            Missão
                          </div>
                          <div className="text-xs text-brand-gray">
                            Catalisar colaboração entre pesquisadores, empresas e governo
                          </div>
                        </a>
                        <a
                          href="#visao"
                          onClick={(e) => {
                            e.preventDefault()
                            const el = document.getElementById('visao')
                            el?.scrollIntoView({ behavior: 'smooth' })
                            setSobreHoverOpen(false)
                          }}
                          className="block px-8 py-6 transition-colors hover:bg-slate-50 group/item"
                        >
                          <div className="text-sm font-semibold text-brand-blue mb-1">
                            Visão
                          </div>
                          <div className="text-xs text-brand-gray">
                            Ser ambiente inovador e inclusivo para soluções em IA
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'relative px-3 py-2 text-sm font-medium transition-colors',
                      'after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[2px] after:origin-left after:scale-x-0 after:bg-brand-blue after:transition-transform',
                      isActive
                        ? 'text-brand-blue after:scale-x-100'
                        : 'text-brand-text hover:text-brand-blue hover:after:scale-x-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="outline" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-text hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {NAV_ITEMS.map((item) => {
                if (item.label === 'Sobre') {
                  return (
                    <div key={item.to}>
                      <button
                        onClick={() => setSobreHoverOpen(!sobreHoverOpen)}
                        className={cn(
                          'w-full rounded-md px-3 py-2 text-base font-medium transition-colors text-left flex items-center justify-between',
                          'text-brand-text hover:bg-slate-50 hover:text-brand-blue',
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            sobreHoverOpen && 'rotate-180',
                          )}
                        />
                      </button>
                      {sobreHoverOpen && (
                        <div className="bg-slate-50 rounded-md mt-1 overflow-hidden">
                          <a
                            href="#missao"
                            onClick={(e) => {
                              e.preventDefault()
                              const el = document.getElementById('missao')
                              el?.scrollIntoView({ behavior: 'smooth' })
                              setSobreHoverOpen(false)
                              setMobileOpen(false)
                            }}
                            className="block px-6 py-3 text-sm font-medium text-brand-text hover:bg-slate-100 border-b border-slate-200 transition-colors"
                          >
                            Missão
                          </a>
                          <a
                            href="#visao"
                            onClick={(e) => {
                              e.preventDefault()
                              const el = document.getElementById('visao')
                              el?.scrollIntoView({ behavior: 'smooth' })
                              setSobreHoverOpen(false)
                              setMobileOpen(false)
                            }}
                            className="block px-6 py-3 text-sm font-medium text-brand-text hover:bg-slate-100 transition-colors"
                          >
                            Visão
                          </a>
                        </div>
                      )}
                    </div>
                  )
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md px-3 py-2 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-brand-blue/10 text-brand-blue'
                          : 'text-brand-text hover:bg-slate-50 hover:text-brand-blue',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              })}
              <Button variant="outline" size="sm" className="mt-3 w-full gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
