function apiUserLogin(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const userInfoSheet = ss.getSheetByName('userInfo')

  const payload = JSON.parse(data)
  const inputEmail = payload.userLoginEmail.toLowerCase()
  const inputPassword = payload.userLoginPassWord

  // userProfileシートのデータを取得
  const userInfoData = userInfoSheet.getDataRange().getValues()
  const messages = []

  let userInfoToken = {} // ユーザー名
  let emailFound = false // メールアドレスが見つかったかどうかのフラグ

  // userProfileシートのヘッダーを除くデータをループ
  for (let i = 1; i < userInfoData.length; i++) {
    const [no, userName, userPassWord, userEmail, authority, validFlg, slackId, notifyFlg] =
      userInfoData[i]

    // メールアドレスが一致
    if (userEmail.toLowerCase() === inputEmail) {
      emailFound = true // メールアドレスが見つかったことを記録
      const result = authenticatePassword(userPassWord, inputPassword)
      if (!result) {
        messages.push('パスワードが一致しません。')
        break
      }
      if (authority !== '管理者') {
        messages.push('権限がありません。')
        break
      }
      if (!validFlg) {
        messages.push('ユーザーが存在しません。')
        break
      }
      if (result) {
        userInfoToken = {
          userName: userName,
          userEmail: userEmail,
          authority: authority,
          validFlg: validFlg
        }
        break // 一致するユーザーが見つかったらループを抜ける
      }
    }
  }

  // メールアドレスが一致しない場合のエラーメッセージを追加
  if (!emailFound) {
    messages.push('E-mail情報がありません。')
  }

  if (messages.length > 0) {
    return JSON.stringify({
      call: false,
      message: messages
    })
  }

  return JSON.stringify({
    data: userInfoToken,
    call: true
  })
}

function apiUserInfoLogin(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const userInfoSheet = ss.getSheetByName('userInfo')

  const payload = JSON.parse(data)
  const inputEmail = payload.userLoginEmail.toLowerCase()
  const inputPassword = payload.userLoginPassWord

  // userProfileシートのデータを取得
  const userInfoData = userInfoSheet.getDataRange().getValues()
  const messages = []

  let userProfile = {} // ユーザー名
  let emailFound = false // メールアドレスが見つかったかどうかのフラグ

  // userProfileシートのヘッダーを除くデータをループ
  for (let i = 1; i < userInfoData.length; i++) {
    const [no, userName, userPassWord, userEmail, authority, validFlg] = userInfoData[i]

    // メールアドレスが一致
    if (userEmail.toLowerCase() === inputEmail) {
      emailFound = true // メールアドレスが見つかったことを記録
      const result = authenticatePassword(userPassWord, inputPassword)
      if (!result) {
        messages.push('パスワードが一致しません。')
        break
      }
      if (!validFlg) {
        messages.push('ユーザーが存在しません。')
        break
      }
      if (result) {
        // 経歴書の情報取得
        userProfile = getUserSearchList(ss, userName, userEmail)
        break // 一致するユーザーが見つかったらループを抜ける
      }
    }
  }

  // メールアドレスが一致しない場合のエラーメッセージを追加
  if (!emailFound) {
    messages.push('E-mail情報がありません。')
  }

  if (messages.length > 0) {
    return JSON.stringify({
      call: false,
      message: messages
    })
  }

  return JSON.stringify({
    data: userProfile,
    call: true
  })
}

// パスワードを復号化して認証する関数
function authenticatePassword(encryptedPassword, inputPassword) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY)
  const originalPassword = decryptedBytes.toString(CryptoJS.enc.Utf8)

  // 入力されたパスワードと復号化されたパスワードを比較
  return originalPassword === inputPassword
}
