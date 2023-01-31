<template>
  <view class="medal">
    <view class="medal-header">
      <page-header :is-transparent="isTransparent" :title="ifCurUser ? '我的徽章' : 'Ta的徽章'" :icon-right="medalRightIcon" @back="toBackTo" />
      <view class="medal-header-bg"><image class="bg-img" :src="bgMedal" mode="aspectFill" /></view>
      <view class="medal-header-content">
        <image class="img" :src="(ifCurUser ? userInfo.avatarUrl : userOtherInfo.avatarUrl) || userPortraitImg" />
        <view class="user">
          <view class="name">{{ ifCurUser ? userInfo.displayName : userOtherInfo.displayName }}</view>
        </view>
      </view>
    </view>
    <view class="medal-content">
      <view v-for="(item, index) in medalList" :key="index" class="medal-content-item">
        <view class="medal-content-item-name">{{ item.categoryName }}</view>
        <view v-if="item.medalList" class="medal-content-item-medalList">
          <view v-for="(medal, index) in item.medalList" :key="index" class="medal-item" @click="openDialog(medal)">
            <image :src="medal.medalIconUrl" :class="!medal.ifLightUp ? 'gray' : ''" />
            <view class="name ellipsis">{{ medal.medalName }}</view>
          </view>
        </view>
      </view>
    </view>
    <medal-dialog ref="medalDetail" :medal-id="medalId" :if-light-up="ifLightUp" :account-id="accountId || userInfo.accountId" :if-cur-user="ifCurUser" />
  </view>
</template>

<script setup lang="ts">
import { inject, ref, reactive, Ref } from 'vue'
import { onPageScroll, onLoad } from '@dcloudio/uni-app'
import { getVipUser, getSystemId } from '@api/user'
import { pureAssign } from '@util/common'
import { getCategoryMedalWall, toFindUserMedal, getUserDetail } from '@src/api/community'
import medalDialog from './medal-dialog.vue'
import pageHeader from '../../components/page-header/page-header.vue'
import { useUserStore } from '@src/pinia/user'

const userStore = useUserStore()

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [bgMedal, medalRightIcon, userPortraitImg] = gdp(['bg-medal.png', 'icon-medal-right.png', 'icon-default-avatar.png'])

// 没有滚动到下方时，page-header透明
let isTransparent = ref(true)
onPageScroll((e: { scrollTop: number }) => {
  isTransparent.value = e.scrollTop < 100
})

let accountId = ref('')
let ifCurUser = ref(true)
onLoad((option) => {
  if (option.accountId) {
    accountId.value = option.accountId
    ifCurUser.value = option.ifCurUser === 'true'
    getOtherUserInfo()
  }
  console.log(ifCurUser.value)
  getUserInfo()
})

/**
 * 返回
 */
// 暂时简单处理
function toBackTo() {
  uni.navigateBack({
    delta: 1
  })
}
// 用户信息
const userInfo: User.Info = reactive({
  mobile: '',
  id: '',
  accountId: '',
  displayName: '',
  avatarUrl: '',
  level: undefined,
  levelName: '',
  percent: 0,
  coverImg: '',
  growth: undefined,
  nextGrowth: undefined,
  point: 0,
  follow: false,
  order: undefined
})
const systemId = ref('')
/**
 * 获取用户信息、会员信息
 */
const getUserInfo = async () => {
  try {
    let obj = {}
    // 获取用户信息
    userStore.$reset()
    const user = await userStore.getUserInfo()
    // 获取用户会员id
    const { memberSystemId } = await getSystemId()
    systemId.value = memberSystemId
    // 获取用户会员信息
    const vipInfo = (await getVipUser(user.accountId, memberSystemId)) as AnyObject
    obj = { ...user, ...vipInfo }
    pureAssign(userInfo, obj)
    medalList.splice(0)
    getMedal()
  } catch {}
}

let userOtherInfo = reactive({ ...userInfo })
const getOtherUserInfo = async () => {
  try {
    const res = (await getUserDetail(accountId.value)) as AnyObject
    pureAssign(userOtherInfo, res)
  } catch (error) {}
}

let medalList: MedalListInfo[] = reactive([])
async function getMedal() {
  try {
    let arr: any = []
    const data = ifCurUser.value
      ? ((await getCategoryMedalWall({ accountId: accountId.value || userInfo.accountId })) as AnyObject)
      : ((await toFindUserMedal({ accountId: accountId.value })) as AnyObject)
    arr = data.parentCategoryList.filter((item: AnyObject) => item.medalList)
    medalList.push(...arr)
  } catch (error) {}
}

const medalDetail: Ref<SpPopup | null> = ref(null)
let medalId = ref('')
let ifLightUp = ref(false)
function openDialog(item: MedalInfo) {
  medalId.value = item.id
  ifLightUp.value = item.ifLightUp
  medalDetail.value?.open()
}
</script>

<style scoped lang="scss">
.medal {
  background: #31383c 100% 100%;
  min-height: 100vh;

  &-header {
    height: 489rpx;
    position: relative;

    &-bg {
      width: 100%;
      height: 100%;

      .bg-img {
        width: 100%;
        height: 100%;
      }
    }

    &-content {
      position: absolute;

      /* #ifdef MP-WEIXIN */
      top: 40%;
      /* #endif */

      /* #ifdef H5 */
      top: 30%;
      /* #endif */
      left: 40rpx;
      display: flex;
      align-items: center;

      .img {
        width: 128rpx;
        height: 128rpx;
        border: 2rpx solid #edeff1;
        border-radius: 50%;
      }

      .user {
        margin-left: 33rpx;

        .name {
          font-size: 40rpx;
          font-family: SourceHanSansSC-Bold, SourceHanSansSC;
          font-weight: bold;
          color: #fff;
        }

        .member-level {
          margin-top: 20rpx;
          font-size: 24rpx;
          padding: 2rpx 6rpx;
          color: #fff;
          border-radius: 3px;
          margin-right: 16rpx;

          .level {
            font-size: 12rpx;
          }

          .level-name {
            margin-left: 8rpx;
          }
        }
      }
    }
  }

  &-content {
    position: relative;

    /* #ifdef MP-WEIXIN */
    top: -100rpx;
    /* #endif */

    /* #ifdef H5 */
    top: -120rpx;
    /* #endif */
    padding: 0 40rpx;

    &-item {
      background: #292f34;
      border-radius: 8rpx 8rpx 0 0rpx;
      margin-bottom: 36rpx;

      &-name {
        font-size: 32rpx;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        color: #fff;
        padding: 22rpx 0 22rpx 27rpx;
      }

      &-medalList {
        padding: 0 37rpx 37rpx;
        background: #3a4347;
        border-radius: 0 0 8rpx 8rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .medal-item {
          margin-top: 26rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 28%;

          // margin-right: 3.3%;
          image {
            width: 160rpx;
            height: 160rpx;
          }

          .gray {
            filter: grayscale(100%);
            filter: gray;
          }

          .name {
            margin-top: 15rpx;
            font-size: 28rpx;
            font-family: SourceHanSansSC-Normal, SourceHanSansSC;
            color: #ccc;
            width: 160rpx;
            text-align: center;
          }
        }

        .medal-item:nth-child(3n) {
          margin-right: 0;
        }
      }

      &-medalList::after {
        content: '';

        // flex: auto;
        width: 28%;
      }
    }
  }
}
</style>
