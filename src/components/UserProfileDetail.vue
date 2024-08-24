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
        <v-col cols="4">
          <datePicker
            :user-date="localDetail.startDate"
            :date-label="startDateLabel"
            @update:updateDate="updateStartDate"
          />
        </v-col>
        <v-col class="d-flex separator" cols="1">
          <div class="separator-size">〜</div>
        </v-col>
        <v-col cols="4">
          <datePicker
            :user-date="localDetail.endDate"
            :date-label="endDateLabel"
            @update:updateDate="updateEndDate"
          />
        </v-col>
        <v-col cols="2">
          <div class="mb-4">月数</div>
          <v-text-field :value="monthOfNumber" disabled variant="solo" outlined></v-text-field>
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
import datePicker from '@/hooks/datePicker.vue'
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

const startDateLabel = ref('開始期間')
const endDateLabel = ref('終了期間')
const osOptionLabel = ref('OS')
const dbOptionLabel = ref('DataBase')
const developmentOptionLabel = ref('DevelopmentLanguages')
const projectPhaseOptionLabel = ref('projectPhase')

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

const updateStartDate = (newStartDate) => {
  localDetail.value.startDate = newStartDate
}

const updateEndDate = (newEndDate) => {
  localDetail.value.endDate = newEndDate
}

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

const monthOfNumber = computed(() => {
  if (!localDetail.value.startDate || !localDetail.value.endDate) {
    return null
  }

  const start = new Date(localDetail.value.startDate)
  const end = new Date(localDetail.value.endDate)

  let months = (end.getFullYear() - start.getFullYear()) * 12
  months += end.getMonth() - start.getMonth()

  if (end.getDate() < start.getDate()) {
    months -= 1
  }

  if (months > 0) {
    localDetail.value.monthOfNumber = months
  } else {
    localDetail.value.monthOfNumber = 0
  }

  return localDetail.value.monthOfNumber
})

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
  margin-top: 10px;
}
.required-mark {
  color: red;
}
</style>
