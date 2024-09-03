<template>
  <UserProfileForm
    :search-dialog="searchDialog"
    :userInfo-dialog="userInfoDialog"
    @update:search-dialog="updateSearchDialog"
    @update:userInfo-dialog="updateUserInfoDialog"
  />
</template>

<script setup>
import UserProfileForm from '@/components/UserProfileForm.vue'

const props = defineProps({
  searchDialog: {
    type: Boolean,
    default: false
  },
  userInfoDialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:search-dialog', 'update:userInfo-dialog'])

const updateSearchDialog = (value) => {
  emit('update:search-dialog', value)
}
const updateUserInfoDialog = (value) => {
  emit('update:userInfo-dialog', value)
}
</script>

<style>
.v-toast {
  z-index: 9999 !important;
}
</style>
