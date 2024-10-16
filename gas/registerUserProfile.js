function registerUserProfile(data) {
  // スプレッドシートのIDを設定
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const userProfileSheet = ss.getSheetByName('userProfile')
  const userProfileDetailSheet = ss.getSheetByName('userProfileDetail')
  const userInfoSheet = ss.getSheetByName('userInfo')

  payload = JSON.parse(data)

  const userProfileLastRow = userProfileSheet.getLastRow()

  // userProfileシートのuserEmail列の全データを取得
  const userEmails = userProfileSheet.getRange(2, 4, userProfileSheet.getLastRow() - 1).getValues()

  // userEmailの重複確認
  const emailExists = userEmails.some((row) => row[0] === payload.userEmail)

  if (emailExists) {
    return JSON.stringify({
      call: false,
      message: 'このメールアドレスは既に登録されています。'
    })
  }

  // ユーザープロフィール情報を取得し、スプレッドシートに登録
  const licenses = payload.licenses.map((license) => license.value).join('\n')
  const userProfileRow = [
    userProfileLastRow,
    payload.userName,
    payload.userNameFurikana,
    payload.userEmail,
    payload.userComperny,
    payload.userAdress,
    payload.userGender,
    payload.userBirthdate,
    payload.userAge,
    payload.userEducation,
    licenses,
    new Date(),
    null
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
      detail.startDate,
      detail.endDate,
      detail.monthOfNumber,
      detail.businessCategory,
      detail.systemName,
      detail.workDetails,
      osTypeOption,
      dbTypeOption,
      developmentTypeOption,
      projectPhaseTypeOption,
      detail.comment,
      new Date(),
      null
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
    true,
    new Date(),
    null
  ]

  // userInfo シートに行を追加
  userInfoSheet.appendRow(userInfoRow)

  return JSON.stringify({
    call: true,
    message: '登録完了しました。'
  })
}
