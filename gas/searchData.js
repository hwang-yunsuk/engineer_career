function apiGetSearchItems(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const userProfileSheet = ss.getSheetByName('userProfile')
  const userProfileDetailSheet = ss.getSheetByName('userProfileDetail')

  const payload = JSON.parse(data)
  const searchUserName = payload.userName.toLowerCase()
  const searchUserEmail = payload.userEmail.toLowerCase()

  const searchResultList = []

  // userProfileシートのデータを取得
  const userProfileData = userProfileSheet.getDataRange().getValues()

  // userProfileシートのヘッダーを除くデータをループ
  for (let i = 1; i < userProfileData.length; i++) {
    const [
      no,
      userName,
      userNameFurikana,
      userEmail,
      userAdress,
      userGender,
      userBirthdate,
      userAge,
      userEducation,
      licenses
    ] = userProfileData[i]

    // 名前とメールアドレスの部分一致検索
    if (
      userName.toLowerCase().includes(searchUserName) &&
      userEmail.toLowerCase().includes(searchUserEmail)
    ) {
      // 検索結果にマッチした場合、詳細情報を取得
      const userDetailList = getUserDetailList(userProfileDetailSheet, userName, userEmail)

      searchResultList.push({
        no: no,
        userName: userName,
        userNameFurikana: userNameFurikana,
        userEmail: userEmail,
        userAdress: userAdress,
        userGender: userGender,
        userBirthdate: userBirthdate,
        userAge: userAge,
        userEducation: userEducation,
        licenses: licenses,
        userDetailList: userDetailList
      })
    }
  }

  return JSON.stringify({
    data: searchResultList,
    call: true,
    message: '検索しました。'
  })
}

// userProfileDetailシートから該当するユーザーの詳細情報を取得
function getUserDetailList(userProfileDetailSheet, userName, userEmail) {
  const userDetailData = userProfileDetailSheet.getDataRange().getValues()
  const userDetailList = []

  // userProfileDetailシートのデータをループ
  for (let i = 1; i < userDetailData.length; i++) {
    const [
      no,
      detailUserName,
      detailUserEmail,
      startDate,
      endDate,
      monthOfNumber,
      businessCategory,
      systemName,
      workDetails,
      osTypeOption,
      dbTypeOption,
      developmentTypeOption,
      projectPhaseTypeOption,
      comment
    ] = userDetailData[i]

    // 名前とメールアドレスが一致する詳細情報を取得
    if (detailUserName === userName && detailUserEmail === userEmail) {
      userDetailList.push({
        no: no,
        startDate: startDate,
        endDate: endDate,
        monthOfNumber: monthOfNumber,
        businessCategory: businessCategory,
        systemName: systemName,
        workDetails: workDetails,
        osTypeOption: osTypeOption,
        dbTypeOption: dbTypeOption,
        developmentTypeOption: developmentTypeOption,
        projectPhaseTypeOption: projectPhaseTypeOption,
        comment: comment
      })
    }
  }

  return userDetailList
}
