function apiGetSearchItems(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID)

  const payload = JSON.parse(data)
  const searchUserName = payload.userName.toLowerCase()
  const searchUserEmail = payload.userEmail.toLowerCase()

  // userProfileシートのデータを取得
  const searchResultList = getUserSearchList(ss, searchUserName, searchUserEmail)

  return JSON.stringify({
    data: searchResultList,
    call: true,
    message: '検索しました。'
  })
}

// userProfileDetailシートから該当するユーザーの詳細情報を取得
function getUserSearchList(ss, searchUserName, searchUserEmail) {
  const userProfileSheet = ss.getSheetByName('userProfile')
  const userProfileDetailSheet = ss.getSheetByName('userProfileDetail')

  const searchResultList = []

  // userProfile, detailシートのデータを取得
  const userProfileData = userProfileSheet.getDataRange().getValues()
  const userDetailData = userProfileDetailSheet.getDataRange().getValues()

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
      // ユーザーごとに userDetailList を初期化
      const userDetailList = []

      // userProfileDetailシートのデータをループ
      for (let j = 1; j < userDetailData.length; j++) {
        const [
          detailNo,
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
        ] = userDetailData[j]

        // 名前とメールアドレスが一致する詳細情報を取得
        if (detailUserName === userName && detailUserEmail === userEmail) {
          userDetailList.push({
            detailNo: detailNo,
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

      searchResultList.push({
        detailNo: no,
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

  return searchResultList
}
