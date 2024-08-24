<template>
  <v-dialog v-model="showDialog" width="500" height="500">
    <v-card prepend-icon="mdi-map-marker" max-width="500" :text="dialogText" :title="dialogTitle">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn text="はい" @click="hanldleSubmit"></v-btn>
        <v-btn text="いいえ" @click="closeDialog"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  dialog: {
    type: Boolean
  },
  dialogText: {
    type: String,
    default: null
  },
  dialogTitle: {
    type: String,
    default: null
  }
})

const showDialog = ref(props.dialog)
const emitSubmit = ref(false)
const dialogText = ref(props.dialogText)
const dialogTitle = ref(props.dialogTitle)

// props.dialog の変化を showDialog に反映させる
watch(
  () => props.dialog,
  (newVal) => {
    showDialog.value = newVal
  }
)

const emit = defineEmits(['setHandleSubmit'])

const hanldleSubmit = () => {
  emitSubmit.value = true
  emit('setHandleSubmit', emitSubmit.value)
  showDialog.value = false // ダイアログを閉じる
}
const closeDialog = () => {
  showDialog.value = false
  emit('closeDialog')
}
</script>
