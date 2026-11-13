/**
 * Solicitações de proposta do site (leads) -> planilha do Google.
 *
 * Como instalar (uma vez):
 * 1. Abra a planilha, menu Extensões > Apps Script.
 * 2. Apague o conteúdo do editor, cole este arquivo e troque SEGREDO pelo mesmo valor
 *    da variável GOOGLE_SHEETS_WEBHOOK_SECRET da Vercel. Salve.
 * 3. Implantar > Nova implantação > tipo "App da Web".
 *    Executar como: "Eu"; Quem pode acessar: "Qualquer pessoa". Implantar e autorizar.
 * 4. Copie a URL do app da Web (termina em /exec) para GOOGLE_SHEETS_WEBHOOK_URL na Vercel.
 * 5. Cadência de e-mails: rode uma vez a função instalarCadencia (Executar > instalarCadencia).
 *
 * Se editar este script depois, use Implantar > Gerenciar implantações > editar > "Nova versão",
 * para manter a mesma URL.
 */

const SEGREDO = 'COLE_AQUI_O_SEGREDO'

// Aviso por e-mail a cada novo lead (separe vários endereços por vírgula; deixe '' para desligar)
const AVISO_PARA = 'comercial@serviscon.com.br'

// Cadência de e-mails para os leads do site
const CADENCIA_ATIVA = true
const RESPONDER_PARA = 'comercial@serviscon.com.br'
const FUSO = 'America/Fortaleza'
const HORA_DO_ENVIO = 9 // envio diário, em dias úteis
const RESERVA_DE_COTA = 10 // envios guardados para os avisos ao comercial

const SITE = 'https://landing.serviscon.com.br'
// URL deste app da Web (Implantar > Gerenciar implantações), usada no link de descadastro
const URL_WEB_APP = 'COLE_AQUI_A_URL_DO_APP_DA_WEB'
const WHATSAPP = 'https://wa.me/5598986133076?text=' +
  encodeURIComponent('Olá! Recebi o e-mail da Serviscon e gostaria de falar sobre uma proposta.')

const STATUS = {
  ATIVA: 'Ativa',
  PAUSADA: 'Pausada',
  RESPONDEU: 'Respondeu',
  CLIENTE: 'Cliente',
  DESCADASTRADO: 'Descadastrado',
  CONCLUIDA: 'Concluída',
  DUPLICADO: 'Duplicado',
}

/**
 * Cada informação vai para a coluna cujo título (linha 1) bate com um dos nomes aceitos,
 * em qualquer ordem e ignorando acentos/maiúsculas. Se não existir, a coluna é criada
 * no fim do cabeçalho com o título de "nova".
 */
const CAMPOS = [
  { chave: 'nome', aceitos: ['NOME', 'NOME DO CONTATO', 'RESPONSAVEL'], nova: 'NOME' },
  { chave: 'email', aceitos: ['E-MAIL', 'EMAIL'], nova: 'E-MAIL' },
  { chave: 'telefone', aceitos: ['CONTATO', 'TELEFONE', 'WHATSAPP', 'CELULAR'], nova: 'CONTATO' },
  { chave: 'empresa', aceitos: ['EMPRESA', 'RAZAO SOCIAL'], nova: 'EMPRESA' },
  { chave: 'assunto', aceitos: ['SERVIÇO DE INTERESSE', 'SERVIÇO', 'SERVIÇOS', 'ASSUNTO'], nova: 'SERVIÇO DE INTERESSE' },
  { chave: 'mensagem', aceitos: ['MENSAGEM', 'OBSERVAÇÕES', 'OBSERVAÇÃO'], nova: 'MENSAGEM' },
  { chave: 'dataHora', aceitos: ['DATA/HORA', 'DATA', 'DATA DO CONTATO'], nova: 'DATA/HORA' },
  { chave: 'origem', aceitos: ['ORIGEM', 'FONTE'], nova: 'ORIGEM' },
  { chave: 'enviados', aceitos: ['E-MAILS ENVIADOS'], nova: 'E-MAILS ENVIADOS' },
  { chave: 'proximo', aceitos: ['PRÓXIMO E-MAIL'], nova: 'PRÓXIMO E-MAIL' },
  { chave: 'status', aceitos: ['STATUS CADÊNCIA', 'STATUS DA CADÊNCIA'], nova: 'STATUS CADÊNCIA' },
]

