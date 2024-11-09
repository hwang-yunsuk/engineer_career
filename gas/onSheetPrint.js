function onOpen() {
  const ui = SpreadsheetApp.getUi()
  const menu = ui.createMenu('印刷')
  menu.addItem('PDF_印刷実行', 'onSheetPdfPrint')
  menu.addToUi()
}

function onSheetPdfPrint() {
  // 現在選択されたシート
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()

  // シートのF3セルからファイル名用の情報を取得
  const fileName = activeSheet.getRange('F3').getValue() + '_profile'

  // PDF生成オプションを変数化
  const pdfOptions = {
    format: 'pdf',
    size: 'A4',
    portrait: false,
    sheetnames: false,
    printtitle: false,
    pagenumbers: false,
    gridlines: false,
    fzr: false // 固定された行と列
  }

  // オプションをクエリパラメータとして連結
  const queryParameters = Object.keys(pdfOptions)
    .map((key) => `${key}=${pdfOptions[key]}`)
    .join('&')

  // PDFエクスポートURLを生成
  const url = `https://docs.google.com/spreadsheets/d/${SpreadsheetApp.getActiveSpreadsheet().getId()}/export?${queryParameters}&gid=${activeSheet.getSheetId()}`

  const token = ScriptApp.getOAuthToken()

  try {
    // PDFを取得してGoogleドライブに一時保存
    const response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const blob = response.getBlob().setName(fileName + '.pdf')
    const tempFile = DriveApp.createFile(blob)

    // 一時保存したファイルのダウンロードリンクを作成
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${tempFile.getId()}`

    // ユーザーにダウンロードリンクを表示
    const html = `
      <html><body>
        <p>PDFのダウンロードリンクをクリックしてください:</p>
        <a href="${downloadUrl}" target="_blank" onclick="google.script.host.close()">PDFダウンロード</a>
      </body></html>`
    const userInterface = HtmlService.createHtmlOutput(html).setWidth(300).setHeight(150)

    SpreadsheetApp.getUi().showModalDialog(userInterface, 'PDFダウンロードリンク')

    // ダウンロードリンク表示後、ファイルを削除
    DriveApp.getFileById(tempFile.getId()).setTrashed(true)
  } catch (e) {
    SpreadsheetApp.getUi().alert(`PDF作成中にエラーが発生しました: ${e}`)
  }
}
