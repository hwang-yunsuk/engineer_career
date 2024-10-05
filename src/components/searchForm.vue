<template>
  <v-dialog
    v-model="showSearchForm"
    max-width="1200"
    max-height="600"
    persistent
    @keydown.esc="closeDialog"
    @update:model-value="updateDialog"
  >
    <v-card v-if="!hideSearchForm" title="ユーザー認証" class="auth-box" height="500" width="700">
      <v-overlay :model-value="loadingLoginForm" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
        <div justify="center"><h3>loading...</h3></div>
      </v-overlay>
      <div class="text-center">
        <div class="input-box mt-7">
          <div class="sub-title mb-2">E-mail <span class="required-mark">※</span></div>
          <v-col class="text-field-email" cols="5">
            <v-text-field
              v-model="userLoginEmail"
              placeholder="入力してください。"
              clearable
              required
              variant="solo"
            ></v-text-field>
          </v-col>
        </div>
        <div class="input-box">
          <div class="sub-title mb-2">パスワード <span class="required-mark">※</span></div>
          <v-col class="text-field-password" cols="6">
            <v-text-field
              v-model="userLoginPassWord"
              :append-icon="passWordShow ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passWordShow ? 'text' : 'password'"
              placeholder="入力してください。"
              clearable
              required
              variant="solo"
              @click:append="passWordShow = !passWordShow"
              @keyup.enter="handleClickLogin"
            ></v-text-field>
          </v-col>
        </div>
        <div v-if="errorMessages.length">
          <ul>
            <li v-for="(message, index) in errorMessages" :key="index">
              <span class="message-style">{{ message }}</span>
            </li>
          </ul>
        </div>
      </div>
      <v-row class="evenly mt-3">
        <v-col class="ml-10" cols="3">
          <v-btn
            class="text-none"
            color="primary"
            size="large"
            variant="outlined"
            min-width="100"
            block
            @click="handleClickLogin"
          >
            <v-icon class="mr-2">mdi-checkbox-marked-circle</v-icon>
            ログイン
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn
            class="text-none"
            color="error"
            size="large"
            variant="outlined"
            min-width="100"
            block
            @click="closeDialog"
          >
            <v-icon class="mr-2">mdi-close</v-icon>
            閉じる
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-else title="エンジニア情報検索">
      <v-overlay :model-value="loadingDetailForm" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
        <div justify="center"><h3>loading...</h3></div>
      </v-overlay>
      <div class="ml-6 mb-3">検索情報一覧</div>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :headers="headers"
        :items="searchItemList"
        :items-length="totalItems"
        :loading="loading"
      >
        <!-- No列のカスタム表示 -->
        <template v-slot:item.detailNo="{ index }">
          <span>{{ index + 1 }}</span>
        </template>

        <!-- 氏名列のカスタム表示 -->
        <template v-slot:item.userName="{ item }">
          <span>{{ item.userName }}</span>
        </template>

        <!-- 氏名列のカスタム表示 -->
        <template v-slot:item.userInitial="{ item }">
          <v-text-field
            class="user-initial"
            v-model="item.userInitial"
            density="compact"
            clearable
            required
            variant="solo"
            width="130px"
            hide-details
            @input="updateUserInitial(item.userInitial)"
          ></v-text-field>
        </template>

        <!-- E-mail列のカスタム表示 -->
        <template v-slot:item.userEmail="{ item }">
          <span>{{ item.userEmail }}</span>
        </template>

        <!-- 性別列のカスタム表示 -->
        <template v-slot:item.userGender="{ item }">
          <span>{{ item.userGender }}</span>
        </template>

        <!-- 生年月日列のカスタム表示 -->
        <template v-slot:item.userBirthdate="{ item }">
          <span>{{ item.userBirthdate }}</span>
        </template>

        <!-- 所属会社列のカスタム表示 -->
        <template v-slot:item.userComperny="{ item }">
          <span>{{ item.userComperny }}</span>
        </template>

        <!-- 住所列のカスタム表示 -->
        <template v-slot:item.userAdress="{ item }">
          <span>{{ item.userAdress }}</span>
        </template>

        <!-- 操作列のカスタム表示 -->
        <template v-slot:item.actions="{ item }">
          <v-btn color="primary" variant="outlined" @click="handleDetailClick(item)"> 詳細 </v-btn>
        </template>

        <!-- 検索フィールド -->
        <template v-slot:top>
          <tr>
            <td>
              <v-text-field
                v-model="userSearchName"
                class="mx-5"
                label="氏名"
                density="compact"
                clearable
                required
                variant="solo"
                width="200px"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="userSearchEmail"
                label="E-mail"
                density="compact"
                clearable
                required
                variant="solo"
                width="200px"
                @keyup.enter="handleSearchItems"
              ></v-text-field>
            </td>
            <td>
              <v-btn
                class="ml-6 mb-8"
                color="primary"
                variant="outlined"
                @click="handleSearchItems"
              >
                <v-icon class="mr-2">mdi-magnify</v-icon>
                検索
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <!-- 詳細項目を繰り返し表示 -->
      <div v-if="showUserDetail" v-for="(detail, index) in userDetailList" :key="index">
        <v-col class="pl-6">No.{{ index + 1 }}</v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>期間</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="3" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ detail.startDate }}</sheet-footer>
                <sheet-footer> 〜 </sheet-footer>
                <sheet-footer>{{ detail.endDate }}</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="px-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>月数</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ detail.monthOfNumber }}</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="px-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>業種</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="4" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ detail.businessCategory }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="80px">
                <sheet-footer>システム名</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="3" class="px-0 py-0">
              <v-sheet class="meisho" border height="80px">
                <sheet-footer>{{ detail.systemName }}</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="px-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="80px">
                <sheet-footer>業務・作業内容</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="6" class="px-0 py-0">
              <v-sheet class="meisho" border height="80px" style="overflow-y: auto">
                <sheet-footer class="text-pre-line">{{ detail.workDetails }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>OS</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ detail.osTypeOption }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="40px">
                <sheet-footer>DB</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="40px">
                <sheet-footer>{{ detail.dbTypeOption }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="50px">
                <sheet-footer>開発言語 / ツール</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="50px">
                <sheet-footer>{{ detail.developmentTypeOption }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="50px">
                <sheet-footer>担当工程 / 担当</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="50px">
                <sheet-footer class="text-pre-line">
                  {{ detail.projectPhaseTypeOption }}
                </sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-row>
            <v-col cols="1" class="pr-0 py-0">
              <v-sheet class="text-center meisho" color="cyan-darken-3" border height="80px">
                <sheet-footer>備考</sheet-footer>
              </v-sheet>
            </v-col>
            <v-col cols="10" class="px-0 py-0">
              <v-sheet class="meisho" border height="80px" style="overflow-y: auto">
                <sheet-footer class="text-pre-line">{{ detail.comment }}</sheet-footer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </div>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="showUserDetail"
          class="ma-4 text-none"
          size="large"
          color="primary"
          variant="outlined"
          width="90px"
          @click="handleClickPrint"
        >
          <v-icon class="mr-2">mdi-printer</v-icon>
          印刷
        </v-btn>
        <v-btn
          class="ma-4 text-none"
          text="閉じる"
          size="large"
          color="error"
          variant="outlined"
          @click="closeDialog"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import { request, pdfDownload } from '../api/utils'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:dialog'])

// toast
const $toast = useToast()

// ユーザー認証
const userLoginEmail = ref('')
const userLoginPassWord = ref('')
const passWordShow = ref(false)
const hideSearchForm = ref(false)
const errorMessages = ref([])

const showSearchForm = ref(props.dialog)
const itemsPerPage = ref(5)
const currentPage = ref(1)
const loading = ref(false)
const loadingLoginForm = ref(false)
const loadingDetailForm = ref(false)
const totalItems = ref(0)
const userSearchName = ref('')
const userSearchEmail = ref('')
const searchItemList = ref([])
const userDetailList = ref([])
const userProfilePrintItem = ref([])
const showUserDetail = ref(false)
const userInitial = ref('')

watch(
  () => props.dialog,
  (newVal) => {
    showSearchForm.value = newVal
  }
)

const headers = computed(() => {
  return [
    { title: 'No', align: 'start', key: 'detailNo', width: '50px', sortable: true },
    { title: '氏名', align: 'start', key: 'userName', width: '130px', sortable: true },
    { title: '略名', align: 'end', key: 'userInitial', width: '100px', sortable: true },
    { title: 'E-mail', key: 'userEmail', align: 'end', width: '150px', sortable: true },
    { title: '性別', key: 'userGender', align: 'end', width: '80px', sortable: true },
    { title: '生年月日', key: 'userBirthdate', align: 'end', width: '110px', sortable: true },
    { title: '所属会社', key: 'userComperny', align: 'end', width: '150px', sortable: true },
    { title: '住所', key: 'userAdress', align: 'end', width: '250px', sortable: true },
    { title: '操作', key: 'actions', align: 'center' }
  ]
})

// ページネーションされたデータを計算する
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return searchItemList.value.slice(start, end)
})

