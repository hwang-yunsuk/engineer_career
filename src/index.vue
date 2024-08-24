<template>
  <v-container class="custom-width">
    <v-app>
      <HeaderComponent @open-search="toggleSearchDialog" />
      <HomeView :search-dialog="searchDialog" @update:search-dialog="updateSearchDialog" />
    </v-app>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import HeaderComponent from '@/components/header.vue'
import HomeView from '@/views/HomeView.vue'

const searchDialog = ref(false)

const toggleSearchDialog = () => {
  searchDialog.value = true
}

const updateSearchDialog = (value) => {
  searchDialog.value = value
}
</script>

<style>
.custom-width {
  max-width: 1300px;
}
</style>
