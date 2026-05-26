import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { SobrePage } from '@/pages/SobrePage'
import { NoticiasPage } from '@/pages/NoticiasPage'
import { CursosPage } from '@/pages/CursosPage'
import { ProjetoDetailPage } from '@/pages/ProjetoDetailPage'
import { ProjetosPage } from '@/pages/ProjetosPage'
import { ServicosPage } from '@/pages/ServicosPage'
import { EquipePage } from '@/pages/EquipePage'
import { ContatoPage } from '@/pages/ContatoPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sobre', element: <SobrePage /> },
      { path: 'noticias', element: <NoticiasPage /> },
      { path: 'cursos', element: <CursosPage /> },
      { path: 'projetos', element: <ProjetosPage /> },
      { path: 'projetos/:id', element: <ProjetoDetailPage /> },
      { path: 'servicos', element: <ServicosPage /> },
      { path: 'equipe', element: <EquipePage /> },
      { path: 'contato', element: <ContatoPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
