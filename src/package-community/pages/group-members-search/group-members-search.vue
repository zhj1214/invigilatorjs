<template>
  <view class="page-search">
    <view class="search-bar">
      <input v-model="keyword" type="text" placeholder="输入好友名字" placeholder-style="color:#D8D8D8;fontSize:30rpx" @confirm="getGroupMember" @focus="onFocus" />
    </view>

    <scroll-view v-if="userListData.length" class="scroll" scroll-y @scrolltolower="onScrolltolower">
      <user-list :list="userListData" />
      <view v-if="userListData.length && isEnd" class="list-no-more">-没有更多内容了哦-</view>
    </scroll-view>

    <view v-if="noResult" class="no-result">
      <image :src="searchIcon" />
      <view class="result">未找到“{{ keyword }}”的相关结果</view>
      <view class="tip">您可以换个关键词试试，或随便逛一逛</view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, inject } from 'vue'
import { getMemberList } from '@api/community'
import userList from '../../components/user-list/user-list.vue'

let groupId = ref('')

export default defineComponent({
  name: 'GroupMemberSearch',
  components: { userList },
  setup() {
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [searchIcon] = gdp(['group-search.png'])

    let keyword = ref('')
    let noResult = ref(false)
    function onFocus() {
      noResult.value = false
    }

    /**
     * 查询成员
     */
    let pageNo = ref(1)
    let isEnd = ref(false)
    let userListData: Array<GroupMemberInfo> = reactive([])
    async function getGroupMember() {
      const { data, total } = (await getMemberList(groupId.value, { orderBy: 1, pageNo: pageNo.value, accountName: keyword.value })) as AnyObject
      pageNo.value === 1 && userListData.splice(0)
      userListData.push(...data)
      isEnd.value = userListData.length === total
      noResult.value = !data.length && !userListData.length
    }
    async function onScrolltolower() {
      if (!isEnd.value) {
        pageNo.value++
        getGroupMember()
      }
    }

    return {
      keyword,
      searchIcon,
      userListData,
      isEnd,
      noResult,
      onFocus,
      getGroupMember,
      onScrolltolower
    }
  },
  onLoad(option: { groupId: string }) {
    groupId.value = option.groupId
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