/**
 * A cadência: dia (contado a partir da chegada do lead) e conteúdo de cada e-mail.
 * Para mudar textos ou prazos, edite aqui e publique uma nova versão.
 */
const CADENCIA = [
  { dia: 0, montar: emailBoasVindas },
  { dia: 2, montar: emailServicos },
  { dia: 5, montar: emailDiferenciais },
  { dia: 10, montar: emailSegmentos },
  { dia: 20, montar: emailUltimoLembrete },
]

// ---------------------------------------------------------------- recebimento do lead (site)

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents)
    if (dados.secret !== SEGREDO) return resposta({ ok: false, error: 'não autorizado' })
    dados.origem = dados.origem || 'Site'

    let aba, colunas, numeroLinha
    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
      // Grava na primeira aba da planilha
      aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
      colunas = colunasDoCabecalho(aba)

      // Um mesmo e-mail não recebe a cadência duas vezes ao mesmo tempo
      const emCadencia = CADENCIA_ATIVA && emailComCadenciaAtiva(aba, colunas, dados.email)
      dados.enviados = '0'
      dados.proximo = ''
      dados.status = !CADENCIA_ATIVA ? '' : emCadencia ? STATUS.DUPLICADO : STATUS.ATIVA

      const linha = new Array(colunas.total).fill('')
      CAMPOS.forEach(campo => {
        linha[colunas[campo.chave]] = seguro(dados[campo.chave])
      })

      // Grava como texto puro: impede que o conteúdo enviado vire fórmula
      numeroLinha = aba.getLastRow() + 1
      const destino = aba.getRange(numeroLinha, 1, 1, linha.length)
      destino.setNumberFormat('@')
      destino.setValues([linha])
    } finally {
      lock.releaseLock()
    }

    // O lead já está salvo: falhas nos e-mails não devem devolver erro ao site
    try {
      avisarComercial(dados)
    } catch (erro) {
      console.error('Falha ao enviar aviso de lead: ' + erro)
    }

    if (dados.status === STATUS.ATIVA) {
      try {
        enviarProximoEmail(aba, colunas, numeroLinha, dados)
      } catch (erro) {
        console.error('Falha ao enviar o 1º e-mail da cadência: ' + erro)
      }
    }

    return resposta({ ok: true })
  } catch (erro) {
    return resposta({ ok: false, error: String(erro) })
  }
}

// ---------------------------------------------------------------- descadastro (link no rodapé)

function doGet(e) {
  const email = String((e && e.parameter && e.parameter.email) || '').trim().toLowerCase()
  const token = String((e && e.parameter && e.parameter.t) || '')

  if (!email || token !== tokenDescadastro(email)) {
    return pagina('Link inválido', 'Não foi possível confirmar este pedido. Se quiser, responda a qualquer e-mail nosso pedindo o descadastro.')
  }

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    const colunas = colunasDoCabecalho(aba)
    const valores = aba.getDataRange().getValues()
    for (let i = 1; i < valores.length; i++) {
      if (String(valores[i][colunas.email]).trim().toLowerCase() === email) {
        aba.getRange(i + 1, colunas.status + 1).setValue(STATUS.DESCADASTRADO)
        aba.getRange(i + 1, colunas.proximo + 1).setValue('')
      }
    }
  } finally {
    lock.releaseLock()
  }

  return pagina('Pronto!', 'Você não vai mais receber nossos e-mails. Se precisar da Serviscon, é só falar com a gente pelo site.')
}

function tokenDescadastro(email) {
  const assinatura = Utilities.computeHmacSha256Signature(String(email).trim().toLowerCase(), SEGREDO)
  return Utilities.base64EncodeWebSafe(assinatura).replace(/=+$/, '').slice(0, 24)
}

function linkDescadastro(email) {
  return URL_WEB_APP + '?email=' + encodeURIComponent(String(email).trim().toLowerCase()) +
    '&t=' + tokenDescadastro(email)
}

function pagina(titulo, texto) {
  const html =
    '<div style="font-family:Arial,sans-serif;max-width:520px;margin:60px auto;padding:32px;border-radius:16px;' +
    'background:#f5f8ff;color:#14235c;text-align:center"><h1 style="margin:0 0 12px">' + escapar(titulo) +
    '</h1><p style="font-size:16px;line-height:1.5;color:#4a5568">' + escapar(texto) +
    '</p><p><a href="' + SITE + '" style="color:#2563eb">landing.serviscon.com.br</a></p></div>'
  return HtmlService.createHtmlOutput(html).setTitle('Serviscon')
}

