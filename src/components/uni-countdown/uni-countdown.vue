<template>
  <view :class="['uni-countdown', specialStyle ? 'specialStyle' : '']">
    <text
      v-if="isShowDay"
      :style="{ borderColor: borderColor, color: color, backgroundColor: backgroundColor }"
      class="uni-countdown__number"
      :class="['uni-countdown__number', specialStyle ? 'uni-countdown__number_special' : '']"
      >{{ d }}</text
    >
    <text
      v-if="isShowDay"
      :style="{ color: splitorColor }"
      :class="['uni-countdown__splitor', specialStyle ? 'uni-countdown__splitor_special' : '']"
      class=""
      >天</text
    >
    <template v-if="showHour">
      <text
        :style="{ borderColor: borderColor, color: color, backgroundColor: backgroundColor }"
        class="uni-countdown__number widthStyle"
        :class="{ 'margin-left': !isShowDay }"
        >{{ h }}</text
      >

      <text :style="{ color: splitorColor }" class="uni-countdown__splitor">{{ showColon ? ':' : '时' }}</text>
    </template>
    <text :style="{ borderColor: borderColor, color: color, backgroundColor: backgroundColor }" class="uni-countdown__number widthStyle">{{
      i
    }}</text>

    <text :style="{ color: splitorColor }" class="uni-countdown__splitor">{{ showColon ? ':' : '分' }}</text>
    <text :style="{ borderColor: borderColor, color: color, backgroundColor: backgroundColor }" class="uni-countdown__number widthStyle">{{
      s
    }}</text>
    <text v-if="!showColon" :style="{ color: splitorColor }" class="uni-countdown__splitor">秒</text>
  </view>
</template>
<script>
export default {
  name: 'UniCountdown',
  props: {
    showDay: {
      type: Boolean,
      default: true
    },
    showHour: {
      type: Boolean,
      default: true
    },
    showColon: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    borderColor: {
      type: String,
      default: '#000000'
    },
    color: {
      type: String,
      default: '#000000'
    },
    splitorColor: {
      type: String,
      default: '#000000'
    },
    day: {
      type: Number,
      default: 0
    },
    hour: {
      type: Number,
      default: 0
    },
    minute: {
      type: Number,
      default: 0
    },
    second: {
      type: Number,
      default: 0
    },
    secondsVal: {
      type: Number,
      default: 0
    },
    specialStyle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timer: null,
      syncFlag: false,
      d: '00',
      h: '00',
      i: '00',
      s: '00',
      leftTime: 0,
      isShowDay: this.showDay,
      seconds: this.secondsVal
    }
  },
  watch: {
    day(val) {
      this.changeFlag()
    },
    hour(val) {
      this.changeFlag()
    },
    minute(val) {
      this.changeFlag()
    },
    second(val) {
      this.changeFlag()
    }
  },
  created: function (e) {
    this.startData()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    toSeconds(day, hours, minutes, seconds) {
      return day * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds
    },
    timeUp() {
      clearInterval(this.timer)
      this.timer = null
      this.$emit('timeup')
    },
    countDown() {
      let seconds = this.seconds
      let [day, hour, minute, second] = [0, 0, 0, 0]
      if (seconds > 0) {
        day = Math.floor(seconds / (60 * 60 * 24))
        hour = Math.floor(seconds / (60 * 60)) - day * 24
        minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60
        second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60
      } else {
        this.timeUp()
      }
      // if (day < 10) {
      //   day = '0' + day
      // }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second
      }
      this.d = day
      this.h = hour
      this.i = minute
      this.s = second
      this.isShowDay = this.d ? true : false
    },
    startData() {
      !this.secondsVal && (this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second))
      if (this.seconds <= 0) {
        return
      }
      this.countDown()
      if (this.timer !== null) {
        return
      }
      this.timer = setInterval(() => {
        this.seconds--
        if (this.seconds < 0) {
          this.syncFlag = false
          this.timeUp()
          return
        }
        this.countDown()
      }, 1000)
    },
    changeFlag() {
      if (!this.syncFlag) {
        this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second)
        this.startData()
        this.syncFlag = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/uni.scss';
$countdown-height: 48rpx;
$countdown-width: auto;

.uni-countdown {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: flex-start;
  padding: 2rpx 0;
}

.uni-countdown__splitor {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  line-height: $countdown-height;
  // padding: 5rpx;
}

.uni-countdown__number {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  width: $countdown-width;
  height: $countdown-height;
  line-height: $countdown-height;
  text-align: center;
}
.margin-left {
  margin-left: 12rpx;
}
.specialStyle {
  justify-content: flex-end;
  .uni-countdown__splitor {
    padding: 0 12rpx;
  }
  .widthStyle {
    width: 44rpx;
  }
  .uni-countdown__number {
    border-radius: 2rpx;
  }
  .uni-countdown__number_special,
  .uni-countdown__splitor_special {
    color: #fff !important;
    background: transparent !important;
    font-size: 30rpx;
  }
  .uni-countdown__number_special {
    font-size: 28rpx;
    padding: 0 12rpx;
  }
  .uni-countdown__splitor_special {
    font-size: 22rpx;
    padding-left: 0;
  }
}
</style>
