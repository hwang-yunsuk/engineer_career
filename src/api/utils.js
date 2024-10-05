/* eslint-disable no-undef */
export const request = (apiFunctionName, payload = {}) => {
  payload = JSON.stringify(payload)
  return new Promise((reslove, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        reslove(JSON.parse(res))
      })
      .withFailureHandler((err) => reject(err))
      [apiFunctionName](payload)
  })
}

export const pdfDownload = (fileName, data) => {
  // ダウンロード処理
  const pdfBlob = new Blob([Uint8Array.from(data)], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(pdfBlob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = `${fileName}_profile.pdf`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
}
