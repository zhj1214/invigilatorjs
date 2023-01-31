<template>
  <enter-menu-list title="订单类型" :menus="items" />
</template>

<script lang="ts" setup>
import EnterMenuList from '../../components/enter-menu-list/index.vue'

const items = [
  {
    name: '购车订单',
    link: '/package-mine/pages/order-list-car/index'
  },
  {
    name: '生活订单',
    link: '/package-mine/pages/order-list-life/index'
  }
]
</script>
