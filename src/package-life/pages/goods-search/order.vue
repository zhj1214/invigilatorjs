<template>
  <view class="order items-center">
    <view v-for="item in orderConditions" :key="item.key" class="order-item items-center" :class="{ active: sortKey === item.key }" @click="changeOrder(item)">
      <text class="text">{{ item.name }}</text>
      <template v-if="item.key !== 'default'">
        <image v-show="sortKey !== item.key || sortType === null" class="icon" :src="orderNoneImg" />
        <image v-show="sortKey === item.key && sortType === 0" class="icon" :src="descendingImg" />
        <image v-show="sortKey === item.key && sortType === 1" class="icon" :src="ascendingImg" />
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { inject, reactive, ref, Ref } from 'vue'

interface OrderItemInfo {
  name: string
  key: string
}

const emit = defineEmits(['change'])

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [ascendingImg, descendingImg, orderNoneImg] = gdp(['order-ascending.png', 'order-descending.png', 'order-none.png'])

const sortKey = ref('default')
// 0 降序 1 升序
const sortType: Ref<number | null> = ref(null)

const orderConditions: OrderItemInfo[] = reactive([
  { name: '默认', key: 'default' },
  { name: '销量', key: 'quantity' },
  { name: '价格', key: 'price' }
])

function changeOrder(item: OrderItemInfo) {
  if (item.key === 'default' && sortKey.value === item.key) {
    return
  }
  if (item.key === 'default') {
    sortType.value = null
  } else if (sortKey.value === item.key) {
    sortType.value = sortType.value === 0 ? 1 : 0
  } else {
    sortType.value = 0
  }
  sortKey.value = sortType.value === null ? 'default' : item.key
  emit('change', {
    sortKey: sortKey.value,
    sortType: sortType.value
  })
}
</script>

<style lang="scss" scoped>
.order {
  padding: 0 40rpx;
  height: 100rpx;

  .order-item {
    padding: 0 15rpx;
    margin-right: 15rpx;

    &.active {
      .text {
        color: #292c2e;
        font-weight: 500;
      }
    }
  }

  .text {
    color: #92969a;
    font-size: 30rpx;
    margin-right: 6rpx;
  }

  .icon {
    width: 28rpx;
    height: 28rpx;
  }
}
</style>
