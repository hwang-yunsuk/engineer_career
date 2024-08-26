function registerUserProfile(data) {
  // スプレッドシートのIDを設定
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const userProfileSheet = ss.getSheetByName('userProfile')
  const userProfileDetailSheet = ss.getSheetByName('userProfileDetail')
  const userInfoSheet = ss.getSheetByName('userInfo')

  payload = JSON.parse(data)

  const userProfileLastRow = userProfileSheet.getLastRow()

  // ユーザープロフィール情報を取得し、スプレッドシートに登録
  const licenses = payload.licenses.map((license) => license.value).join('\n')
  const userProfileRow = [
    userProfileLastRow,
    payload.userName,
    payload.userNameFurikana,
    payload.userEmail,
    payload.userAdress,
    payload.userGender,
    payload.userBirthdate.split('T')[0], // "yyyy-mm-dd"形式に変換
    payload.userAge,
    payload.userEducation,
    licenses
  ]

  // userProfile シートに行を追加
  userProfileSheet.appendRow(userProfileRow)

  // userDetailList の各詳細を userProfileDetail シートに登録
  payload.userDetailList.forEach((detail) => {
    const osTypeOption = detail.osTypeOption.join(',')
    const dbTypeOption = detail.dbTypeOption.join(',')
    const developmentTypeOption = detail.developmentTypeOption.join(',')
    const projectPhaseTypeOption = detail.projectPhaseTypeOption.join(',')

    const userProfileDetailLastRow = userProfileDetailSheet.getLastRow()

    const userProfileDetailRow = [
      userProfileDetailLastRow,
      payload.userName,
      payload.userEmail,
      detail.startDate.split('T')[0],
      detail.endDate.split('T')[0],
      detail.monthOfNumber,
      detail.businessCategory,
      detail.systemName,
      detail.workDetails,
      osTypeOption,
      dbTypeOption,
      developmentTypeOption,
      projectPhaseTypeOption,
      detail.comment
    ]

    // userProfileDetail シートに行を追加
    userProfileDetailSheet.appendRow(userProfileDetailRow)
  })

  const userInfoLastRow = userInfoSheet.getLastRow()

  // ユーザー情報を取得し、userInfoスプレッドシートに登録
  const userInfoRow = [
    userInfoLastRow,
    payload.userName,
    payload.userPassWord,
    payload.userEmail,
    '一般',
    true
  ]

  // userInfo シートに行を追加
  userInfoSheet.appendRow(userInfoRow)

  return JSON.stringify({
    call: true,
    message: '登録完了しました。'
  })
}
