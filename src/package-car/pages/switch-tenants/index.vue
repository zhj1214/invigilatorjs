<template>
  <view class="switch-tenants">
    <view class="page-title">
      当前租户
      <!-- 最多展示12个字 -->
      <view class="tenants-name ellipsis">{{ selectedTenantName }}</view>
    </view>
    <!-- 列表 -->
    <view class="tenants-list-box">
      <template v-for="(tenant, index) in tenantList.data" :key="index">
        <view :class="['list-item', selectedTenant.data.tenantId === tenant.tenantId ? 'selected-item' : '']" @click="toSelectedTenantFn(tenant)">
          <view class="logo-box"><image class="tenant-logo" :src="tenant.iconUrl" mode="aspectFit" /></view>
          <view class="tenant-name ellipsis-2">{{ tenant.tenantName }}</view>
        </view>
      </template>
    </view>
    <view class="footer-box">
      <view class="btn" @click="changeTenant">切换</view>
    </view>
  </view>
</template>

<script lang="ts" setup name="SwitchTenants">
import { ref, reactive } from 'vue'
import { getTpmTenantList } from '@api/user'
import { onLoad } from '@dcloudio/uni-app'
import { useAppStore } from '@src/pinia/app'
const appStore = useAppStore()

interface TenantData {
  iconUrl: null | string
  tenantId: string
  tenantName: string
}
onLoad(() => {
  const currentTenant = uni.getStorageSync('currentTenant')
  selectedTenantName.value = currentTenant.tenantName
  selectedTenant.data.tenantId = currentTenant.tenantId
  toTpmTenantList()
})
let tenantList = reactive({
  data: [] as TenantData[]
})
/**
 * 当前租户名称
 */
let selectedTenantName = ref('')
/**
 * 获取多租户列表
 */
const toTpmTenantList = async () => {
  try {
    tenantList.data = (await getTpmTenantList()) as Array<TenantData>
  } catch {}
}
let selectedTenant = reactive({
  data: {} as TenantData
})
const toSelectedTenantFn = (tenant: TenantData) => {
  selectedTenant.data = tenant
}
const changeTenant = () => {
  /**
   * 切换租户需要清空token,将登陆状态置为false
   */
  uni.removeStorageSync('token')
  uni.setStorageSync('isLogin', false)
  appStore.setLoginStatus(false)
  !selectedTenant.data.tenantName &&
    tenantList.data.forEach((tenant) => {
      tenant.tenantId === selectedTenant.data.tenantId && (selectedTenant.data = tenant)
    })

  /**
   * 将当前租户的信息
   */
  uni.setStorageSync('currentTenant', selectedTenant.data)
  uni.navigateBack({
    delta: 1
  })
}
</script>

<style lang="scss" scoped>
.page-title {
  position: fixed;
  top: var(--window-top);
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 110rpx;
  color: #92969a;
  font-size: 28rpx;
  padding: 0 40rpx;
  border-top: 1rpx solid #e4e7ea;
  border-bottom: 1rpx solid #e4e7ea;
  background: #fff;

  .tenants-name {
    max-width: 389rpx;
    font-size: 30rpx;
    color: #292c2e;
    margin-left: 14rpx;
    font-weight: bolder;
  }
}

.tenants-list-box {
  padding: 150rpx 40rpx calc(120rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  .list-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 48%;
    height: 400rpx;
    background: #fff;
    box-shadow: 0 15rpx 33rpx 0 rgb(111 111 111 / 17%);
    border-radius: 2rpx;
    margin-bottom: 30rpx;
    padding: 0 28rpx;
    font-size: 26rpx;
    border: 2rpx solid transparent;

    .logo-box {
      width: 130rpx;
      height: 130rpx;
      border-radius: 50%;
      border: 1rpx solid rgb(146 150 154 / 75%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 60rpx;

      .tenant-logo {
        width: 89rpx;
        height: 89rpx;
      }
    }

    .tenant-name {
      color: #292c2e;
      font-size: 26rpx;
      margin-top: 40rpx;
    }
  }

  .selected-item {
    border-radius: 2rpx;
    border: 2rpx solid #1a1a1a;
  }
}

.footer-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-top: 1rpx solid #e4e7ea;
  padding: 18rpx 40rpx calc(18rpx + env(safe-area-inset-bottom));

  .btn {
    height: 84rpx;
    line-height: 84rpx;
    text-align: center;
    background: #1a1a1a;
    color: #fff;
    border-radius: 1rpx;
  }
}
</style>
