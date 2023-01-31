<template>
  <enter-menu-list title="退款售后" :menus="items" />
</template>

<script lang="ts" setup>
import EnterMenuList from '../../components/enter-menu-list/index.vue'

const items = [
  {
    name: '购车售后订单',
    link: '/package-mine/pages/after-sale-list-car/index'
  },
  {
    name: '生活售后订单',
    link: '/package-mine/pages/after-sale-list-life/index'
  }
]
</script>
