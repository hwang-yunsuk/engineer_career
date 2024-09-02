<template>
  <div class="mt-15">
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
      <div justify="center"><h3>loading...</h3></div>
    </v-overlay>
    <v-card class="mb-8">
      <v-card-title>エンジニア基本情報登録</v-card-title>
      <v-col cols="12">
        <v-divider class="border-opacity-25 mb-4"></v-divider>
      </v-col>
      <v-row class="pb-0">
        <v-col cols="4" class="sub-title mb-0 pb-0">
          氏名 <span class="required-mark">※</span>
        </v-col>
        <v-col class="pl-1 mb-0 pb-0"> フリガナ <span class="required-mark">※</span> </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="4">
          <v-text-field
            v-model="userName"
            placeholder="入力してください。"
            clearable
            required
            :disabled="!isEditMode ? false : true"
            width="90%"
            variant="solo"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="userNameFurikana"
            placeholder="入力してください。"
            clearable
            required
            :disabled="!isEditMode ? false : true"
            width="90%"
            variant="solo"
          ></v-text-field>
        </v-col>
      </v-row>
      <div v-if="!isEditMode" class="sub-title mb-2">
        パスワード <span class="required-mark">※</span>
      </div>
      <v-row v-if="!isEditMode" class="ml-2">
        <v-col cols="4">
          <v-text-field
            v-model="userPassWord"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            placeholder="入力してください。"
            hint="8桁以上、設定してください。"
            clearable
            required
            variant="solo"
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="userPassWordCheck"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            placeholder="入力してください。"
            hint="8桁以上、設定してください。"
            clearable
            required
            variant="solo"
            @click:append="show2 = !show2"
          ></v-text-field>
        </v-col>
      </v-row>
      <div class="sub-title mb-2">E-mail <span class="required-mark">※</span></div>
      <v-col cols="4">
        <v-text-field
          class="ml-2"
          v-model="userEmail"
          placeholder="johndoe@gmail.com"
          clearable
          required
          width="90%"
          :disabled="!isEditMode ? false : true"
          type="email"
          variant="solo"
        ></v-text-field>
      </v-col>
      <div class="sub-title mb-2">住所 <span class="required-mark">※</span></div>
      <v-col cols="8">
        <v-text-field
          class="ml-2"
          v-model="userAdress"
          placeholder="入力してください。"
          clearable
          required
          width="95%"
          variant="solo"
        ></v-text-field>
      </v-col>
      <div class="sub-title mb-2">性別 <span class="required-mark">※</span></div>
      <v-radio-group v-model="userGender" inline required>
        <div class="ml-4">
          <v-radio label="男性" value="男性"></v-radio>
          <v-radio label="女性" value="女性"></v-radio>
        </div>
      </v-radio-group>
      <BirthdateForm
        class="ml-0"
        :user-birthdate="userBirthdate"
        :user-age="userAge"
        @update:userBirthdate="updateBirthdate"
        @update:userAge="updateAge"
      />
      <div class="sub-title mb-2">最終学歴（学校名） <span class="required-mark">※</span></div>
      <v-col cols="4">
        <v-text-field
          class="ml-2"
          v-model="userEducation"
          placeholder="入力してください。"
          clearable
          required
          variant="solo"
        ></v-text-field>
      </v-col>
      <v-row>
        <v-col cols="4" class="sub-title mb-2">取得資格</v-col>
        <v-col class="sub-title ml-0 mb-2">取得年月</v-col>
      </v-row>
      <div v-for="(license, index) in licenses" :key="index" class="d-flex align-center mb-2">
        <v-col class="py-0 ml-2" cols="4">
          <v-text-field
            v-model="licenses[index].license"
            placeholder="入力してください。"
            clearable
            required
            variant="solo"
          ></v-text-field>
        </v-col>
        <v-col class="py-0 ml-2" cols="2">
          <v-select
            label="資格取得年"
            v-model="licenses[index].year"
            variant="outlined"
            :items="yearList"
            required
          >
          </v-select>
        </v-col>
        <div>年</div>
        <v-col class="py-0 ml-2" cols="1">
          <v-select
            label="資格取得月"
            v-model="licenses[index].month"
            variant="outlined"
            :items="monthList"
            width="120%"
            required
          >
          </v-select>
        </v-col>
        <div class="ml-5">月</div>
        <v-btn
          icon
          class="mb-6"
          variant="text"
          @click="addOrRemoveField(index)"
          :color="license.isLast ? 'primary' : 'red'"
        >
          <v-icon>
            {{ license.isLast ? 'mdi-plus' : 'mdi-minus' }}
          </v-icon>
        </v-btn>
      </div>
    </v-card>
    <v-card>
      <v-card-title>詳細経歴登録</v-card-title>
      <v-col cols="12">
        <v-divider class="border-opacity-25 mb-4"></v-divider>
      </v-col>
      <div v-for="(detail, index) in userDetailList" :key="detail.no">
        <UserProfileDetail
          :number="index + 1"
          v-model="userDetailList[index]"
          :isDeletable="index !== 0"
          @update:userProfileDetail="updateUserProfileDetail($event, index)"
          @removeDetail="removeDetail(index)"
          @loadingChange="handleLoading"
        />
      </div>
    </v-card>
    <v-col cols="8" class="mx-lg-auto">
      <v-btn color="#448AFF" size="x-large" variant="elevated" block @click="addDetail">
        <v-icon>mdi-plus</v-icon>
        業務経歴追加
      </v-btn>
    </v-col>
  </div>
  <div class="align-self my-6">
    <v-row>
      <v-col cols="6">
        <v-btn
          class="text-none"
          color="primary"
          size="large"
          variant="outlined"
          min-width="100"
          block
          @click.stop="toggleDialog"
        >
          <v-icon class="mr-2">mdi-checkbox-marked-circle</v-icon>
          {{ submitButtonLabel }}
        </v-btn>
      </v-col>
      <v-col v-if="!isEditMode" cols="6">
        <v-btn
          class="text-none"
          color="secondary"
          size="large"
          variant="outlined"
          min-width="100"
          block
          @click="handleClickClear"
        >
          <v-icon class="mr-2">mdi-delete</v-icon>
          クリア
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <!-- 登録確認画面 -->
  <UserProfileConfirm
    :user-profile-list="userProfile"
    :dialog="profileConfirmFlg"
    @hanldleSubmit="hanldleUserProfileSubmit"
    @closeDialog="handleProfileConfirmClose"
  />
  <searchForm :dialog="searchDialog" @update:dialog="updateSearchDialog" />
  <userInfoForm
    :dialog="userInfoDialog"
    @update:dialog="updateUserInfoDialog"
    @userInfoEdit="handleUserInfoEdit"
  />
  <!-- 登録確認ページ移動のダイアログ -->
  <DialogApp
    :dialog="dialogFlg"
    :dialog-title="constVal.DIALOG_TITLE"
    :dialog-text="constVal.DIALOG_SUBMIT_TEXT"
    @setHandleSubmit="handleSubmit"
    @closeDialog="handleDialogClose"
  />
  <!-- 登録ダイアログ -->
  <DialogApp
    :dialog="dialogRegisterFlg"
    :dialog-title="constVal.DIALOG_TITLE"
    :dialog-text="constVal.DIALOG_CONFIRM_TEXT"
    @setHandleSubmit="handleRegister"
    @closeDialog="handleRegisterDialogClose"
  />
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import BirthdateForm from '../components/BirthdateForm.vue'
import UserProfileDetail from '../components/UserProfileDetail.vue'
import UserProfileConfirm from '../components/UserProfileConfirm.vue'
import searchForm from '../components/searchForm.vue'
import userInfoForm from '../components/userInfoForm.vue'
import DialogApp from '../hooks/dialog.vue'
// @ts-ignore
import CryptoJS from 'crypto-js'
import { request } from '../api/utils'
import { constVal } from '@/const/index.js'
import { useToast } from 'vue-toast-notification'
import { processOption, parseLicenses } from '@/utils/textFormater.js'
import {
  formatDateToYYYYMM,
  formatYYYYMMDDToDate,
  formatDateToYYYYMMDD
} from '@/utils/dateFormater.js'

