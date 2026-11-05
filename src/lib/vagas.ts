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
  // Vagas específicas: local de trabalho e descrição completa
  local?: string
  atividades?: string[]
  requisitos?: string[]
}

// Cidades atendidas: o candidato escolhe na lista em vez de digitar
export const CIDADES = ['São Luís', 'São José de Ribamar', 'Paço do Lumiar', 'Raposa']

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
    id: 'mecanico-caldeireiro',
    icone: '⚙️',
    aba: 'Mecânico Caldeireiro',
    titulo: 'Mecânico Caldeireiro/Soldador',
    descricao: 'Manutenção mecânica industrial, caldeiraria e soldagem: montagem, recuperação e fabricação de estruturas metálicas.',
    aberta: true,
    local: 'Área do Porto do Itaqui',
    atividades: [
      'Montagem e desmontagem de equipamentos mecânicos industriais',
      'Substituição de componentes rotativos, rolamentos, mancais e acoplamentos',
      'Alinhamentos básicos de conjuntos mecânicos',
      'Caldeiraria leve e pesada: fabricação, recuperação e montagem de estruturas metálicas',
      'Leitura de desenhos técnicos, traçagem, cortes, ajustes e conformação de chapas',
      'Corte com lixadeira e oxicorte; soldagem com Eletrodo Revestido e/ou MIG/MAG',
      'Reparos em chutes, tubulações, guarda-corpos, suportes e estruturas metálicas',
    ],
    requisitos: [
      'Ensino médio completo',
      'Curso profissionalizante em Mecânica Industrial, Caldeiraria ou Soldagem',
      'Desejável formação técnica em Mecânica, Soldagem ou Fabricação Mecânica',
      'Experiência comprovada em manutenção mecânica industrial, caldeiraria e soldagem',
      'Leitura e interpretação de desenhos técnicos',
      'Domínio de ferramentas manuais, elétricas e equipamentos de corte',
    ],
    campos: [
      {
        id: 'formacao',
        label: 'Formação na área',
        opcoes: [
          'Curso profissionalizante (Mecânica, Caldeiraria ou Soldagem)',
          'Técnico em Mecânica, Soldagem ou Fabricação Mecânica',
          'Nenhuma',
        ],
      },
      {
        id: 'soldagem',
        label: 'Processos de soldagem',
        opcoes: ['Eletrodo Revestido', 'MIG/MAG', 'Eletrodo Revestido e MIG/MAG', 'Nenhum'],
      },
      {
        id: 'experiencia',
        label: 'Experiência em manutenção industrial',
        opcoes: ['Sem experiência', 'Menos de 1 ano', '1 a 3 anos', 'Mais de 3 anos'],
      },
      {
        id: 'desenho',
        label: 'Leitura de desenho técnico',
        opcoes: ['Sim', 'Básica', 'Não'],
      },
    ],
    placeholderObs: 'Cursos, NRs, empresas onde trabalhou e equipamentos que domina…',
  },
  {
    id: 'auxiliar-mecanico',
    icone: '🔩',
    aba: 'Aux. de Mecânico',
    titulo: 'Auxiliar de Mecânico Caldeireiro/Soldador',
    descricao: 'Apoio aos mecânicos, caldeireiros e soldadores nas atividades de manutenção mecânica, caldeiraria e soldagem.',
    aberta: true,
    local: 'Área do Porto do Itaqui',
    atividades: [
      'Auxiliar mecânicos, caldeireiros e soldadores nas atividades diárias',
      'Apoiar no posicionamento, alinhamento e fixação de peças e estruturas metálicas',
      'Limpeza, acabamento e esmerilhamento de peças e cordões de solda',
      'Movimentação e preparação de ferramentas, materiais e componentes',
      'Suporte na desmontagem e montagem de equipamentos mecânicos',
      'Organização, conservação e limpeza do ambiente de trabalho',
      'Cumprir os procedimentos de segurança e usar corretamente os EPIs',
    ],
    requisitos: [
      'Ensino médio completo',
      'Diferencial: curso técnico em Mecânica, Soldagem ou Fabricação Mecânica',
      'Desejável experiência em ambiente industrial, manutenção mecânica ou caldeiraria',
      'Conhecimento básico de ferramentas manuais e elétricas',
      'Comprometimento, organização e disposição para trabalho em equipe',
    ],
    campos: [
      {
        id: 'escolaridade',
        label: 'Escolaridade',
        opcoes: ['Ensino Médio incompleto', 'Ensino Médio completo', 'Cursando curso técnico', 'Curso técnico completo'],
      },
      {
        id: 'curso_tecnico',
        label: 'Curso técnico',
        opcoes: ['Mecânica', 'Soldagem', 'Fabricação Mecânica', 'Outro', 'Nenhum'],
      },
      {
        id: 'experiencia',
        label: 'Experiência em ambiente industrial',
        opcoes: ['Sem experiência', 'Menos de 1 ano', '1 a 2 anos', 'Mais de 2 anos'],
      },
    ],
    placeholderObs: 'Cursos, NRs e experiências que queira destacar…',
  },
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
