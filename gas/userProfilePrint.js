function apiUserProfilePrint(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID)

  const payload = JSON.parse(data)
  console.log('payload : ', payload)

  return JSON.stringify({
    call: true,
    message: '印刷しました。'
  })
}
