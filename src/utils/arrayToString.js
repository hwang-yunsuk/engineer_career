export function arrayToCommaValue(array) {
  if (!Array.isArray(array)) {
    return null
  }

  // フィルタリングされた有効な値の配列を生成
  const filteredValues = array
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '')
    .map((item) => item.value)

  // フィルタリング後の配列が空の場合はnullを返す
  if (filteredValues.length === 0) {
    return null
  }

  // 有効な値を「、」で結合
  return filteredValues.join('、')
}

export function arrayToCommaString(array) {
  if (!Array.isArray(array)) {
    return null
  }

  // optionEtcEdit のオブジェクトを探す
  const optionEtcIndex = array.findIndex((item) => typeof item === 'object' && item.optionEtcEdit)
  if (optionEtcIndex === -1) {
    return array.join('、')
  }

  const optionEtcEditValue = array[optionEtcIndex].optionEtcEdit.replace(/^\(|\)$/g, '') // カッコを取り除く

  // 配列内の文字列と optionEtcEditValue を比較して一致する場合に置換
  const processedArray = array
    .filter((item, index) => index !== optionEtcIndex) // optionEtcEditのオブジェクトを除外
    .map((item) => {
      if (typeof item === 'string' && item === optionEtcEditValue) {
        return array[optionEtcIndex].optionEtcEdit // カッコ付きの値に置換
      }
      return item
    })

  return processedArray.join('、')
}
