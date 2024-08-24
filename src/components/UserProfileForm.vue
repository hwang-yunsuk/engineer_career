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
      <div class="sub-title mb-2">氏名 <span class="required-mark">※</span></div>
      <v-row class="ml-2">
        <v-col cols="4">
          <v-text-field
            v-model="userName"
            placeholder="入力してください。"
            clearable
            required
            variant="solo"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="userNameFurikana"
            placeholder="フリガナ"
            clearable
            required
            variant="solo"
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
      <div class="sub-title mb-2">取得資格</div>
      <div v-for="(license, index) in licenses" :key="index" class="d-flex align-center mb-2">
        <v-col class="py-0 ml-2" cols="4">
          <v-text-field
            v-model="licenses[index].value"
            placeholder="入力してください。"
            clearable
            required
            variant="solo"
          ></v-text-field>
        </v-col>
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
          登録
        </v-btn>
      </v-col>
      <v-col cols="6">
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
  <DialogApp
    :dialog="dialogFlg"
    :dialog-title="constVal.DIALOG_TITLE"
    :dialog-text="constVal.DIALOG_SUBMIT_TEXT"
    @setHandleSubmit="handleSubmit"
    @closeDialog="handleDialogClose"
  />
  <DialogApp
    :dialog="dialogRegisterFlg"
    :dialog-title="constVal.DIALOG_TITLE"
    :dialog-text="constVal.DIALOG_CONFIRM_TEXT"
    @setHandleSubmit="handleRegister"
    @closeDialog="handleRegisterDialogClose"
  />
  <UserProfileConfirm
    :user-profile-list="userProfile"
    :dialog="profileConfirmFlg"
    @hanldleSubmit="hanldleUserProfileSubmit"
    @closeDialog="handleProfileConfirmClose"
  />
  <searchForm :dialog="searchDialog" @update:dialog="updateSearchDialog" />
</template>

<script setup>
import { ref, watch } from 'vue'
import BirthdateForm from '../components/BirthdateForm.vue'
import UserProfileDetail from '../components/UserProfileDetail.vue'
import UserProfileConfirm from '../components/UserProfileConfirm.vue'
import searchForm from '../components/searchForm.vue'
import DialogApp from '../hooks/dialog.vue'
import { request } from '../api/utils'
import { constVal } from '@/const/index.js'
import { useToast } from 'vue-toast-notification'

const props = defineProps({
  searchDialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:search-dialog'])

// toast
const $toast = useToast()

// ローディング状態の追加
const loading = ref(true)

// データプロパティを定義
const userName = ref('')
const userNameFurikana = ref('')
const userEmail = ref('')
const userAdress = ref('')
const userGender = ref('男性') // 初期値を設定
const userBirthdate = ref(null)
const userEducation = ref('')
// 取得資格のフィールドを管理する配列
const licenses = ref([{ value: '', isLast: true }])
const userAge = ref('')
// dialog
const dialogFlg = ref(false)
const dialogRegisterFlg = ref(false)
const profileConfirmFlg = ref(false)
const userProfile = ref({})
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

watch(
  () => dialogFlg.value,
  () => {
    userProfile.value.userName = userName.value
    userProfile.value.userNameFurikana = userNameFurikana.value
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
    licenses.value.push({ value: '', isLast: true })
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
    businessCategory: '',
    systemName: '',
    workDetails: '',
    monthOfNumber: '',
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

// dialogの「はい」
const handleSubmit = () => {
  userProfile.value.userDetailList = userDetailList.value
  profileConfirmFlg.value = true
  dialogFlg.value = false
}

const handleProfileConfirmClose = () => {
  profileConfirmFlg.value = false
}

// 登録API
const handleRegister = async () => {
  loading.value = true
  // 提出API
  const registerResult = await request('registerUserProfile', userProfile.value)
  if (!registerResult.call) {
    $toast.error('登録に失敗しました。')
    loading.value = false
    dialogRegisterFlg.value = false
    profileConfirmFlg.value = false
    return false
  }
  loading.value = false
  dialogRegisterFlg.value = false
  profileConfirmFlg.value = false
  initData()
  $toast.success(registerResult.message)
}

const initData = () => {
  userName.value = ''
  userNameFurikana.value = ''
  userEmail.value = ''
  userAdress.value = ''
  userGender.value = '男性'
  userBirthdate.value = null
  userAge.value = ''
  userEducation.value = ''
  licenses.value = [{ value: '', isLast: true }]
  userDetailList.value = [
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
  ]
}

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
