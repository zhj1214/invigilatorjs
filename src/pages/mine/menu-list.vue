<template>
  <view v-for="menu in menus" :key="menu.name" class="flex-row items-center menu-item" @click="goToMenuItem(menu)">
    <image class="icon-left" :src="menu.icon" mode="aspectFill" />
    <view class="flex-row items-center right">
      <text class="menu-title font-regular">{{ menu.name }}</text>
      <image class="icon-right" :src="rightIcon" mode="aspectFill" />
    </view>
  </view>
</template>

<script setup lang="ts" name="MenuList">
import { inject } from 'vue'

export interface MenuItem {
  name: string
  link: string
  icon: string
}

const emit = defineEmits(['click'])

// 右箭头icon
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string>
const rightIcon = gdp('icon-right.png')

// 菜单menu
const menus: MenuItem[] = [
  {
    name: '心愿单',
    link: '/package-mine/pages/wish-list/index',
    icon: gdp('wish-list.png')
  },
  {
    name: '购物车',
    link: '/package-mine/pages/shopping-cart/index',
    icon: gdp('shopping-cart.png')
  },
  {
    name: '订单',
    link: '/package-mine/pages/order-type/index',
    icon: gdp('order.png')
  },
  {
    name: '退款售后',
    link: '/package-mine/pages/after-sale-type/index',
    icon: gdp('aftersale.png')
  },
  {
    name: '我的徽章',
    link: '/package-mine/pages/medal/index',
    icon: gdp('medal.png')
  },
  {
    name: '评价中心',
    link: '/package-mine/pages/evaluation-center/index',
    icon: gdp('evaluation-center.png')
  },
  {
    name: '卡券',
    link: '/package-mine/pages/coupon/index',
    icon: gdp('coupon.png')
  },
  {
    name: '试驾行程单',
    link: '/package-mine/pages/test-drive-itinerary/index',
    icon: gdp('test-drive-record.png')
  },
  {
    name: '账号管理',
    link: '',
    icon: gdp('account.png')
  },
  {
    name: '设置',
    link: '/package-mine/pages/setting/index',
    icon: gdp('setting.png')
  }
]

const goToMenuItem = (menu: MenuItem) => {
  emit('click', menu)
}
</script>

<style lang="scss" scoped>
.menu-item {
  padding: 0 48rpx 0 38rpx;
  height: 146rpx;

  .icon-left {
    width: 40rpx;
    height: 40rpx;
    margin-right: 56rpx;
  }

  .right {
    height: 100%;
    flex: 1;
    border-bottom: 1rpx solid #e4e7ea;

    .menu-title {
      color: #495056;
      font-size: 30rpx;
    }

    .icon-right {
      width: 32rpx;
      height: 32rpx;
      margin-left: auto;
    }
  }
}
</style>
