function updateUserProfile(data) {
  // スプレッドシートのIDを設定
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const userProfileSheet = ss.getSheetByName('userProfile')
  const userProfileDetailSheet = ss.getSheetByName('userProfileDetail')

  const payload = JSON.parse(data)

  // userProfile シートのデータ範囲を取得
  const userProfileData = userProfileSheet.getDataRange().getValues()
  let userFound = false

  // ユーザー名とEmailが一致する行を探す
  for (let i = 1; i < userProfileData.length; i++) {
    if (userProfileData[i][1] === payload.userName && userProfileData[i][3] === payload.userEmail) {
      // ユーザープロフィール情報を更新
      const licenses = payload.licenses.map((license) => license.value).join('\n')
      userProfileSheet.getRange(i + 1, 2, 1, 11).setValues([
        [
          payload.userName,
          payload.userNameFurikana,
          payload.userEmail,
          payload.userAdress,
          payload.userGender,
          payload.userBirthdate, // "yyyy-mm-dd"形式に変換
          payload.userAge,
          payload.userEducation,
          licenses,
          userProfileData[i][10],
          new Date()
        ]
      ])

      userFound = true
      break
    }
  }

  if (!userFound) {
    return JSON.stringify({
      call: false,
      message: '一致するユーザーが見つかりませんでした。'
    })
  }

  // userProfileDetailSheet の該当する行を削除
  const userProfileDetailData = userProfileDetailSheet.getDataRange().getValues()
  let rowsToDelete = []

  for (let i = 1; i < userProfileDetailData.length; i++) {
    if (
      userProfileDetailData[i][1] === payload.userName &&
      userProfileDetailData[i][2] === payload.userEmail
    ) {
      rowsToDelete.push(i + 1) // 削除する行番号を追加
    }
  }

  // 削除する行を逆順で処理する（下から削除しないと行番号がずれるため）
  rowsToDelete.reverse().forEach((row) => {
    userProfileDetailSheet.deleteRow(row)
  })

  // 新しいデータを userProfileDetailSheet に挿入
  payload.userDetailList.forEach((detail) => {
    const osTypeOption = detail.osTypeOption.join(',')
    const dbTypeOption = detail.dbTypeOption.join(',')
    const developmentTypeOption = detail.developmentTypeOption.join(',')
    const projectPhaseTypeOption = detail.projectPhaseTypeOption.join(',')

    let detailLastRow = null
    if (!detail.detailNo) {
      detailLastRow = userProfileDetailData.getLastRow()
    }

    userProfileDetailSheet.appendRow([
      detail.detailNo ? detail.detailNo : detailLastRow,
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
      new Date()
    ])
  })

  return JSON.stringify({
    call: true,
    message: '更新が完了しました。'
  })
}
