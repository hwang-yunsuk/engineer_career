export function formatDateToYYYYMMDD(date) {
  if (!(date instanceof Date)) {
    return null
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatDateToYYYYMM(date) {
  if (!date) {
    return null
  }

  const [year, month] = date.split('/')

  return { year: year, month: month }
}

export function formatYYYYMMDDToDate(date) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}
