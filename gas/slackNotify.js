// slack通知
function postMessageToSlack(userName) {
  const app = SlackApp.create(SLACK_TOKEN_MAIN)

  const ss = SpreadsheetApp.openById(SHEET_ID)
  const userInfoSheet = ss.getSheetByName('userInfo')

  // サイトURLを取得
  const urlJson = triggerReload()
  const urlParsed = JSON.parse(urlJson)

  // Slackメッセージのペイロードを作成
  const message = setMessage(userName, urlParsed.url)

  // userProfileシートのデータを取得
  const userInfoData = userInfoSheet.getDataRange().getValues()

  // userProfileシートのヘッダーを除くデータをループ
  for (let i = 1; i < userInfoData.length; i++) {
    const [no, userName, userPassWord, userEmail, authority, validFlg, slackId, notifyFlg] =
      userInfoData[i]

    if (authority === '管理者' && slackId != null && validFlg === true && notifyFlg === true) {
      try {
        app.chatPostMessage(slackId, message)
      } catch (e) {
        Logger.log('Error sending message to ' + slackId + ': ' + e.toString())
      }
    }
  }
}

function setMessage(userName, url) {
  return `${userName}さん がエンジニア経歴書を登録しました。\n\nURL : ${url}`
}
