<template>
  <div>
    <v-col class="pl-0" cols="6">
      <div>{{ label }} <span class="required-mark">※</span></div>
    </v-col>

    <!-- Typeごとにオプションを表示 -->
    <v-row v-for="(optionType, typeName) in displayedTypes" :key="typeName" class="mb-4">
      <v-col cols="12">
        <h5 class="mb-4">{{ optionType.type }}</h5>
        <v-row>
          <v-col class="py-0" v-for="item in optionType.examples" :key="item.name" cols="2">
            <v-checkbox
              color="primary"
              :label="item"
              v-model="selectedOptions[item]"
              @input="updateSelection"
              hide-details
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <h5 class="mb-4">その他</h5>
    <v-col cols="6">
      <v-textarea
        v-model="optionEtc"
        rows="1"
        variant="solo"
        outlined
        @input="updateSelection"
      ></v-textarea>
    </v-col>

    <!-- 全体表示ボタン -->
    <div v-if="hasMoreOptions" class="text-right mt-4">
      <v-btn color="primary" @click="toggleExpand" variant="text">
        {{ isExpanded ? '折りたたむ' : '全体表示' }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  },
  label: {
    type: String,
    default: null
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

// Emit
const emit = defineEmits(['update:selectOption'])

// State
const isExpanded = ref(false)
const selectedOptions = ref({})
const optionEtc = ref('')

// 初期化または親からのリセットの際に `selectedOptions` を初期化
const initializeOptions = () => {
  selectedOptions.value = {}
  optionEtc.value = ''
  Object.values(props.options).forEach((optionType) => {
    optionType.examples.forEach((item) => {
      selectedOptions.value[item] = props.modelValue.includes(item)
    })
  })
  // その他の入力がモデルに含まれている場合、それを設定
  const etcOption = props.modelValue.find(
    (item) => !Object.keys(selectedOptions.value).includes(item)
  )
  if (etcOption) {
    optionEtc.value = etcOption
  }
}

// 初期化を最初に実行
initializeOptions()

// Propsが変更された際に再初期化
watch(
  () => props.options,
  () => {
    initializeOptions()
  },
  { deep: true, immediate: true }
)

watch(
  () => props.modelValue,
  () => {
    initializeOptions()
  },
  { deep: true }
)

// 表示するtypeを制御する計算プロパティ
const displayedTypes = computed(() => {
  const typesArray = Object.values(props.options)

  if (isExpanded.value) {
    return typesArray // 全体表示のときは全てのtypeを表示
  } else {
    return typesArray.slice(0, 2) // 折りたたむ時は最初の2つのtypeを表示
  }
})

// 全体表示ボタンの条件
const hasMoreOptions = computed(() => {
  return Object.keys(props.options).length > 2
})

// 選択状態を管理
const updateSelection = () => {
  const selectedItems = Object.keys(selectedOptions.value).filter(
    (key) => selectedOptions.value[key]
  )

  if (optionEtc.value) {
    // その他入力フラグ
    selectedItems.push(optionEtc.value, { optionEtcEdit: `(${optionEtc.value})` })
  }

  emit('update:selectOption', selectedItems)
}

// 全体表示と折りたたみを切り替える
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.required-mark {
  color: red;
}
.text-right {
  text-align: right !important;
}
</style>
