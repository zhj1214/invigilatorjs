<template>
  <view class="apply-for-after-sale-content">
    <view class="title">问题描述</view>
    <view class="problem-description">
      <!-- #ifdef MP-WEIXIN-->
      <textarea maxlength="300" class="description-text" placeholder-style="color:#a2a2a2" placeholder="请输入退货问题描述" :auto-height="true" @blur="getHandelValue" />
      <!-- #endif -->
      <!-- #ifdef H5-->
      <textarea maxlength="300" class="description-text" placeholder-style="color:#a2a2a2" placeholder="请输入退货问题描述" :auto-height="true" @input="getHandelValue" />
      <!-- #endif -->
      <view class="text-length">{{ desc.length }}/300</view>
    </view>
    <view v-if="afterSaleType.code === 1" class="upload-image-wrap">
      <view v-for="(item, index) in uploadImgList" :key="index" class="choose-img" @click="toChooseImg(index)">
        <image v-if="item.haveImg" class="remove" :src="afterSaleImgCloseIcon" mode="asceptFit" @click.stop="removeImg(index)" />
        <image v-if="item.haveImg" class="upload-image" mode="asceptFit" :src="item.imgPath" />
        <view v-if="!item.haveImg" class="add">
          <view class="img">
            <image class="upload-image" mode="asceptFit" :src="afterSaleCamreaIcon" />
          </view>
          <view class="text">上传凭证</view>
          <view class="text">(最多3张)</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="ProblemDescription">
import { inject } from 'vue'
import { setFileUpload } from '@src/api/after-sale'
import useFormData from './form-data'

const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
const [afterSaleImgCloseIcon, afterSaleCamreaIcon] = gdp(['icon-after-sale-img-close.png', 'icon-after-sale-camrea.png'])

const { afterSaleType, desc, uploadImgList, getHandelValue } = useFormData()

/**
 * @description: 上传图片
 * @Date: 2021-12-07 15:41:50
 * @param {*} index
 * @return {*}
 */
function toChooseImg(index: number) {
  uni.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 指定压缩图，默认二者都有
    // sourceType: ['album'], // 从相册选择
    success: async (res: AnyObject) => {
      uni.showLoading({
        title: '上传中'
      })
      let resSize = res.tempFiles[0].size
      let size = resSize / 1024 / 1024
      if (size > 20) {
        uni.showToast({
          title: '上传的图片大小不能大于20M',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return
      }
      const data = await setFileUpload({
        fileType: 'image',
        // #ifdef MP-WEIXIN
        filePath: res.tempFiles[0].path,
        // #endif
        name: 'file',
        // #ifdef H5
        file: res.tempFiles[0],
        // #endif
        hideLoading: true
      })
      uni.hideLoading()
      uploadImgList[index].haveImg = true
      uploadImgList[index].imgPath = data[0]
      if (uploadImgList.length < 3) {
        uploadImgList.push({
          haveImg: false,
          imgPath: ''
        })
      }
    }
  })
}

function removeImg(index: number) {
  if (index === 2) {
    uploadImgList.push({
      haveImg: false,
      imgPath: ''
    })
  }
  uploadImgList.splice(index, 1)
}
</script>

<style scoped lang="scss">
.apply-for-after-sale-content {
  margin-top: 125rpx;

  .title {
    font-size: 36rpx;
    font-family: SourceHanSansSC-Bold, SourceHanSansSC;
    font-weight: bold;
    color: #292c2e;
  }

  .problem-description {
    margin-top: 32rpx;
    position: relative;
    width: 100%;

    .description-text {
      padding: 40rpx 32rpx;
      font-size: 28rpx;
      min-height: 99rpx;
      background: #f8f9fa;
      width: auto;
    }

    .text-length {
      position: absolute;
      bottom: 10rpx;
      right: 40rpx;
      font-size: 28rpx;
      color: #d8d8d8;
      line-height: 41rpx;
      text-align: right;
    }
  }

  .upload-image-wrap {
    padding: 0 40rpx 49rpx;
    display: flex;
    background: #f8f9fa;

    .choose-img {
      width: 148rpx;
      height: 148rpx;
      margin-right: 30rpx;
      position: relative;

      .remove {
        position: absolute;
        top: -20rpx;
        right: -20rpx;
        width: 60rpx;
        height: 60rpx;
        z-index: 1;
      }

      > image.upload-image {
        width: 148rpx;
        height: 148rpx;
      }

      .add {
        width: 100%;
        height: 100%;
        border: 1px dashed #979797;

        .img {
          margin: 18rpx auto 0;
          width: 60rpx;
          height: 60rpx;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .text {
          text-align: center;
          font-size: 22rpx;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: #92969a;
          line-height: 26rpx;
        }
      }
    }
  }
}
</style>
