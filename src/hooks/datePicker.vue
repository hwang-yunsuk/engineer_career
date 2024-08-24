<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y location="end">
    <template #activator="{ props }">
      <div class="mb-4">{{ dateLabel }} <span class="required-mark">※</span></div>
      <v-text-field
        v-model="formattedDate"
        placeholder="入力してください。"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="props"
        outlined
        clearable
        variant="solo"
        @click:clear="handleClear"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      show-adjacent-months
      locale="ja-JP"
      @update:modelValue="handleDateUpdate"
    ></v-date-picker>
  </v-menu>
</template>

<script setup>
import { ref, watch } from 'vue'

// Propsの定義
const props = defineProps({
  userDate: {
    type: Date,
    default: null
  },
  dateLabel: {
    type: String,
    default: null
  }
})

// Emitsを定義
const emit = defineEmits(['update:userDate'])

// ローカル状態を定義
const date = ref(props.userDate)
const menu = ref(false)
const formattedDate = ref('')
const dateLabel = ref(props.dateLabel)

// Propsが変化した際にローカルの状態を更新
watch(
  () => props.userDate,
  (newDate) => {
    if (newDate && newDate !== date.value) {
      formatDate(newDate)
    } else if (!newDate) {
      date.value = newDate
      formattedDate.value = ''
    }
  }
)

// 日付を yyyy-mm-dd 形式にフォーマットし、イベントをトリガーする関数
const handleDateUpdate = (value) => {
  if (value) {
    formatDate(value)
    emit('update:updateDate', value)
  }
}

const formatDate = (value) => {
  if (!value) {
    formattedDate.value = ''
    return
  }

  const dateObject = new Date(value)
  const year = dateObject.getFullYear()
  const month = String(dateObject.getMonth() + 1).padStart(2, '0')
  const day = String(dateObject.getDate()).padStart(2, '0')
  formattedDate.value = `${year}-${month}-${day}`

  menu.value = false
}

// クリアボタンがクリックされたときの処理
const handleClear = () => {
  formattedDate.value = ''
  date.value = null
  if (dateLabel.value === '生年月日') {
    emit('update:updateDate', null)
  }
  emit('update:updateDate', null)
}
</script>

<style scoped>
.required-mark {
  color: red;
}
</style>
