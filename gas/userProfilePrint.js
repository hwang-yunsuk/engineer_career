function apiUserProfilePrint(data) {
  const payload = JSON.parse(data)
  const ss = SpreadsheetApp.openById(SHEET_ID)

  let userName = ''
  // ユーザー略名の確認
  if (payload.userInitial) {
    userName = payload.userInitial
  } else {
    userName = payload.userName
  }

  const profileTemplateSheet = ss.getSheetByName('profileTemplate')
  const printSheet = profileTemplateSheet.copyTo(ss)
  printSheet.setName(userName + '_' + new Date().getTime())

  const getUserDetailList = getUserSearchDetailList(ss, payload.userName, payload.userEmail)

  if (getUserDetailList.length < 1) {
    return JSON.stringify({
      call: false,
      message: 'not find getUserDetailList'
    })
  }

  fillUserProfileData(printSheet, payload, getUserDetailList)

  // すべての変更を強制的に適用
  SpreadsheetApp.flush()

  const pdfBlob = generatePdfFromSheet(printSheet)
  return JSON.stringify({
    data: pdfBlob.getBytes(),
    call: true,
    message: '印刷しました。'
  })
}

function sendPdfAsResponse(pdfBlob) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.PDF)
    .setContent(pdfBlob.getBytes())
}

function fillUserProfileData(sheet, payload, getUserDetailList) {
  let userName = ''
  let userNameFurikana = ''
  // ユーザー略名の確認
  if (payload.userInitial) {
    userName = payload.userInitial
  } else {
    userName = payload.userName
    userNameFurikana = payload.userNameFurikana
  }

  // 基本情報の入力
  sheet.getRange('F2').setValue(userNameFurikana)
  sheet.getRange('F3').setValue(userName)
  sheet.getRange('H3').setValue(payload.userGender)
  sheet.getRange('F5').setValue(payload.userAdress)

  // 生年月日から年のみを取得して入力
  const birthYear = payload.userBirthdate.split('-')[0]
  sheet.getRange('I3').setValue(birthYear)

  sheet.getRange('J3').setValue(payload.userAge)
  sheet.getRange('K3').setValue(payload.userEducation)
  sheet.getRange('S3').setValue(payload.licenses)

  // userDetailListの処理
  const startRow = 11
  getUserDetailList.forEach((detail, index) => {
    const currentRow = startRow + index

    // 必要ならば、行をコピーして追加
    if (index > 0) {
      const rangeToCopy = sheet.getRange('A11:Y11')
      rangeToCopy.copyTo(sheet.getRange(`A${currentRow}:Y${currentRow}`))

      // Noが偶数の場合、A列からY列の背景色を#dcdcdcに変更
      if ((index + 1) % 2 === 0) {
        sheet.getRange(`A${currentRow}:Y${currentRow}`).setBackground('#dcdcdc')
      }

      // 行の高さを基本187ピクセルに設定
      sheet.setRowHeight(currentRow, 187)

      // コピーした行のデータを削除（初期化）
      sheet.getRange(`A${currentRow}:Y${currentRow}`).clearContent()
    }

    // 詳細情報の入力
    sheet.getRange(`A${currentRow}`).setValue(index + 1)
    sheet.getRange(`B${currentRow}`).setValue(detail.startDate)
    const csheet = sheet.getRange(`C${currentRow}`)
    if (csheet != '') {
      csheet.setValue('～')
    }
    sheet.getRange(`D${currentRow}`).setValue(detail.endDate)
    sheet.getRange(`E${currentRow}`).setValue(detail.monthOfNumber)
    sheet.getRange(`F${currentRow}`).setValue(detail.businessCategory)

    const systemAndDetails = detail.systemName + '\n' + detail.workDetails
    const systemAndDetailsCell = sheet.getRange(`G${currentRow}`)
    systemAndDetailsCell.setValue(systemAndDetails)

    // 文字数に基づいて行の高さを設定
    const estimatedHeight = estimateRowHeight(systemAndDetails)
    // 既に 187px 以上であればそのまま、187px 未満であれば既定の 187px を維持
    sheet.setRowHeight(currentRow, estimatedHeight)

    sheet.getRange(`H${currentRow}`).setValue(detail.osTypeOption)
    sheet.getRange(`I${currentRow}`).setValue(detail.dbTypeOption)
    sheet.getRange(`J${currentRow}`).setValue(detail.developmentTypeOption)

    const projectPhaseTypeOption = detail.projectPhaseTypeOption.split(',')

    projectPhaseTypeOption.forEach((option) => {
      switch (option) {
        case '企画':
          sheet.getRange(`L${currentRow}`).setValue('◯')
          break
        case '調査分析':
          sheet.getRange(`M${currentRow}`).setValue('◯')
          break
        case '基本設計':
          sheet.getRange(`N${currentRow}`).setValue('◯')
          break
        case '詳細設計':
          sheet.getRange(`O${currentRow}`).setValue('◯')
          break
        case '製造・構築':
          sheet.getRange(`P${currentRow}`).setValue('◯')
          break
        case '単体テスト':
          sheet.getRange(`Q${currentRow}`).setValue('◯')
          break
        case '結合テスト':
          sheet.getRange(`R${currentRow}`).setValue('◯')
          break
        case '総合テスト':
          sheet.getRange(`S${currentRow}`).setValue('◯')
          break
        case '保守・運用':
          sheet.getRange(`T${currentRow}`).setValue('◯')
          break
        case 'ユーザ指導':
          sheet.getRange(`U${currentRow}`).setValue('◯')
          break
        case 'リーダー':
          sheet.getRange(`W${currentRow}`).setValue('◯')
          break
        case 'サブリーダー':
          sheet.getRange(`X${currentRow}`).setValue('◯')
          break
        default:
          // どの項目にも当てはまらなかった場合
          sheet.getRange(`V${currentRow}`).setValue(option)
          break
      }
    })

    sheet.getRange(`Y${currentRow}`).setValue(detail.comment)
  })
}

function generatePdfFromSheet(sheet) {
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

  const url = `https://docs.google.com/spreadsheets/d/${SpreadsheetApp.getActiveSpreadsheet().getId()}/export?${queryParameters}&gid=${sheet.getSheetId()}`

  const token = ScriptApp.getOAuthToken()
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  return response.getBlob().setName(sheet.getName() + '.pdf')
}

function estimateRowHeight(content) {
  // 1行あたりの標準の高さ（ピクセル）
  const baseHeight = 15
  const minHeight = 187 // 最低高さ
  // 1行あたりの平均文字数
  const avgCharsPerLine = 60 // 長い文章に合わせて調整
  // 改行数を取得
  const lineBreaks = content.split('\n').length - 1
  // 改行を含めてコンテンツの長さに応じた高さを計算
  const numLines = Math.ceil(content.length / avgCharsPerLine) + lineBreaks
  const estimatedHeight = baseHeight * numLines
  // 最低高さ以上であればその高さを返し、それ以下なら最低高さを返す
  return Math.max(estimatedHeight, minHeight)
}
