// optionListを取得
function apiGetOptionList() {
  const sheetNames = ['osTypes', 'databaseTypes', 'developmentLanguagesAndTools', 'projectPhase']

  const optionList = {}

  sheetNames.forEach((sheetName) => {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
    const data = sheet.getDataRange().getValues()

    const result = {}

    for (let i = 1; i < data.length; i++) {
      const [no, type, typeName, examples, valid] = data[i]

      if (valid === false) {
        continue
      }

      if (!result[type]) {
        result[type] = {
          type: typeName,
          examples: []
        }
      }

      // 新しい例を配列に追加
      result[type].examples.push(...examples.split(',').map((example) => example.trim()))
    }

    // 重複を排除するためにexamplesを一意にする
    for (let key in result) {
      result[key].examples = [...new Set(result[key].examples)]
    }

    optionList[sheetName] = result
  })
  return JSON.stringify({
    data: optionList,
    call: true,
    message: 'get optionList'
  })
}