const props = defineProps({
  searchDialog: {
    type: Boolean,
    default: false
  },
  userInfoDialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:search-dialog', 'update:userInfo-dialog'])

// toast
const $toast = useToast()

// ローディング状態の追加
const loading = ref(true)

// データプロパティを定義
const userName = ref('')
const userNameFurikana = ref('')
const userPassWord = ref('')
const userPassWordCheck = ref('')
const show1 = ref(false)
const show2 = ref(false)
const secretKey = ref(import.meta.env.VITE_SECRET_KEY)
const userEmail = ref('')
const userAdress = ref('')
const userGender = ref('男性') // 初期値を設定
const userBirthdate = ref(null)
const userEducation = ref('')
// 取得資格のフィールドを管理する配列
const licenses = ref([{ value: '', license: '', year: '', month: '', isLast: true }])
// 取得資格の年リスト
const yearList = ref([])
// 取得資格の月リスト
const monthList = ref([])
const userAge = ref('')
// dialog
const dialogFlg = ref(false)
const dialogRegisterFlg = ref(false)
const profileConfirmFlg = ref(false)
const userProfile = ref({})
const isEditMode = ref(false)
const userDetailList = ref([
  {
    no: 1,
    startDate: null,
    endDate: null,
    monthOfNumber: '',
    systemName: '',
    workDetails: '',
    osTypeOption: [],
    dbTypeOption: [],
    developmentTypeOption: [],
    projectPhaseTypeOption: [],
    comment: ''
  }
])

onMounted(() => {
  // 現在の年を取得
  const currentYear = new Date().getFullYear()

  // 今年から20年前までのリストを作成してセット
  for (let i = 0; i <= 20; i++) {
    yearList.value.push(currentYear - i)
  }

  // 1月から12月までのリストを作成してセット
  for (let i = 1; i <= 12; i++) {
    monthList.value.push(String(i).padStart(2, '0'))
  }
  initData()
})

watch(
  () => dialogFlg.value,
  () => {
    userProfile.value.userName = userName.value
    userProfile.value.userNameFurikana = userNameFurikana.value
    userProfile.value.userPassWord = setEncryptedPassWord()
    userProfile.value.userEmail = userEmail.value
    userProfile.value.userAdress = userAdress.value
    userProfile.value.userGender = userGender.value
    userProfile.value.userBirthdate = userBirthdate.value
    userProfile.value.userAge = userAge.value
    userProfile.value.userEducation = userEducation.value
    userProfile.value.licenses = licenses.value
    userProfile.value.userDetailList = userDetailList.value
  }
)

const addOrRemoveField = (index) => {
  if (licenses.value[index].isLast) {
    // 新しいフィールドを追加
    licenses.value.push({ value: '', license: '', year: '', month: '', isLast: true })
    licenses.value[index].isLast = false
  } else {
    // フィールドを削除
    licenses.value.splice(index, 1)
    // 最後のフィールドが削除された場合、最後のフィールドに＋ボタンを戻す
    if (licenses.value.length > 0) {
      licenses.value[licenses.value.length - 1].isLast = true
    }
  }
}

// 詳細経歴追加
const addDetail = () => {
  userDetailList.value.push({
    no: userDetailList.value.length + 1,
    startDate: null,
    endDate: null,
    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: '',
    monthOfNumber: '',
    businessCategory: '',
    systemName: '',
    workDetails: '',
    osTypeOption: [],
    dbTypeOption: [],
    developmentTypeOption: [],
    projectPhaseTypeOption: [],
    comment: ''
  })
}

// 詳細経歴削除
const removeDetail = (index) => {
  userDetailList.value.splice(index, 1)
  // No.の値を更新
  userDetailList.value.forEach((item, idx) => {
    item.no = idx + 1
  })
}

// イベントハンドラー
const updateBirthdate = (newBirthdate) => {
  userBirthdate.value = newBirthdate
}

const updateAge = (newAge) => {
  userAge.value = newAge
}

const toggleDialog = () => {
  dialogFlg.value = true
}

const hanldleUserProfileSubmit = () => {
  dialogRegisterFlg.value = true
}

const updateUserProfileDetail = (updatedDetail, index) => {
  userDetailList.value[index] = updatedDetail
}

// 資格取得を設定（license + year / month)
const updateLicenses = () => {
  userProfile.value.licenses.forEach((licenseObj) => {
    const { license, year, month } = licenseObj

    // license, year, month が全て入力されている場合に value を更新
    if (license && year && month) {
      licenseObj.value = `${license} ${year}/${String(month).padStart(2, '0')}`
    }
  })
}

const setEncryptedPassWord = () => {
  const encryptedPin = CryptoJS.AES.encrypt(userPassWord.value, secretKey.value).toString()
  return encryptedPin
}

// dialogの「はい」
const handleSubmit = () => {
  userProfile.value.userDetailList = userDetailList.value

  updateLicenses()
  profileConfirmFlg.value = true
  dialogFlg.value = false
}

const handleProfileConfirmClose = () => {
  profileConfirmFlg.value = false
}

// 登録API
const handleRegister = async () => {
  loading.value = true

  const userProfileCopy = JSON.parse(JSON.stringify(userProfile.value))

  // userBirthdate
  userProfileCopy.userBirthdate = formatDateToYYYYMMDD(userProfile.value.userBirthdate)

  userProfileCopy.userDetailList.forEach((entry) => {
    entry.osTypeOption = removeOptionEtcEdit(entry.osTypeOption)
    entry.dbTypeOption = removeOptionEtcEdit(entry.dbTypeOption)
    entry.developmentTypeOption = removeOptionEtcEdit(entry.developmentTypeOption)
    entry.projectPhaseTypeOption = removeOptionEtcEdit(entry.projectPhaseTypeOption)
  })

  let message = ''

  // 提出API
  if (!isEditMode.value) {
    const registerResult = await request('registerUserProfile', userProfileCopy)
    if (!registerResult.call) {
      $toast.error('登録に失敗しました。')
      loading.value = false
      dialogRegisterFlg.value = false
      profileConfirmFlg.value = false
      return false
    } else {
      message = registerResult.message
    }
  } else {
    // 修正モード
    const registerResult = await request('updateUserProfile', userProfileCopy)
    if (!registerResult.call) {
      $toast.error('修正に失敗しました。')
      loading.value = false
      dialogRegisterFlg.value = false
      profileConfirmFlg.value = false
      return false
    } else {
      message = registerResult.message
    }
  }
  loading.value = false
  dialogRegisterFlg.value = false
  profileConfirmFlg.value = false
  isEditMode.value = false // 修正モードを解除
  initData()
  $toast.success(message)
}

// 削除関数を定義
function removeOptionEtcEdit(array) {
  return array.filter((item) => !(item && item.hasOwnProperty('optionEtcEdit')))
}

const initData = () => {
  userName.value = ''
  userNameFurikana.value = ''
  userPassWord.value = ''
  userPassWordCheck.value = ''
  userEmail.value = ''
  userAdress.value = ''
  userGender.value = '男性'
  userBirthdate.value = null
  userAge.value = ''
  userEducation.value = ''
  licenses.value = [{ value: '', license: '', year: '', month: '', isLast: true }]
  userDetailList.value = [
    {
      detailNo: 1,
      startDate: null,
      endDate: null,
      startYear: '',
      startMonth: '',
      endYear: '',
      endMonth: '',
      monthOfNumber: '',
      systemName: '',
      workDetails: '',
      osTypeOption: [],
      dbTypeOption: [],
      developmentTypeOption: [],
      projectPhaseTypeOption: [],
      comment: ''
    }
  ]
}

// 子コンポーネントから受け取る編集データのハンドラーを修正
const handleUserInfoEdit = (item) => {
  // 編集モードに変更
  isEditMode.value = true
  // 子コンポーネントから送られてきたデータを親にセット
  userName.value = item.userName
  userNameFurikana.value = item.userNameFurikana
  userEmail.value = item.userEmail
  userAdress.value = item.userAdress
  userGender.value = item.userGender
  userBirthdate.value = formatYYYYMMDDToDate(item.userBirthdate)
  userAge.value = item.userAge
  userEducation.value = item.userEducation
  licenses.value = parseLicenses(item.licenses) // 資格情報を解析してセットする関数

  // userDetailList をセット
  userDetailList.value = item.userDetailList.map((detail) => ({
    detailNo: detail.detailNo,
    startDate: detail.startDate,
    endDate: detail.endDate,
    startYear: formatDateToYYYYMM(detail.startDate).year,
    startMonth: formatDateToYYYYMM(detail.startDate).month,
    endYear: formatDateToYYYYMM(detail.endDate).year,
    endMonth: formatDateToYYYYMM(detail.endDate).month,
    monthOfNumber: detail.monthOfNumber,
    businessCategory: detail.businessCategory,
    systemName: detail.systemName,
    workDetails: detail.workDetails,
    osTypeOption: detail.osTypeOption ? processOption(detail.osTypeOption) : [],
    dbTypeOption: detail.dbTypeOption ? processOption(detail.dbTypeOption) : [],
    developmentTypeOption: detail.developmentTypeOption
      ? processOption(detail.developmentTypeOption)
      : [],
    projectPhaseTypeOption: detail.projectPhaseTypeOption
      ? processOption(detail.projectPhaseTypeOption)
      : [],
    comment: detail.comment
  }))
}

// ボタンのラベルを動的に設定
const submitButtonLabel = computed(() => (isEditMode.value ? '修正' : '登録'))

const handleClickClear = () => {
  initData()
}

const handleDialogClose = () => {
  dialogFlg.value = false
}

const handleRegisterDialogClose = () => {
  dialogRegisterFlg.value = false
}

const handleLoading = (value) => {
  loading.value = value
}

const updateSearchDialog = (value) => {
  emit('update:search-dialog', value)
}

const updateUserInfoDialog = (value) => {
  emit('update:userInfo-dialog', value)
}
</script>

<style scoped>
.sub-title {
  margin-left: 15px;
}
.required-mark {
  color: red;
}
.align-self {
  align-self: flex-end;
}
</style>
