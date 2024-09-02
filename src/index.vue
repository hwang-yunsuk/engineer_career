<template>
  <v-container class="custom-width">
    <v-app>
      <HeaderComponent @open-search="toggleSearchDialog" @open-userInfo="toggleUserInfoDialog" />
      <HomeView
        :search-dialog="searchDialog"
        :userInfo-dialog="userInfoDialog"
        @update:search-dialog="updateSearchDialog"
        @update:userInfo-dialog="updateUserInfoDialog"
      />
    </v-app>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import HeaderComponent from '@/components/header.vue'
import HomeView from '@/views/HomeView.vue'

const searchDialog = ref(false)
const userInfoDialog = ref(false)

const toggleSearchDialog = () => {
  searchDialog.value = true
}

const toggleUserInfoDialog = () => {
  userInfoDialog.value = true
}

const updateSearchDialog = (value) => {
  searchDialog.value = value
}

const updateUserInfoDialog = (value) => {
  userInfoDialog.value = value
}
</script>

<style>
.custom-width {
  max-width: 1300px;
}
</style>