// ---------------------------------------------------------------- cadência

/**
 * Rode UMA vez pelo editor (Executar > instalarCadencia): autoriza o envio, cria o
 * disparo diário às 9h e a lista de status na coluna STATUS CADÊNCIA.
 */
function instalarCadencia() {
  ScriptApp.getProjectTriggers()
    .filter(gatilho => gatilho.getHandlerFunction() === 'enviarCadencia')
    .forEach(gatilho => ScriptApp.deleteTrigger(gatilho))
  ScriptApp.newTrigger('enviarCadencia').timeBased().everyDays(1).atHour(HORA_DO_ENVIO).inTimezone(FUSO).create()

  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  const colunas = colunasDoCabecalho(aba)
  const regra = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.keys(STATUS).map(chave => STATUS[chave]), true)
    .setAllowInvalid(true)
    .build()
  aba.getRange(2, colunas.status + 1, aba.getMaxRows() - 1, 1).setDataValidation(regra)

  console.log('Cadência instalada: envio diário às ' + HORA_DO_ENVIO + 'h, em dias úteis.')
}

/** Disparo diário: envia o próximo e-mail de cada lead com status Ativa e data vencida. */
function enviarCadencia() {
  if (!CADENCIA_ATIVA) return
  const diaDaSemana = Number(Utilities.formatDate(new Date(), FUSO, 'u')) // 1 = segunda ... 7 = domingo
  if (diaDaSemana >= 6) return

  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  const colunas = colunasDoCabecalho(aba)
  const valores = aba.getDataRange().getValues()
  const hoje = dataTexto(new Date())

  for (let i = 1; i < valores.length; i++) {
    const linha = valores[i]
    if (String(linha[colunas.status]).trim() !== STATUS.ATIVA) continue
    const valorProximo = linha[colunas.proximo]
    const proximo = valorProximo instanceof Date ? dataTexto(valorProximo) : String(valorProximo).trim()
    if (proximo && proximo > hoje) continue

    if (MailApp.getRemainingDailyQuota() <= RESERVA_DE_COTA) {
      console.warn('Cota diária de e-mails quase no fim: o restante sai no próximo dia útil.')
      return
    }

    const dados = {}
    CAMPOS.forEach(campo => {
      dados[campo.chave] = String(linha[colunas[campo.chave]] || '').trim()
    })
    try {
      enviarProximoEmail(aba, colunas, i + 1, dados)
    } catch (erro) {
      console.error('Falha no e-mail da cadência (linha ' + (i + 1) + '): ' + erro)
    }
  }
}

function enviarProximoEmail(aba, colunas, numeroLinha, dados) {
  const enviados = Number(dados.enviados) || 0
  const etapa = CADENCIA[enviados]
  if (!etapa || !emailValido(dados.email)) {
    aba.getRange(numeroLinha, colunas.status + 1).setValue(STATUS.CONCLUIDA)
    aba.getRange(numeroLinha, colunas.proximo + 1).setValue('')
    return
  }

  const lead = dadosDoLead(dados)
  const email = etapa.montar(lead)
  MailApp.sendEmail({
    to: dados.email,
    subject: email.assunto,
    htmlBody: modelo(email, dados.email),
    name: 'Serviscon',
    replyTo: RESPONDER_PARA,
  })

  const seguinte = CADENCIA[enviados + 1]
  aba.getRange(numeroLinha, colunas.enviados + 1).setValue(String(enviados + 1))
  aba.getRange(numeroLinha, colunas.proximo + 1).setValue(seguinte ? dataTexto(somarDias(new Date(), seguinte.dia - etapa.dia)) : '')
  if (!seguinte) aba.getRange(numeroLinha, colunas.status + 1).setValue(STATUS.CONCLUIDA)
}

function emailComCadenciaAtiva(aba, colunas, email) {
  const alvo = String(email || '').trim().toLowerCase()
  if (!alvo || aba.getLastRow() < 2) return false
  const valores = aba.getRange(2, 1, aba.getLastRow() - 1, colunas.total).getValues()
  return valores.some(linha =>
    String(linha[colunas.email]).trim().toLowerCase() === alvo && String(linha[colunas.status]).trim() === STATUS.ATIVA)
}

