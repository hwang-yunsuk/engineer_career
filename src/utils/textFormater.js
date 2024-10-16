export function formatNewlines(text) {
  return text.replace(/\n/g, '<br>')
}

// 文字列を配列に戻す
export function processOption(item) {
  if (!item) {
    return []
  }

  // 1. 「,」で分割して配列化
  let typeArray = item.split(',')

  // 2. 各要素から括弧を削除
  typeArray = typeArray.map((item) => item.replace(/\(|\)/g, '').trim())

  // 結果を配列として返す
  return typeArray
}

// 資格情報の解析関数
export function parseLicenses(licensesString) {
  if (!licensesString) {
    return [{ value: '', license: '', year: '', month: '', isLast: true }]
  }

  const licensesArray = licensesString.split('\n').map((license) => {
    const [licenseName, date] = license.split(' ')
    const [year, month] = date.split('/')
    return { license: licenseName, year: year, month: month, isLast: false }
  })

  // 最後の要素の isLast を true にする
  if (licensesArray.length > 0) {
    licensesArray[licensesArray.length - 1].isLast = true
  }

  return licensesArray ?? [{ value: '', license: '', year: '', month: '', isLast: true }]
}