onMounted(() => {
  initData()
})

const closeDialog = () => {
  showSearchForm.value = false
  initData()
  emit('update:dialog', false)
}

const updateDialog = (value) => {
  emit('update:dialog', value)
}

const handleClickLogin = async () => {
  loadingLoginForm.value = true
  errorMessages.value = []

  const payload = {
    userLoginEmail: userLoginEmail.value,
    userLoginPassWord: userLoginPassWord.value
  }

  const loginResult = await request('apiUserLogin', payload)
  if (loginResult.call) {
    $toast.success('ログインしました。')
    loadingLoginForm.value = false
    hideSearchForm.value = true
  } else {
    errorMessages.value = loginResult.message
  }
  loadingLoginForm.value = false
}

// 検索API
const handleSearchItems = async () => {
  loading.value = true
  const payload = {
    userName: userSearchName.value ?? '',
    userEmail: userSearchEmail.value ?? ''
  }

  const searchResult = await request('apiGetSearchItems', payload)
  if (!searchResult.call) {
    $toast.error('検索に失敗しました。')
    loading.value = false
    return false
  }
  loading.value = false
  searchItemList.value = searchResult.data
  totalItems.value = searchItemList.value.length
  $toast.success(searchResult.message)
}

// 詳細ボタンクリックのハンドラー
const handleDetailClick = (item) => {
  userDetailList.value = item.userDetailList
  userProfilePrintItem.value = item
  showUserDetail.value = true
}

