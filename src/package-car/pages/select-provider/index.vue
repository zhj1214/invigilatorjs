<template>
  <view>
    <view class="location items-center justify-center" @click="handleCityPicker">
      <image class="image" mode="scaleToFill" :src="locationImg" />
      <text>{{ city }}</text>
      <image class="image" mode="scaleToFill" :src="iconArrowDown" />
    </view>
    <scroll-view class="provider" :refresher-triggered="isRefresh" scroll-y refresher-enabled :lower-threshold="100" @refresherrefresh="onRefresh" @scrolltolower="onScrolltolower">
      <view class="privider-list">
        <view v-for="item in dealerList" :key="item.code" class="provider-item items-center justify-center" @click="changeCheck(item)">
          <view class="info flex-col">
            <view class="title ellipsis">{{ item.name || '' }}</view>
            <view class="address ellipsis-2">{{ item.address || '' }}</view>
            <view v-if="item.telephone" class="tel">联系电话：{{ item.telephone }}</view>
          </view>
          <view class="check">
            <image v-if="dealer.code === item.code" class="image" :src="itemCheckImg" mode="scaleToFill" />
          </view>
        </view>
      </view>
      <view v-if="isEmpty" class="no-data">附近暂无经销商</view>
      <view v-if="isLastPage" class="no-more">-没有更多了-</view>
    </scroll-view>
    <sp-city-picker v-model="cityPickerVisible" :pick-level="2" @change="toCityChange" />
  </view>
</template>

<script lang="ts" setup name="SelectProvider">
import { ref, reactive, computed, inject, watch } from 'vue'
import { getDealerList } from '@api/car'
import { onLoad } from '@dcloudio/uni-app'
import { useCarStore } from '@src/pinia/car'
import { relogin } from '@src/api/request'
import { useLocationStore } from '@src/pinia/location'
import { useAppStore } from '@src/pinia/app'
const appStore = useAppStore()
const carStore = useCarStore()
const locationStore = useLocationStore()

const isLogin = computed(() => appStore.isLogin)

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [itemCheckImg, locationImg, iconArrowDown] = gdp(['item-check.png', 'icon-location-dark.png', 'icon-arrow-down.png'])

const isRefresh = ref(false)

const pageNo = ref(1)
const pageSize = ref(10)

const isEmpty = ref(false)
const isLastPage = ref(false)

const isLoading = ref(false)

const location = computed(() => locationStore.cityInfo)

const cityCode = ref('')
const city = ref('')
watch(
  () => location.value,
  (newVal) => {
    cityCode.value = newVal.cityCode
    city.value = newVal.city !== '市辖区' ? newVal.city : newVal.province
    getProvider(true)
  },
  {
    deep: true,
    immediate: true
  }
)
const dealer = computed(() => carStore.provider)

const cityPickerVisible = ref(false)

const dealerList: Dealer.Iteminfo[] = reactive([])

onLoad(async () => {
  uni.showLoading({
    title: '加载中'
  })
  try {
    if (!cityCode.value) {
      try {
        await locationStore.getLocation()
        await locationStore.getCityCode()
      } catch {}
    }
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
  }
})

async function onRefresh() {
  pageNo.value = 1
  isLastPage.value = false
  isRefresh.value = true
  await getProvider(true)
  isRefresh.value = false
}

function onScrolltolower() {
  if (isLoading.value || isLastPage.value) {
    return
  }
  pageNo.value++
  getProvider()
}

function toCityChange(val: User.CityInfo[]) {
  locationStore.$patch({
    cityInfo: {
      province: val[0].name,
      cityCode: val[1].code,
      city: val[1].name
    }
  })
  pageNo.value = 1
  isLastPage.value = false
}

/**
 * 获取供应商数据
 * @param refresh
 */
async function getProvider(refresh?: boolean) {
  isLoading.value = true
  try {
    const dealerData = await getDealerList({
      cityCode: cityCode.value || '330100',
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    isLoading.value = false
    const { total, data = [] } = dealerData
    isEmpty.value = !total
    // 刷新先清空数据
    if (refresh) {
      dealerList.splice(0, dealerList.length)
    }
    const dealers = dealerData.data.map((item) => {
      return {
        id: item.id,
        code: item.code,
        name: item.name,
        address: item.details,
        image: item.image,
        telephone: item.telephone
      }
    })

    // 添加数据
    dealerList.push(...dealers)

    /**
     * 判断数据是否已全部加载完成
     */
    if (total <= pageNo.value * pageSize.value || data.length < pageSize.value) {
      isLastPage.value = true
    }
  } catch (error) {
    isLoading.value = false
  }
}

function handleCityPicker() {
  if (!isLogin.value) {
    relogin()
    return
  }
  cityPickerVisible.value = true
}

function changeCheck(item: Dealer.Iteminfo) {
  carStore.setProvider(item)
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.location {
  height: 88rpx;
  background: #f2f3f3;

  .image {
    width: 32rpx;
    height: 32rpx;

    &:last-of-type {
      margin-left: 14rpx;
    }
  }
}

.provider {
  height: calc(100vh - 88rpx - env(safe-area-inset-bottom) - var(--window-top));
}

.privider-list {
  padding: 0 40rpx;
}

.provider-item {
  width: 100%;
  height: 212rpx;
  border-bottom: 1rpx solid #e4e7ea;

  .info {
    flex: 1;
    overflow: hidden;

    .title {
      font-size: 32rpx;
      color: #292c2e;
      line-height: 47rpx;
    }

    .address {
      font-size: 24rpx;
      color: #909ca8;
      line-height: 36rpx;
      margin-bottom: 14rpx;
    }

    .tel {
      font-size: 26rpx;
      color: #909ca8;
      line-height: 38rpx;
    }
  }

  .check {
    flex-basis: 48rpx;

    .image {
      width: 48rpx;
      height: 48rpx;
    }
  }
}

.no-data {
  padding: 75rpx 40rpx 124rpx;
  text-align: center;
  font-size: 26rpx;
  color: #909ca8;
}

.no-more {
  text-align: center;
  font-size: 26rpx;
  color: #909ca8;
  padding: 40rpx;
}
</style>
