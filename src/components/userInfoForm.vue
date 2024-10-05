<template>
  <v-dialog
    v-model="showUserInfoForm"
    max-width="1200"
    max-height="600"
    persistent
    @keydown.esc="closeDialog"
    @update:model-value="updateDialog"
  >
    <v-card v-if="!hideUserInfoForm" title="ユーザー認証" class="auth-box" height="500" width="700">
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
    <v-card v-else title="エンジニア情報">
      <div class="ml-6 mb-3">経歴書情報一覧</div>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="searchItemList"
        :items-length="totalItems"
        :loading="loading"
      >
        <!-- No列をインデックスで表示 -->
        <template v-slot:item.no="{ index }">
          {{ index + 1 }}
        </template>
        <!-- カスタムアクション（修正ボタン）を追加 -->
        <template v-slot:item.actions="{ item }">
          <v-btn color="primary" variant="outlined" @click="handleEditClick(item)"> 修正 </v-btn>
          <v-btn class="search-icon ml-5" color="secondary" icon @click="handleClickSearch">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-data-table-server>
      <template v-slot:actions>
        <v-spacer></v-spacer>
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
import { request } from '../api/utils'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:dialog', 'userInfoEdit'])

// toast
const $toast = useToast()

// ユーザー認証
const userLoginEmail = ref('')
const userLoginPassWord = ref('')
const passWordShow = ref(false)
const hideUserInfoForm = ref(false)
const errorMessages = ref([])

const showUserInfoForm = ref(props.dialog)
const itemsPerPage = ref(5)
const loading = ref(false)
const loadingLoginForm = ref(false)
const totalItems = ref(0)
const searchItemList = ref([])

watch(
  () => props.dialog,
  (newVal) => {
    showUserInfoForm.value = newVal
    if (hideUserInfoForm.value && showUserInfoForm.value) {
      handleClickSearch()
    }
  }
)

const headers = computed(() => {
  return [
    { title: 'No', align: 'start', key: 'no', width: '80px' },
    { title: '氏名', align: 'start', key: 'userName' },
    { title: 'E-mail', key: 'userEmail', align: 'end' },
    { title: '性別', key: 'userGender', align: 'end' },
    { title: '生年月日', key: 'userBirthdate', align: 'end' },
    { title: '所属会社', key: 'userComperny', align: 'end' },
    { title: '住所', key: 'userAdress', align: 'end' },
    { title: '操作', key: 'actions', align: 'center' } // 操作列の追加
  ]
})

onMounted(() => {
  userLoginEmail.value = ''
  userLoginPassWord.value = ''
  initData()
})

const closeDialog = () => {
  showUserInfoForm.value = false
  initData()
  emit('update:dialog', false)
}

const updateDialog = (value) => {
  emit('update:dialog', value)
}

const handleClickLogin = async () => {
  loadingLoginForm.value = true
  errorMessages.value = []
  searchItemList.value = []

  const payload = {
    userLoginEmail: userLoginEmail.value,
    userLoginPassWord: userLoginPassWord.value
  }

  const serachResult = await request('apiUserInfoLogin', payload)
  if (serachResult.call) {
    $toast.success('検索しました。')
    // Profile情報セット
    searchItemList.value = serachResult.data
    loadingLoginForm.value = false
    hideUserInfoForm.value = true
  } else {
    errorMessages.value = serachResult.message
  }
  loadingLoginForm.value = false
}

const handleClickSearch = async () => {
  loading.value = true
  errorMessages.value = []

  const payload = {
    userLoginEmail: userLoginEmail.value,
    userLoginPassWord: userLoginPassWord.value
  }

  const loginResult = await request('apiUserInfoLogin', payload)
  if (loginResult.call) {
    $toast.success('検索しました。')
    // Profile情報セット
    searchItemList.value = loginResult.data
    loading.value = false
    hideUserInfoForm.value = true
  } else {
    $toast.error(loginResult.message)
  }
  loading.value = false
}

// 詳細ボタンクリックのハンドラー
const handleEditClick = (item) => {
  emit('userInfoEdit', item)
  closeDialog()
}

const initData = () => {
  errorMessages.value = []
  searchItemList.value = []
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
.search-icon {
  width: calc(var(--v-btn-height) + 6px) !important;
  height: calc(var(--v-btn-height) + 6px) !important;
}
</style>
