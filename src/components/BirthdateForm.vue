<!-- BirthdateForm.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <datePicker :user-date="userDate" :date-label="dateLabel" @update:updateDate="updateDate" />
      </v-col>
      <v-col cols="2">
        <div class="mb-4">年齢</div>
        <v-text-field :value="localUserAge" disabled variant="solo" outlined></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { formatYYYYMMDDToDate } from '@/utils/dateFormater.js'
import datePicker from '@/hooks/datePicker.vue'

// Propsの定義
const props = defineProps({
  userBirthdate: {
    type: Date,
    default: null
  },
  userAge: {
    type: Number,
    default: null
  }
})

// Emitsを定義
const emit = defineEmits(['update:userBirthdate', 'update:userAge'])

// ローカル状態を定義
const userDate = ref(props.userBirthdate)
const localUserAge = ref(props.userAge)
// 生年月日のラベル設定
const dateLabel = ref('生年月日')

// Watcherを追加してpropsの変化を監視
watch(
  () => props.userBirthdate,
  (newVal) => {
    userDate.value = newVal
    if (newVal) {
      calculateAge(newVal)
    } else {
      localUserAge.value = null
    }
  },
  { immediate: true }
)

watch(
  () => props.userAge,
  (newVal) => {
    localUserAge.value = newVal
  },
  { immediate: true }
)

// イベントハンドラー
const updateDate = (userdate) => {
  if (!userdate) {
    localUserAge.value = null // クリア時に年齢を初期化
    userDate.value = null
  } else {
    calculateAge(userdate)
    userDate.value = userdate
  }
  emit('update:userBirthdate', userdate)
}

const calculateAge = (birthDate) => {
  if (!birthDate) {
    localUserAge.value = null
    emit('update:userBirthdate', null)
  }

  // birthDateがDate型でない場合、yyyy-mm-dd形式の文字列と仮定してDate型に変換
  if (!(birthDate instanceof Date)) {
    birthDate = formatYYYYMMDDToDate(birthDate)
  }

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  if (age !== localUserAge.value) {
    localUserAge.value = age
    emit('update:userAge', age)
  }
}
</script>

<style scoped></style>