function dadosDoLead(dados) {
  const primeiroNome = String(dados.nome || '').trim().split(/\s+/)[0] || ''
  return {
    primeiroNome: primeiroNome ? primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase() : '',
    empresa: String(dados.empresa || '').trim(),
    servico: String(dados.assunto || '').trim(),
  }
}

/**
 * Rode pelo editor para receber os 5 e-mails da cadência no seu e-mail (ou no de AVISO_PARA),
 * do jeito que o cliente vai receber. Não grava nada na planilha.
 */
function testarCadencia() {
  const para = Session.getActiveUser().getEmail() || AVISO_PARA
  const lead = dadosDoLead({ nome: 'Maria Souza', empresa: 'Condomínio Jardins', assunto: 'Portaria' })
  CADENCIA.forEach((etapa, i) => {
    const email = etapa.montar(lead)
    MailApp.sendEmail({
      to: para,
      subject: '[TESTE ' + (i + 1) + '/' + CADENCIA.length + '] ' + email.assunto,
      htmlBody: modelo(email, para),
      name: 'Serviscon',
      replyTo: RESPONDER_PARA,
    })
  })
}

// ---------------------------------------------------------------- textos da cadência

function emailBoasVindas(lead) {
  const ola = lead.primeiroNome ? 'Olá, ' + escapar(lead.primeiroNome) + '!' : 'Olá!'
  const servico = lead.servico ? ' sobre <b>' + escapar(lead.servico) + '</b>' : ''
  return {
    assunto: (lead.primeiroNome ? lead.primeiroNome + ', recebemos' : 'Recebemos') + ' seu pedido de proposta',
    titulo: 'Recebemos seu pedido!',
    corpo:
      p(ola) +
      p('Obrigado por falar com a Serviscon. Sua solicitação' + servico + ' já está com o nosso time comercial, ' +
        'que vai entrar em contato em até <b>24 horas</b> para entender sua necessidade.') +
      p('Enquanto isso, um pouco sobre nós: somos especialistas em <b>terceirização de mão de obra</b> com ' +
        '<b>gestão completa de pessoas, suprimentos e equipamentos</b>, há mais de 10 anos ajudando empresas ' +
        'a crescer com eficiência e qualidade.'),
    botao: { texto: 'Falar agora pelo WhatsApp', link: WHATSAPP },
  }
}

function emailServicos(lead) {
  const servicos = [
    ['Limpeza e Conservação', 'Ambientes limpos, organizados e seguros todos os dias.'],
    ['Limpeza de Vidros e Fachadas', 'Vidros e fachadas impecáveis, inclusive em altura.'],
    ['Limpeza Pós-Obra', 'Ambiente livre de resíduos e pronto para uso após a obra.'],
    ['Portaria', 'Controle de acesso e atendimento a visitantes, de dia e de noite.'],
    ['Recepção', 'Primeira impressão cordial e profissional para sua empresa.'],
    ['Jardinagem e Paisagismo', 'Áreas verdes bem cuidadas e valorizadas.'],
    ['Manutenção Predial', 'Elétrica, hidráulica e reparos preventivos e corretivos.'],
    ['Supervisão', 'Acompanhamento constante da equipe e da qualidade.'],
  ]
  return {
    assunto: 'Tudo o que sua empresa precisa em um só contrato',
    titulo: 'Um parceiro, vários serviços',
    corpo:
      p((lead.primeiroNome ? escapar(lead.primeiroNome) + ', você' : 'Você') +
        ' sabia que pode concentrar vários serviços em um só fornecedor? Menos contratos, menos dor de cabeça e uma equipe só cuidando de tudo:') +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 8px">' +
      servicos.map(([nome, texto]) =>
        '<tr><td style="background:#f5f8ff;border-left:4px solid #2563eb;border-radius:8px;padding:12px 16px">' +
        '<b style="color:#14235c">' + nome + '</b><br><span style="color:#4a5568;font-size:14px">' + texto + '</span></td></tr>').join('') +
      '</table>',
    botao: { texto: 'Conhecer os serviços', link: SITE + '/#services' },
  }
}