// ユーザーフロフィールを印刷
const handleClickPrint = async () => {
  if (!showUserDetail.value) {
    $toast.warning('詳細を押下してください。')
    return
  }

  if (userProfilePrintItem.value.length < 1) {
    $toast.error('印刷データを見つかりません。')
    return
  }

  loadingDetailForm.value = true

  const payload = {
    userName: userProfilePrintItem.value.userName,
    userNameFurikana: userProfilePrintItem.value.userNameFurikana,
    userInitial: userProfilePrintItem.value.userInitial ?? userInitial.value,
    userEmail: userProfilePrintItem.value.userEmail,
    userComperny: userProfilePrintItem.value.userComperny,
    userAdress: userProfilePrintItem.value.userAdress,
    userGender: userProfilePrintItem.value.userGender,
    userBirthdate: userProfilePrintItem.value.userBirthdate,
    userAge: userProfilePrintItem.value.userAge,
    userEducation: userProfilePrintItem.value.userEducation,
    licenses: userProfilePrintItem.value.licenses
  }

  try {
    const result = await request('apiUserProfilePrint', payload)
    if (!result.call) {
      $toast.error('印刷に失敗しました。')
      loadingDetailForm.value = false
      return
    }

    // 略名が設定されていたら、ファイル名を変更
    if (payload.userInitial) {
      payload.userName = payload.userInitial
    }

    // ダウンロード処理
    pdfDownload(payload.userName, result.data)

    loadingDetailForm.value = false
    $toast.success(result.message)
  } catch (error) {
    $toast.error('印刷に失敗しました。' + error)
    loadingDetailForm.value = false
  }
}

const initData = () => {
  userSearchName.value = ''
  userSearchEmail.value = ''
  searchItemList.value = []
  userProfilePrintItem.value = []
  userDetailList.value = []
  showUserDetail.value = false
  userLoginEmail.value = ''
  userLoginPassWord.value = ''
  errorMessages.value = []
}

const updateUserInitial = (newValue) => {
  userInitial.value = newValue
}
</script>

<style scoped>
.text-right {
  text-align: right;
}
.meisho {
  align-content: center;
}
.text-pre-line {
  white-space: pre-line;
}
.required-mark {
  color: red;
}
.sub-title {
  width: 370px !important;
  text-align: left;
}
.text-center {
  text-align: center;
}
.evenly {
  justify-content: space-evenly;
  flex: 0 0 auto;
}
.input-box {
  text-align: -webkit-center;
}
.auth-box {
  align-self: center;
}
.text-field-email {
  max-width: 55% !important;
}
.text-field-password {
  max-width: 61% !important;
  margin-left: 40px;
}
.message-style {
  color: red;
}
.user-initial {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
