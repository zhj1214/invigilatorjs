<template>
  <view class="moveWrap" @touchmove.stop.prevent="toMoveHandle">
    <movable-area id="areaBox" ref="areaBox" class="movarea">
      <view class="img-box">
        <view v-for="(item, idx) in scopeImgList" :key="idx" class="img-item">
          <image
            :id="'img' + idx"
            :ref="'img' + idx"
            :src="item.url"
            mode="aspectFill"
            :class="hoverImgIdx === 'img' + idx ? 'select' : ''"
            @click="handleImagePreview(idx)"
            @touchstart="tstr(idx, $event)"
            @touchmove="tsmo"
            @touchend="toend"
          />
          <icon v-show="item.checkResults && item.checkResults !== 1" class="warn" type="warn" size="36" />
          <view v-if="item.url.includes('.gif')" class="gif">GIF</view>
          <!-- 删除对应图片按钮 -->
          <image v-if="enableDel" class="close-btn" :src="closeBtn" mode="asceptFit" @click="closeImg(idx)" />
        </view>
        <image v-if="scopeImgList.length < 9" mode="asceptFit" :src="getIconUpload" class="add-img-btn" @click="addImgBtn" />
      </view>
      <movable-view v-if="moveSrc" :animation="false" class="move-v" :x="x" :y="y" direction="all" @change="onChange">
        <image style="border-radius: 5rpx" :src="moveSrc" mode="aspectFill" />
      </movable-view>
    </movable-area>
  </view>
</template>