function emailDiferenciais() {
  const numero = (valor, texto) =>
    '<td align="center" style="padding:16px 8px;background:#f5f8ff;border-radius:12px">' +
    '<div style="font-size:30px;font-weight:bold;color:#2563eb">' + valor + '</div>' +
    '<div style="font-size:13px;color:#4a5568;margin-top:4px">' + texto + '</div></td>'
  return {
    assunto: 'Por que empresas escolhem a Serviscon',
    titulo: 'Resultado que aparece',
    corpo:
      p('Nossos clientes contam com uma equipe qualificada, gestão completa e supervisão constante. Na prática, isso significa:') +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:8px 0;margin:8px 0 16px"><tr>' +
      numero('24h', 'resposta do orçamento') + numero('30 dias', 'implementação média') + numero('30%', 'economia média') +
      '</tr></table>' +
      p('E estamos sempre nos atualizando: acompanhe nossas novidades, como a participação na Higiexpo 2026, ' +
        'a maior feira de limpeza profissional da América Latina, em <a href="' + SITE + '/noticias" style="color:#2563eb">nossas notícias</a>.'),
    botao: { texto: 'Pedir meu orçamento gratuito', link: SITE + '/#fale-conosco' },
  }
}

function emailSegmentos(lead) {
  const segmentos = ['Shoppings e Varejo', 'Educação', 'Condomínios', 'Órgãos Públicos', 'Saúde', 'Industrial']
  return {
    assunto: 'Atendemos empresas como a ' + (lead.empresa || 'sua'),
    titulo: 'Experiência no seu segmento',
    corpo:
      p('Cada tipo de negócio tem uma rotina diferente, e a nossa equipe se adapta a ela. Hoje a Serviscon atende:') +
      '<p style="margin:0 0 16px;line-height:2.2">' +
      segmentos.map(nome =>
        '<span style="display:inline-block;background:#e8faf6;color:#0f766e;font-weight:bold;font-size:14px;' +
        'padding:4px 12px;border-radius:999px;margin-right:6px">' + nome + '</span>').join('') +
      '</p>' +
      p('Quer ver como ficaria' + (lead.empresa ? ' para a <b>' + escapar(lead.empresa) + '</b>' : ' para a sua empresa') +
        '? Nosso orçamento é <b>gratuito</b> e sem compromisso.'),
    botao: { texto: 'Conversar com o comercial', link: WHATSAPP },
  }
}

function emailUltimoLembrete(lead) {
  return {
    assunto: 'Ainda podemos ajudar' + (lead.primeiroNome ? ', ' + lead.primeiroNome : '') + '?',
    titulo: 'Ainda podemos ajudar?',
    corpo:
      p((lead.primeiroNome ? escapar(lead.primeiroNome) + ', este' : 'Este') +
        ' é o nosso último e-mail desta série. Se a sua necessidade' +
        (lead.servico ? ' de <b>' + escapar(lead.servico) + '</b>' : '') + ' continua, é só responder esta mensagem ou nos chamar no WhatsApp.') +
      p('Se não for o momento, tudo bem: estaremos por aqui quando precisar.'),
    botao: { texto: 'Quero falar com a Serviscon', link: WHATSAPP },
  }
}

function p(html) {
  return '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#334155">' + html + '</p>'
}

function modelo(email, para) {
  return (
    '<div style="background:#eef2fb;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">' +
    '<tr><td style="background:#1e3a8a;padding:22px 32px"><img src="' + SITE + '/serviscon-logo.png" alt="Serviscon" width="150" style="display:block;border:0"></td></tr>' +
    '<tr><td style="padding:32px">' +
    '<h1 style="margin:0 0 20px;font-size:24px;color:#14235c">' + email.titulo + '</h1>' +
    email.corpo +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 0"><tr><td style="background:#16a34a;border-radius:999px">' +
    '<a href="' + email.botao.link + '" style="display:inline-block;padding:14px 28px;color:#ffffff;font-weight:bold;font-size:16px;text-decoration:none">' +
    email.botao.texto + '</a></td></tr></table>' +
    '</td></tr>' +
    '<tr><td style="background:#f5f8ff;padding:20px 32px;font-size:12px;line-height:1.6;color:#64748b">' +
    '<b style="color:#14235c">Serviscon</b> · R. dos Timbós, 75-15 – Jardim Renascença, São Luís – MA<br>' +
    'WhatsApp (98) 98613-3076 · comercial@serviscon.com.br · <a href="' + SITE + '" style="color:#2563eb">landing.serviscon.com.br</a><br>' +
    'Você recebeu este e-mail porque solicitou uma proposta em nosso site. ' +
    '<a href="' + linkDescadastro(para) + '" style="color:#64748b">Não quero mais receber</a>.' +
    '</td></tr></table></div>'
  )
}

