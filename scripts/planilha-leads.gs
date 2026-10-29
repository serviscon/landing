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
 *
 * Se editar este script depois, use Implantar > Gerenciar implantações > editar > "Nova versão",
 * para manter a mesma URL.
 */

const SEGREDO = 'COLE_AQUI_O_SEGREDO'

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
]

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents)
    if (dados.secret !== SEGREDO) return resposta({ ok: false, error: 'não autorizado' })
    dados.origem = dados.origem || 'Site'

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
      // Grava na primeira aba da planilha
      const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
      const colunas = colunasDoCabecalho(aba)

      const linha = new Array(colunas.total).fill('')
      CAMPOS.forEach(campo => {
        linha[colunas[campo.chave]] = seguro(dados[campo.chave])
      })

      // Grava como texto puro: impede que o conteúdo enviado vire fórmula
      const destino = aba.getRange(aba.getLastRow() + 1, 1, 1, linha.length)
      destino.setNumberFormat('@')
      destino.setValues([linha])
    } finally {
      lock.releaseLock()
    }

    return resposta({ ok: true })
  } catch (erro) {
    return resposta({ ok: false, error: String(erro) })
  }
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
