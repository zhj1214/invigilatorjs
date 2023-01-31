<template>
  <uni-popup ref="textDrivePopup" type="bottom" @change="changePopupStatus">
    <view class="full-screen-mask">
      <view class="pop-header">
        <view class="tab">
          <view v-for="(item, index) in tabList" :key="index" class="text" :class="activeTab === item.value ? 'active' : ''" @click="toTabChange(item.value)">
            {{ item.name }}
            <view v-if="activeTab === item.value" class="line" />
          </view>
        </view>
        <image class="icon-x" mode="aspectFit" :src="iconClose" @click="closePopup" />
      </view>
      <view class="content">
        <template v-if="dataList.length">
          <view v-for="(item, idx) in dataList" :key="idx" class="item" @click="toSelectCarSerise(item)">
            <view class="car-serise">
              <image :src="item.image" class="img" mode="aspectFit" />
              <view class="name">{{ item.name }}</view>
            </view>
            <view class="icon">
              <image v-if="getIsShowImgFlag(item)" class="icon-img" mode="aspectFit" :src="iconRadioChecked" />
            </view>
          </view>
        </template>
        <view v-else>
          <view class="no-data">请先选择预约车系</view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup name="choiceCarSerise">
import { onMounted, inject, getCurrentInstance, ref, reactive, computed } from 'vue'
import { getSerial } from '@api/car'

const emit = defineEmits(['carInfoName'])
onMounted(() => {
  getSerialData()
})
const dataList = computed(() => {
  return activeTab.value === 1 ? carSeriesData : carModelData
})
const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string | string[]>
// 页面主图片
const [iconClose, iconRadioChecked] = gdp(['icon-close.png', 'icon-radio-checked.png'])
const instance = getCurrentInstance()
const activeTab = ref(1)
// 车系数据
let carSeriesData: Car.CarInfo[] = reactive([])
// 车型数据
let carModelData: Car.CarInfo[] = reactive([])
// 选中的车型车系数据
let checkedCarInfo = reactive({
  carSeriseId: '',
  carSeriseName: '',
  carModelId: '',
  carModelName: '',
  code: ''
})
// 获取车系车型数据
async function getSerialData() {
  try {
    let resData = (await getSerial()) as Array<Car.CarInfo>
    resData.map((item: Car.CarInfo) => {
      item.id = String(item.id)
      item.image = JSON.parse(item.image)[0].path
      carSeriesData.push(item)
      item.vehicles &&
        item.vehicles.map((val: Car.Model) => {
          val.image = JSON.parse(val.image)[0].path
        })
      return item
    })
  } catch {
    console.log('getSerial接口调用失败')
  }
}
function toSelectCarSerise(item: Car.CarInfo) {
  const { id, name, code } = item
  if (activeTab.value === 1) {
    checkedCarInfo.carSeriseId = id
    checkedCarInfo.carSeriseName = name

    activeTab.value = 2
  } else {
    checkedCarInfo.carModelId = id
    checkedCarInfo.carModelName = name
    checkedCarInfo.code = code
    closePopup()
  }
  // 给车型赋值
  item.vehicles && (carModelData = item.vehicles)
}
// 切换tab
function toTabChange(value: number) {
  activeTab.value = value
}
function getIsShowImgFlag(item: Car.CarInfo) {
  if (!checkedCarInfo.carSeriseId && !checkedCarInfo.carModelId) {
    return false
  }
  // 是否显示选中按钮的标识
  return activeTab.value === 1 ? checkedCarInfo.carSeriseId === item.id : checkedCarInfo.carModelId === item.id
}
function changePopupStatus(e: { show: boolean }) {
  if (e.show) {
    return
  }
  // 弹框关闭做数据处理
  if (checkedCarInfo.carSeriseId && checkedCarInfo.carModelId) {
    emit('carInfoName', checkedCarInfo)
  }
}
// 打开弹窗
function openPopup() {
  const textDrivePopup = instance?.refs.textDrivePopup as { open: () => void }
  textDrivePopup.open()
}
// 关闭弹窗
function closePopup() {
  const textDrivePopup = instance?.refs.textDrivePopup as { close: () => void }
  textDrivePopup.close()
}
const tabList = reactive([
  { name: '车系', value: 1 },
  { name: '车型', value: 2 }
])
defineExpose({
  openPopup,
  closePopup
})
</script>

<style lang="scss" scoped>
.full-screen-mask {
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  background-color: #fff;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));

  .pop-header {
    height: 121rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40rpx;

    .tab {
      .text {
        display: inline-block;
        margin-right: 56rpx;
        color: #92969a;
        font-size: 30rpx;
        font-weight: 500;
        position: relative;

        &.active {
          font-size: 36rpx;
          color: #292c2e;
          font-weight: bold;
        }

        .line {
          display: inline-block;
          width: 55%;
          height: 3px;
          background: #292c2e;
          border-radius: 5px;
          position: absolute;
          bottom: -10rpx;
          left: 20%;
        }
      }
    }

    .icon-x {
      width: 48rpx;
      height: 48rpx;
    }
  }

  .content {
    height: 893rpx;
    overflow-y: scroll;
    padding: 0 40rpx;

    .item {
      padding: 45rpx 0;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1rpx solid #e5e5e5;

      .car-serise {
        width: calc(100% - 48rpx);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .img {
          width: 240rpx;
          height: 134rpx;
        }

        .name {
          width: 50%;
          font-size: 36rpx;
          color: #292c2e;
          display: inline-block;
        }
      }

      .icon {
        .icon-img {
          width: 48rpx;
          height: 48rpx;
        }
      }
    }

    .no-data {
      font-size: 26rpx;
      font-weight: 400;
      color: #909ca8;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
  }
}
</style>
