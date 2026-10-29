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

// Grava na primeira aba da planilha
const CABECALHO = ['Data/hora', 'Nome', 'E-mail', 'Telefone', 'Empresa', 'Serviço de interesse', 'Mensagem']

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents)
    if (dados.secret !== SEGREDO) return resposta({ ok: false, error: 'não autorizado' })

    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO)
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold')
      aba.setFrozenRows(1)
    }

    const linha = [dados.dataHora, dados.nome, dados.email, dados.telefone, dados.empresa, dados.assunto, dados.mensagem].map(
      seguro
    )

    // Grava como texto puro: impede que o conteúdo enviado vire fórmula
    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
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

function seguro(valor) {
  const texto = String(valor == null ? '' : valor)
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto
}

function resposta(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON)
}
