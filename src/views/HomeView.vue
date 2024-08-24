<template>
  <UserProfileForm :search-dialog="searchDialog" @update:search-dialog="updateSearchDialog" />
</template>

<script setup>
import UserProfileForm from '@/components/UserProfileForm.vue'

const props = defineProps({
  searchDialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:search-dialog'])

const updateSearchDialog = (value) => {
  emit('update:search-dialog', value)
}
</script>
