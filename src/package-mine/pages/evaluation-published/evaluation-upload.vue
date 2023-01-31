<template>
  <div>
    <view class="evaluation-upload">
      <uni-file-picker-clone
        ref="filePicker"
        v-model="imageValue"
        file-mediatype="image"
        mode="grid"
        file-extname="png,jpg,jpeg,mov,mp4"
        @progress="getProgress"
        @success="success"
        @fail="fail"
        @select="getSelect"
        @delete="handleUploadDel"
      />
    </view>
  </div>
</template>

<script lang="ts" setup name="EvaluationUpload">
import { reactive, getCurrentInstance } from 'vue'
import { useOssStore } from '@src/pinia/oss'
import { toFileUpload } from '@api/evaluation'
import UniFilePickerClone from '@src/components/uni-file-picker/uni-file-picker.vue'

const emit = defineEmits(['getVideoValue', 'getImgUrls'])

const ossStore = useOssStore()

let imageValue = reactive([])
let tempFilesReturn = [] as Array<string>
let imgUrls = [] as Array<string | unknown>
const instance = getCurrentInstance()

// 获取上传状态
async function getSelect(e: { tempFiles: Array<{ fileType: string; size: number; name: string }>; tempFilePaths: Array<string> }) {
  const { tempFiles, tempFilePaths } = e
  const { fileType } = tempFiles[0]
  if (fileType === 'video') {
    let size = tempFiles[0].size / 1024 / 1024
    if (size > 100) {
      uni.showToast({ title: '上传的视频大小不能超过100M', icon: 'none', duration: 2000, mask: true })
    } else {
      let videoUrl
      // #ifdef MP-WEIXIN
      uni.showLoading({ title: '视频上传中···' })
      videoUrl = await ossStore.uploadFileToOSS(tempFiles[0], tempFilePaths[0])
      // #endif
      // #ifdef H5
      uni.showLoading({ title: '文件上传中···' })
      videoUrl = await ossStore.uploadFileToOSSH5(tempFiles[0], tempFilePaths[0])
      // #endif
      uni.hideLoading()
      emit('getVideoValue', videoUrl)
    }
  } else {
    tempFiles.forEach((item, index) => {
      let size = item.size / 1024 / 1024
      if (size > 20) {
        uni.showToast({ title: '上传的图片大于20M的已自动为您删除', icon: 'none', duration: 2000, mask: true })
        tempFilePaths.splice(index, 1)
        const filePicker = instance?.refs.filePicker as { autoDelFile: (arg0: { fileType: string; size: number; name: string }) => void }
        filePicker.autoDelFile(item)
      }
    })
    // 图片上传
    tempFilesReturn = [...tempFilesReturn, ...tempFilePaths]
    uploadImages(tempFilePaths, tempFiles)
  }
}
async function uploadImages(tempFilePaths: Array<any>, tempFiles: any) {
  const filePaths = tempFilePaths
  let arr = []
  let map = {} as AnyObject
  for (let i = 0; i < filePaths.length; i++) {
    map[i] = await toFileUpload({
      fileType: 'image',
      filePath: filePaths[i],
      name: 'file',
      hideLoading: true
    })
  }
  for (let key in map) {
    if (map.hasOwnProperty(key)) {
      arr.push(map[key])
    }
  }
  imgUrls = [...imgUrls, ...arr]
  emit('getImgUrls', imgUrls)
}
function handleUploadDel(e: { tempFile: { fileType: string }; tempFilePath: string }) {
  if (e.tempFile.fileType === 'video') {
    emit('getVideoValue', '')
    // #ifdef MP-WEIXIN
    ossStore.uploadTask.abort()
    // #endif
  }
  const { tempFilePath } = e
  let index = tempFilesReturn.findIndex((item) => item === tempFilePath)
  tempFilesReturn.splice(index, 1)
  e.tempFile.fileType === 'image' && imgUrls.splice(index, 1)
  emit('getImgUrls', imgUrls)
}
// 获取上传进度

function getProgress(e: unknown) {
  // eslint-disable-next-line no-console
  console.log('上传进度：', e)
}
// 上传成功

function success(e: unknown) {
  // eslint-disable-next-line no-console
  console.log('上传成功', e)
}
// 上传失败

function fail(e: unknown) {
  // eslint-disable-next-line no-console
  console.log('上传失败：', e)
}
</script>

<style scoped lang="scss">
.evaluation-upload {
  margin-top: 40rpx;
}
</style>
