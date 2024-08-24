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

  return array.join('、')
}
