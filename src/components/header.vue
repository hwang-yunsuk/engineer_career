<template>
  <v-app-bar id="header" color="white" height="max-content">
    <v-toolbar-title class="mx-auto ml-2">Engineer Career</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="handleClickSearch">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn icon @click="handleClickReload">
      <v-icon>mdi-home</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { request } from '@/api/utils'
const emit = defineEmits(['open-search'])

const handleClickSearch = () => {
  emit('open-search')
}

const handleClickReload = async () => {
  try {
    const response = await request('triggerReload')
    // レスポンスがリロードスクリプトであれば、evalを使って実行
    window.open(response.url, '_self')
  } catch (error) {
    console.error('リロード処理に失敗しました:', error)
  }
}
</script>
