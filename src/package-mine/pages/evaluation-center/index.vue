<template>
  <enter-menu-list title="评价中心" :menus="items" />
</template>

<script lang="ts" setup>
import EnterMenuList from '../../components/enter-menu-list/index.vue'

const items = [
  {
    name: '购车评价',
    link: '/package-mine/pages/evaluation-list/index?itemType=0'
  },
  {
    name: '生活评价',
    link: '/package-mine/pages/evaluation-list/index?itemType=1'
  }
]
</script>
