/**
 * Áreas exibidas na página Trabalhe Conosco.
 * Para abrir/fechar uma área ou mudar os campos, edite esta lista.
 */

export type CampoExtra = {
  id: string
  label: string
  opcoes: string[]
}

export type Vaga = {
  id: string
  icone: string
  aba: string
  titulo: string
  descricao: string
  aberta: boolean
  campos: CampoExtra[]
  placeholderObs?: string
}

const EXPERIENCIA: CampoExtra = {
  id: 'experiencia',
  label: 'Experiência na área',
  opcoes: ['Sem experiência', 'Menos de 1 ano', '1 a 2 anos', 'Mais de 2 anos'],
}

const DISPONIBILIDADE: CampoExtra = {
  id: 'disponibilidade',
  label: 'Disponibilidade de horário',
  opcoes: ['Manhã (6h – 14h)', 'Tarde (14h – 22h)', 'Noite (22h – 6h)', 'Integral / Flexível'],
}

export const VAGAS: Vaga[] = [
  {
    id: 'servicos-gerais',
    icone: '🧹',
    aba: 'Aux. Serviços Gerais',
    titulo: 'Auxiliar de Serviços Gerais',
    descricao: 'Limpeza, conservação e organização de ambientes internos e externos.',
    aberta: true,
    campos: [EXPERIENCIA, DISPONIBILIDADE],
  },
  {
    id: 'copeira',
    icone: '☕',
    aba: 'Copeira',
    titulo: 'Copeira',
    descricao: 'Preparo e distribuição de alimentos, organização de copa e refeitório.',
    aberta: true,
    campos: [EXPERIENCIA, DISPONIBILIDADE],
  },
  {
    id: 'portaria',
    icone: '🚪',
    aba: 'Portaria',
    titulo: 'Portaria',
    descricao: 'Controle de acesso, recepção de visitantes e monitoramento da entrada e saída.',
    aberta: true,
    campos: [
      EXPERIENCIA,
      {
        id: 'turno',
        label: 'Turno de preferência',
        opcoes: ['Diurno (6h – 18h)', 'Noturno (18h – 6h)', '12h × 36h', 'Flexível'],
      },
    ],
  },
  {
    id: 'recepcao',
    icone: '📋',
    aba: 'Recepção',
    titulo: 'Recepção',
    descricao: 'Atendimento ao público, agendamentos, suporte administrativo e relações interpessoais.',
    aberta: true,
    campos: [
      {
        id: 'escolaridade',
        label: 'Escolaridade',
        opcoes: ['Ensino Médio completo', 'Cursando Ensino Superior', 'Ensino Superior completo'],
      },
      EXPERIENCIA,
    ],
    placeholderObs: 'Idiomas, habilidades no pacote Office, etc.',
  },
  {
    id: 'jardinagem',
    icone: '🌿',
    aba: 'Jardinagem',
    titulo: 'Jardinagem e Paisagismo',
    descricao: 'Manutenção de jardins, áreas verdes, poda, plantio e conservação de espaços externos.',
    aberta: true,
    campos: [
      EXPERIENCIA,
      {
        id: 'habilidade',
        label: 'Habilidade específica',
        opcoes: ['Poda e jardinagem geral', 'Paisagismo', 'Irrigação e hidráulica', 'Controle de pragas'],
      },
    ],
  },
  {
    id: 'manutencao',
    icone: '🔧',
    aba: 'Manutenção Predial',
    titulo: 'Manutenção Predial',
    descricao: 'Manutenção preventiva e corretiva de instalações elétricas, hidráulicas e civis.',
    aberta: true,
    campos: [
      {
        id: 'especialidade',
        label: 'Especialidade principal',
        opcoes: [
          'Elétrica predial',
          'Hidráulica',
          'Ar-condicionado / Refrigeração',
          'Pintura e acabamento',
          'Manutenção geral',
        ],
      },
      {
        id: 'certificacao',
        label: 'Certificação / NR',
        opcoes: ['NR-10 (Elétrica)', 'NR-35 (Trabalho em altura)', 'NR-12 (Máquinas)', 'Nenhuma'],
      },
      {
        id: 'experiencia',
        label: 'Experiência na área',
        opcoes: ['Sem experiência', 'Menos de 1 ano', '1 a 3 anos', 'Mais de 3 anos'],
      },
      {
        id: 'disponibilidade',
        label: 'Disponibilidade',
        opcoes: ['Comercial (8h – 18h)', 'Plantão / 12×36', 'Flexível'],
      },
    ],
    placeholderObs: 'Informe habilidades, cursos ou qualificações adicionais…',
  },
]

export function getVaga(id: string): Vaga | undefined {
  return VAGAS.find(vaga => vaga.id === id)
}

// A Vercel limita o corpo da requisição a 4,5 MB, então o currículo fica em 4 MB
export const CURRICULO_MAX_BYTES = 4 * 1024 * 1024
export const CURRICULO_EXTENSOES = ['pdf', 'doc', 'docx']
