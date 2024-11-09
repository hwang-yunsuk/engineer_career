<template>
  <v-container>
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
      <v-col cols="8" class="pb-1 mr-12">
        期間
        <span class="required-mark">※</span>
        <span class="text-light-gray">From〜To〜</span>
      </v-col>
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
              :rules="inputDetailRules.startYear"
              required
            >
            </v-select>
          </v-col>
          <div class="align-bottom">年</div>
          <v-col cols="5">
            <v-select
              label="開始月"
              v-model="startMonth"
              variant="outlined"
              :items="monthList"
              :rules="inputDetailRules.startMonth"
              required
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
              :rules="inputDetailRules.endYear"
              required
            >
            </v-select>
          </v-col>
          <div class="align-bottom">年</div>
          <v-col cols="5">
            <v-select
              label="終了月"
              v-model="endMonth"
              variant="outlined"
              :items="monthList"
              :rules="inputDetailRules.endMonth"
              required
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
        :rules="inputDetailRules.businessCategory"
        variant="solo"
        outlined
      ></v-text-field>
    </v-col>
    <v-col class="pl-0" cols="6">
      <div class="mb-4">システム名 <span class="required-mark">※</span></div>
      <v-text-field
        v-model="localDetail.systemName"
        :placeholder="constObj.systemNamePH"
        :rules="inputDetailRules.systemName"
        variant="solo"
        outlined
      ></v-text-field>
    </v-col>
    <v-col class="pl-0" cols="6">
      <div class="mb-4">業務・作業内容 <span class="required-mark">※</span></div>
      <v-textarea
        v-model="localDetail.workDetails"
        :placeholder="constObj.workDetailsPH"
        :rules="inputDetailRules.workDetails"
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
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { constObj } from '@/const.js'
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
  },
  optionList: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:userProfileDetail', 'removeDetail', 'loadingChange'])

const startYear = ref(props.modelValue.startYear || '')
const startMonth = ref(props.modelValue.startMonth || '')
const endYear = ref(props.modelValue.endYear || '')
const endMonth = ref(props.modelValue.endMonth || '')
const monthOfNumber = ref(props.modelValue.monthOfNumber || 0)
const osOptionLabel = ref('OS')
const dbOptionLabel = ref('DataBase')
const developmentOptionLabel = ref('DevelopmentLanguages')
const projectPhaseOptionLabel = ref('projectPhase')
// 取得資格の年リスト
const yearList = ref([])
// 取得資格の月リスト
const monthList = ref([])
// const optionList = ref({})
const localDetail = ref({ ...props.modelValue })
const optionList = ref(props.optionList)

// Propsが変更されたときにローカルデータを更新
watch(
  () => props.modelValue,
  (newVal) => {
    if (localDetail.value !== newVal) {
      localDetail.value = { ...newVal }
      startYear.value = newVal.startYear || ''
      startMonth.value = newVal.startMonth || ''
      endYear.value = newVal.endYear || ''
      endMonth.value = newVal.endMonth || ''
      calculateMonthDifference()
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
  return optionList.value && optionList.value.osTypes ? Object.values(optionList.value.osTypes) : []
})
// DBの選択肢を配列に設定
const dbOptions = computed(() => {
  return optionList.value && optionList.value.databaseTypes
    ? Object.values(optionList.value.databaseTypes)
    : []
})
// 開発言語/ツールの選択肢を配列に設定
const developmentOptions = computed(() => {
  return optionList.value && optionList.value.developmentLanguagesAndTools
    ? Object.values(optionList.value.developmentLanguagesAndTools)
    : []
})
// 担当工程の選択肢を配列に設定
const projectPhaseOptions = computed(() => {
  return optionList.value && optionList.value.projectPhase
    ? Object.values(optionList.value.projectPhase)
    : []
})

// 各入力フィールド用のルール
const inputDetailRules = reactive({
  startYear: [(val) => !!val || '開始年は必須です'],
  startMonth: [(val) => !!val || '開始月は必須です'],
  endYear: [(val) => !!val || '終了年は必須です'],
  endMonth: [(val) => !!val || '終了月は必須です'],
  businessCategory: [(val) => !!val || '業種は必須です'],
  systemName: [(val) => !!val || 'システム名は必須です'],
  workDetails: [(val) => !!val || '業務・作業内容は必須です']
})

onMounted(async () => {
  // 現在の年を取得
  const currentYear = new Date().getFullYear()
  // 今年から20年前までのリストを作成してセット
  for (let i = 0; i <= 40; i++) {
    yearList.value.push(currentYear - i)
  }
  // 1月から12月までのリストを作成してセット
  for (let i = 1; i <= 12; i++) {
    monthList.value.push(String(i).padStart(2, '0'))
  }
  // init処理
  // await initData()
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
  padding-bottom: 40px;
}
.required-mark {
  color: red;
}
.text-light-gray {
  margin-left: 15px;
  color: #b0b0b0;
}
</style>
