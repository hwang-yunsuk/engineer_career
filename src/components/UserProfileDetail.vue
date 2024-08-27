<template>
  <v-container>
    <v-form>
      <v-divider v-if="number > 1" class="border-opacity-25 mb-10"></v-divider>
      <v-row>
        <div class="number-style">
          No. {{ number }}
          <v-btn v-if="isDeletable" icon @click="remove">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-row>
      <v-row>
        <v-col cols="8" class="pb-1 mr-12">期間 <span class="required-mark">※</span></v-col>
        <v-col class="pb-1">月数</v-col>
      </v-row>
      <v-row class="pb-4">
        <v-col cols="4">
          <v-row>
            <v-col cols="6">
              <v-select
                label="開始年"
                v-model="startYear"
                variant="outlined"
                :items="yearList"
                required
                hide-details
              >
              </v-select>
            </v-col>
            <div class="align-bottom">年</div>
            <v-col cols="4">
              <v-select
                label="開始月"
                v-model="startMonth"
                variant="outlined"
                :items="monthList"
                required
                hide-details
              >
              </v-select>
            </v-col>
            <div class="align-bottom">月</div>
          </v-row>
        </v-col>
        <div class="separator-size">〜</div>
        <v-col cols="4">
          <v-row>
            <v-col cols="6">
              <v-select
                label="終了年"
                v-model="endYear"
                variant="outlined"
                :items="yearList"
                required
                hide-details
              >
              </v-select>
            </v-col>
            <div class="align-bottom">年</div>
            <v-col cols="4">
              <v-select
                label="終了月"
                v-model="endMonth"
                variant="outlined"
                :items="monthList"
                required
                hide-details
              >
              </v-select>
            </v-col>
            <div class="align-bottom">月</div>
          </v-row>
        </v-col>
        <v-col cols="1">
          <v-text-field
            :value="monthOfNumber"
            disabled
            variant="solo"
            outlined
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-col class="pl-0" cols="6">
        <div class="mb-4">業種 <span class="required-mark">※</span></div>
        <v-text-field
          v-model="localDetail.businessCategory"
          :placeholder="constObj.businessCategoryPH"
          variant="solo"
          outlined
        ></v-text-field>
      </v-col>
      <v-col class="pl-0" cols="6">
        <div class="mb-4">システム名 <span class="required-mark">※</span></div>
        <v-text-field
          v-model="localDetail.systemName"
          :placeholder="constObj.systemNamePH"
          variant="solo"
          outlined
        ></v-text-field>
      </v-col>
      <v-col class="pl-0" cols="6">
        <div class="mb-4">業務・作業内容 <span class="required-mark">※</span></div>
        <v-textarea
          v-model="localDetail.workDetails"
          :placeholder="constObj.workDetailsPH"
          variant="solo"
          outlined
        ></v-textarea>
      </v-col>
      <checkbox
        :options="osOptions"
        :label="osOptionLabel"
        v-model="localDetail.osTypeOption"
        @update:selectOption="updateOsOption"
      />
      <checkbox
        :options="dbOptions"
        :label="dbOptionLabel"
        v-model="localDetail.dbTypeOption"
        @update:selectOption="updateDbOption"
      />
      <checkbox
        :options="developmentOptions"
        :label="developmentOptionLabel"
        v-model="localDetail.developmentTypeOption"
        @update:selectOption="updateDevelopmentOption"
      />
      <checkbox
        :options="projectPhaseOptions"
        :label="projectPhaseOptionLabel"
        v-model="localDetail.projectPhaseTypeOption"
        @update:selectOption="updateProjectPhaseOption"
      />
      <v-col class="pl-0" cols="6">
        <div class="mb-4">備考</div>
        <v-textarea v-model="localDetail.comment" variant="solo" outlined></v-textarea>
      </v-col>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { constObj } from '@/const.js'
import { useToast } from 'vue-toast-notification'
import { request } from '../api/utils'
import checkbox from '@/hooks/checkbox.vue'

