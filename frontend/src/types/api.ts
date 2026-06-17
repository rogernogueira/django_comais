export interface TipoProjeto {
  id: number
  type: string
  filter: string | null
}

export interface ProjetoListItem {
  id: number
  name: string
  client: string | null
  title: string
  type: TipoProjeto[]
  date: string
  url: string
  description: string | null
  image1: string | null
}

export interface ProjetoDetail extends ProjetoListItem {
  image2: string | null
  image3: string | null
}

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Parceiro {
  id: number
  nome: string
  logo: string | null
  site: string | null
}

export interface CursoListItem {
  id: number
  titulo: string
  descricao: string
  carga_horaria: number
  data_inicio: string
  data_termino: string
  instrutor: string
  local: string
}

export interface CursoDetail extends CursoListItem {
  parceiros: Parceiro[]
  data_criacao: string
}

export interface NoticiaListItem {
  id: number
  titulo: string
  resumo: string
  imagem: string | null
  fonte_nome: string
  fonte_url: string
  data_publicacao: string
}

export interface NoticiaDetail extends NoticiaListItem {
  conteudo: string
  data_criacao: string
}

export interface Colaborador {
  id: number
  name: string
  funcao: string
  url_latters: string
  url_twitter: string | null
  url_facebook: string | null
  url_instagram: string | null
  url_linkedin: string | null
  foto: string | null
}

export interface GaleriaFoto {
  id: number
  titulo: string
  descricao: string
  imagem: string
  categoria: string
  data: string
  destaque: boolean
}