<script>
export default {
  inject: ['$gdp'],
  props: {
    // 图片列表
    imgList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 图片行数
    rowNum: {
      type: Number,
      default: function () {
        return 2
      }
    },
    // 是否开启可删除图片功能
    enableDel: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 原图列表
    oriList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 请求方法
    action: {
      type: Function
    }
  },
  data() {
    return {
      scopeImgList: this.imgList,
      areaBoxInfo: {},
      x: 0,
      y: 0,
      idx: 0,
      moveSrc: '',
      moveOriSrc: '',
      areaBoxTop: 0,
      hoverImgIdx: '',
      inBoxXY: {},
      scopeOriImgList: this.oriList
    }
  },
  computed: {
    getIconUpload() {
      return this.$gdp('icon-upload.png')
    },
    closeBtn() {
      return this.$gdp('close-btn.png')
    }
  },
  watch: {
    // eslint-disable-next-line supaur/valid-func-name
    imgList(e) {
      this.scopeImgList = e
      this.$nextTick(function () {
        this.getDomInfoFun()
      })
    },
    // eslint-disable-next-line supaur/valid-func-name
    oriList(e) {
      this.scopeOriImgList = e
    }
  },
  mounted() {
    this.getDomInfoFun()
  },
  methods: {
    getDomInfoFun() {
      this.getDomInfo('areaBox', (info) => {
        this.areaBoxInfo = info
        // 设置区域内所有图片的左上角坐标
        this.scopeImgList.forEach((item, idx) => {
          this.getDomInfo('img' + idx, (res) => {
            item.x = res.left - info.left
            item.y = res.top - info.top
          })
        })
      })
    },
    toMoveHandle() {
      /* eslint-disable */
      return
    },
    onChange(e) {
      // console.log(e.detail)
    },
    tstr(e, s) {
      // const _this = this
      // 获取拖拽区域的上边距和下边距
      let areaBoxTop = this.areaBoxInfo.top
      let areaBoxLeft = this.areaBoxInfo.left
      // console.log(this.areaBoxInfo)

      // 设置可移动方块的初始位置为当前所选中图片的位置坐标
      this.x = this.scopeImgList[e].x
      this.y = this.scopeImgList[e].y
      // 显示可移动方块
      this.moveSrc = this.scopeImgList[e].url
      this.moveOriSrc = this.scopeOriImgList[e].url // 原图
      // 保存当前所选择的图片索引
      this.idx = e
      var x = s.changedTouches[0].clientX - areaBoxLeft
      var y = s.changedTouches[0].clientY - areaBoxTop
      // 保存鼠标在图片内的坐标
      this.inBoxXY = {
        x: x - this.scopeImgList[e].x,
        y: y - this.scopeImgList[e].y
      }
    },
    tsmo(e) {
      const _this = this
      let areaBoxTop = this.areaBoxInfo.top
      let areaBoxLeft = this.areaBoxInfo.left
      let imgSize = 196
      // 重置为以拖拽盒子左上角为坐标原点
      var x = e.changedTouches[0].clientX - areaBoxLeft
      var y = e.changedTouches[0].clientY - areaBoxTop
      this.x = x - this.inBoxXY.x
      this.y = y - this.inBoxXY.y
      this.scopeImgList.forEach((item, idx) => {
        if (x > item.x && x < item.x + imgSize && y > item.y && y < item.y + imgSize) {
          _this.hoverImgIdx = 'img' + idx
        }
      })
    },
    toend(e) {
      const _this = this
      // 移动结束隐藏可移动方块
      let beforeIdx = _this.idx
      let afterIdx = parseInt(_this.hoverImgIdx.split('img')[1])
      if (_this.hoverImgIdx !== '' && beforeIdx !== afterIdx) {
        _this.scopeImgList[beforeIdx].url = _this.scopeImgList[afterIdx].url
        _this.scopeImgList[afterIdx].url = _this.moveSrc
        _this.scopeOriImgList[beforeIdx].url = _this.scopeOriImgList[afterIdx].url
        _this.scopeOriImgList[afterIdx].url = _this.moveOriSrc
        // this.$emit('moveEndList', this.scopeImgList, this.scopeOriImgList)
      }
      this.moveSrc = ''
      this.hoverImgIdx = ''
    },
    addImgBtn() {
      this.$emit('addImg')
    },
    closeImg(e) {
      this.$emit('delImg', e)
    },
    getDomInfo(id, callBack) {
      const query = uni.createSelectorQuery().in(this)
      // console.log(query)
      query
        .select('#' + id)
        .boundingClientRect()
        .exec(function (res) {
          callBack(res[0])
        })
    },
    handleImagePreview(index) {
      const list = []
      this.oriList
        .filter((item) => item.url)
        .map((el) => {
          list.push(el.url)
        })
      uni.previewImage({
        current: index,
        urls: list
      })
    }
  }
  // mounted() {
  //   let _this = this
  //   this.getDomInfo('areaBox', info => {
  //     _this.areaBoxInfo = info
  //     // 设置区域内所有图片的左上角坐标
  //     _this.scopeImgList.forEach((item, idx) => {
  //       _this.getDomInfo('img' + idx, res => {
  //         item.x = res.left - info.left
  //       })
  //       _this.getDomInfo('img' + idx, res => {
  //         item.y = res.top - info.top
  //       })
  //     })
  //   })
  // }
}
</script>

<style lang="scss" scoped>
uni-view,
uni-image,
uni-text {
  flex-shrink: 1;
}

.movarea {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
}

.img-box {
  width: 100%;
  height: auto;
  display: flex;
  flex-flow: row wrap;

  .img-item {
    position: relative;
    box-sizing: border-box;
    border-radius: 5rpx;

    image {
      width: 196rpx;
      height: 196rpx;
      transition: all 0.2s;
      vertical-align: top;
      margin: 0 10rpx 20rpx 0;
      border-radius: 5rpx;
    }

    .warn {
      position: absolute;
      top: 70rpx;
      right: 70rpx;
      color: #f04440;
      opacity: 0.9;
    }

    .close-btn {
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      top: 8rpx;
      right: 8rpx;
    }

    .gif {
      width: 80rpx;
      height: 44rpx;
      background: #292c2e;
      border-radius: 22rpx;
      opacity: 0.8;
      position: absolute;
      right: 20rpx;
      bottom: 30rpx;
      color: #fff;
      text-align: center;
      line-height: 44rpx;
    }
  }

  .add-img-btn {
    width: 196rpx;
    height: 196rpx;
  }
}

.move-v {
  width: 196rpx;
  height: 196rpx;
  opacity: 0.6;
  z-index: 999;
  box-sizing: border-box;
  padding: 11rpx;

  image {
    width: 100%;
    height: 100%;
  }
}

.select {
  opacity: 0;
}
</style>