const props = defineProps({
  number: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  isDeletable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:userProfileDetail', 'removeDetail', 'loadingChange'])

const startYear = ref('')
const startMonth = ref('')
const endYear = ref('')
const endMonth = ref('')
const monthOfNumber = ref(0)
const osOptionLabel = ref('OS')
const dbOptionLabel = ref('DataBase')
const developmentOptionLabel = ref('DevelopmentLanguages')
const projectPhaseOptionLabel = ref('projectPhase')
// 取得資格の年リスト
const yearList = ref([])
// 取得資格の月リスト
const monthList = ref([])

const optionList = ref({})

const localDetail = ref({ ...props.modelValue })

// toast
const $toast = useToast()

// Propsが変更されたときにローカルデータを更新
watch(
  () => props.modelValue,
  (newVal) => {
    if (localDetail.value !== newVal) {
      localDetail.value = { ...newVal }
    }
  },
  { deep: true }
)

watch(
  () => localDetail.value,
  (newVal) => {
    if (newVal !== props.modelValue) {
      emit('update:userProfileDetail', newVal)
    }
  },
  { deep: true }
)

const updateOsOption = (value) => {
  localDetail.value.osTypeOption = value
}

const updateDbOption = (value) => {
  localDetail.value.dbTypeOption = value
}

const updateDevelopmentOption = (value) => {
  localDetail.value.developmentTypeOption = value
}

const updateProjectPhaseOption = (value) => {
  localDetail.value.projectPhaseTypeOption = value
}

const remove = () => {
  emit('removeDetail')
}

const calculateMonthDifference = () => {
  if (!startYear.value || !startMonth.value || !endYear.value || !endMonth.value) {
    localDetail.value.monthOfNumber = 0
    return
  }

  // 月をMM形式にする
  const formattedStartMonth = String(startMonth.value).padStart(2, '0')
  const formattedEndMonth = String(endMonth.value).padStart(2, '0')

  // 日付をYYYY/MM形式で設定
  localDetail.value.startDate = `${startYear.value}/${formattedStartMonth}`
  localDetail.value.endDate = `${endYear.value}/${formattedEndMonth}`

  const startDate = new Date(startYear.value, startMonth.value - 1)
  const endDate = new Date(endYear.value, endMonth.value - 1)

  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12
  months += endDate.getMonth() - startDate.getMonth()

  // 月数が0の場合でも1と表示する
  if (months >= 0) {
    monthOfNumber.value = months + 1
    localDetail.value.monthOfNumber = months + 1
  } else {
    monthOfNumber.value = 0
    localDetail.value.monthOfNumber = 0
  }
}

// Watchers for start and end dates
watch([startYear, startMonth, endYear, endMonth], calculateMonthDifference)

// OSの選択肢を配列に設定
const osOptions = computed(() => {
  return optionList.value.osTypes ? Object.values(optionList.value.osTypes) : []
})
// DBの選択肢を配列に設定
const dbOptions = computed(() => {
  return optionList.value.databaseTypes ? Object.values(optionList.value.databaseTypes) : []
})

// 開発言語/ツールの選択肢を配列に設定
const developmentOptions = computed(() => {
  return optionList.value.developmentLanguagesAndTools
    ? Object.values(optionList.value.developmentLanguagesAndTools)
    : []
})

// 担当工程の選択肢を配列に設定
const projectPhaseOptions = computed(() => {
  return optionList.value.projectPhase ? Object.values(optionList.value.projectPhase) : []
})

const initData = async () => {
  try {
    // オプションリストを取得
    const getOptionList = await request('apiGetOptionList')
    optionList.value = getOptionList.data
    emit('loadingChange', false)
  } catch (error) {
    $toast.error('データの取得中にエラーが発生しました' + '<br>' + error)
    // 1秒待機後にローディングを解除
    setTimeout(() => {}, 1000)
    emit('loadingChange', false)
  }
}

onMounted(async () => {
  // 現在の年を取得
  const currentYear = new Date().getFullYear()
  // 今年から20年前までのリストを作成してセット
  for (let i = 0; i <= 40; i++) {
    yearList.value.push(currentYear - i)
  }
  // 1月から12月までのリストを作成してセット
  for (let i = 1; i <= 12; i++) {
    monthList.value.push(i)
  }
  // init処理
  await initData()
})
</script>

<style scoped>
.number-style {
  font-size: 20px;
  margin-left: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.separator {
  display: flex;
  align-items: center; /* 垂直方向中央揃え */
  justify-content: center; /* 水平方向中央揃え */
}
.separator-size {
  font-size: 25px;
  align-content: center;
  margin-right: 30px;
}
.align-bottom {
  align-content: end;
  padding-bottom: 15px;
}
.required-mark {
  color: red;
}
</style>