// ---------------------------------------------------------------- aviso ao comercial

function avisarComercial(dados) {
  if (!AVISO_PARA) return

  const quem = dados.empresa || dados.nome
  const linhas = [
    ['Nome', dados.nome],
    ['Empresa', dados.empresa],
    ['E-mail', dados.email],
    ['Telefone', dados.telefone],
    ['Serviço de interesse', dados.assunto],
    ['Mensagem', dados.mensagem],
    ['Recebido em', dados.dataHora],
  ].filter(([, valor]) => valor)

  const digitos = String(dados.telefone || '').replace(/\D/g, '')
  const whatsapp = digitos ? 'https://wa.me/' + (digitos.indexOf('55') === 0 ? digitos : '55' + digitos) : ''
  const planilha = SpreadsheetApp.getActiveSpreadsheet().getUrl()

  const html =
    '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937">' +
    '<h2 style="color:#1e3a8a;margin:0 0 12px">Novo lead pelo site</h2>' +
    '<table style="border-collapse:collapse">' +
    linhas
      .map(
        ([rotulo, valor]) =>
          '<tr><td style="padding:4px 14px 4px 0;color:#64748b;vertical-align:top"><b>' + escapar(rotulo) +
          '</b></td><td style="padding:4px 0;white-space:pre-line">' + escapar(valor) + '</td></tr>'
      )
      .join('') +
    '</table>' +
    '<p style="margin-top:16px">' +
    (whatsapp ? '<a href="' + whatsapp + '">Chamar no WhatsApp</a> · ' : '') +
    '<a href="' + planilha + '">Abrir planilha de leads</a></p>' +
    (dados.status === STATUS.ATIVA
      ? '<p style="color:#64748b;font-size:12px">O cliente entrou na cadência de e-mails. Quando ele responder ou fechar, ' +
        'mude o STATUS CADÊNCIA na planilha para parar os envios.</p>'
      : '') +
    '<p style="color:#94a3b8;font-size:12px">Responda este e-mail para escrever direto ao cliente.</p>' +
    '</div>'

  MailApp.sendEmail({
    to: AVISO_PARA,
    subject: 'Novo lead do site: ' + quem + (dados.assunto ? ' – ' + dados.assunto : ''),
    htmlBody: html,
    name: 'Site Serviscon',
    replyTo: dados.email,
  })
}

/**
 * Rode esta função uma vez pelo editor (Executar > testarAviso) para autorizar o envio
 * de e-mails e conferir como o aviso chega. Não grava nada na planilha.
 */
function testarAviso() {
  avisarComercial({
    nome: 'TESTE - Maria Souza',
    empresa: 'Empresa de Teste',
    email: 'teste@exemplo.com',
    telefone: '(98) 90000-0000',
    assunto: 'Portaria',
    mensagem: 'Este é um aviso de teste enviado pelo editor do Apps Script.',
    dataHora: new Date().toLocaleString('pt-BR'),
  })
}

// ---------------------------------------------------------------- utilitários

function escapar(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

function dataTexto(data) {
  return Utilities.formatDate(data, FUSO, 'yyyy-MM-dd')
}

function somarDias(data, dias) {
  return new Date(data.getTime() + dias * 24 * 60 * 60 * 1000)
}

// Índice (0-based) da coluna de cada campo; cria no cabeçalho as que faltarem
function colunasDoCabecalho(aba) {
  const ultimaColuna = aba.getLastColumn()
  const titulos = ultimaColuna > 0 ? aba.getRange(1, 1, 1, ultimaColuna).getValues()[0].map(normalizar) : []
  while (titulos.length > 0 && titulos[titulos.length - 1] === '') titulos.pop()

  const colunas = {}
  CAMPOS.forEach(campo => {
    const indice = titulos.findIndex(titulo => campo.aceitos.map(normalizar).indexOf(titulo) !== -1)
    if (indice !== -1) {
      colunas[campo.chave] = indice
    } else {
      titulos.push(normalizar(campo.nova))
      colunas[campo.chave] = titulos.length - 1
      aba.getRange(1, titulos.length).setValue(campo.nova).setFontWeight('bold')
    }
  })
  colunas.total = titulos.length
  return colunas
}

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
}

function seguro(valor) {
  const texto = String(valor == null ? '' : valor)
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto
}

function resposta(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON)
}
