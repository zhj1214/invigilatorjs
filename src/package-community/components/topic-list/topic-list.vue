<template>
  <view class="topic-list">
    <view v-for="(item, key) in list" :key="key" class="topic-item" @click="toTopicHome(item.id)">
      <image :src="item.logoUrl" mode="" class="topic-logo" />
      <view class="info">
        <view class="topic-name"># {{ item.topicName }} #</view>
        <view class="topic-sub">
          <text class="text">{{ item.contentCount }}篇内容</text>
          <!-- <text  class="text">{{ item.peopleJoinCount }}人参与</text> -->
        </view>
      </view>
      <view v-if="btnText" class="follow-btn font-normal" @click.stop="$emit('btn-click', item)">{{ btnText }}</view>
    </view>
    <view v-if="list.length && isEnd" class="list-no-more">-没有更多内容了哦-</view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'TopicList',
  props: {
    list: {
      type: Array as PropType<Array<AnyObject>>,
      default: () => []
    },
    isEnd: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: ''
    }
  },
  emits: ['btn-click'],
  setup() {
    /**
     * 跳转话题首页
     */
    const toTopicHome = (id: string) => {
      uni.navigateTo({
        url: `/package-community/pages/topic-home/topic-home?id=${id}`
      })
    }

    return {
      toTopicHome
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
