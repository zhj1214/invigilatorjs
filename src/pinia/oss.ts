import { getOSSSTS, getOSSSTSH5 } from '@api/evaluation'
import { co } from '@src/lib/co'
import { formatDate } from '@src/util/date-time'
import { getRandomString, getFileType } from '@src/util/common'
import { defineStore } from 'pinia'

// 弹窗提示
function toShowToastFun(str: string) {
  str && uni.showToast({ title: str, icon: 'none', duration: 1200 })
}

export const useOssStore = defineStore({
  id: 'oss',
  state: () => {
    return {
      uploadTask: {} as UniNamespace.UploadTask
    }
  },
  actions: {
    uploadTaskFun(res: AnyObject, filePaths: string, filePath: string) {
      return uni.uploadFile({
        url: `https://${res.bucket}.${res.endpoint}`, // 上传到OSS
        filePath: filePaths,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          host: `https://${res.bucket}.${res.endpoint}`,
          name: filePath,
          key: 'evaluation/' + filePath,
          OSSAccessKeyId: res.accessId,
          policy: res.policy,
          Signature: res.signature,
          success_action_status: '200'
        },
        success: (result) => {
          if (result.statusCode === 200) {
            toShowToastFun('')
          } else {
            toShowToastFun('视频上传失败！')
          }
        },
        fail: (err) => {
          if (err.errMsg !== 'uploadFile:fail abort') {
            toShowToastFun('视频上传失败！')
          } else {
            uni.hideLoading()
          }
        }
      })
    },
    async uploadFileToOSS(file: { name: string }, filePaths: string) {
      const res = (await getOSSSTS()) as AnyObject
      const fileType = `${getFileType(file.name)}` // 截
      const randomName = `${getRandomString(18)}`
      const curDate = `${formatDate(new Date().getTime(), 'YYYYMMDD')}`
      const curTime = `${formatDate(new Date().getTime(), 'YYYYMMDDHHmmss')}`
      const filePath = `${curDate}/${randomName}${curTime}.${fileType}`
      const vedioUrl = `https://${res.bucket}.${res.endpoint}/evaluation/${filePath}`
      return new Promise((resolve, reject) => {
        this.uploadTask = this.uploadTaskFun(res, filePaths, filePath)
        resolve(vedioUrl)
      })
    },
    async uploadFileToOSSH5(file: { name: string }, filePaths: string) {
      const res = (await getOSSSTSH5()) as AnyObject
      const clientOSS = OSS
      // if (process.env.NODE_ENV === 'production') {
      //   clientOSS = OSS.default
      // }
      const client = new clientOSS({
        region: res.region,
        accessKeyId: res.accessId,
        accessKeySecret: res.accessKey,
        stsToken: res.securityToken,
        bucket: res.bucket
      })
      const fileType = `${getFileType(file.name)}` // 截
      const randomName = `${getRandomString(18)}`
      const curDate = `${formatDate(new Date().getTime(), 'YYYYMMDD')}`
      const curTime = `${formatDate(new Date().getTime(), 'YYYYMMDDHHmmss')}`
      const filePath = curDate + '/' + randomName + curTime + '.' + fileType
      const blob = (await this.toBlobURL2File(filePaths)) as BlobPart

      const fileOSS = new window.File([blob], randomName, { type: fileType })
      // 获取当前网络协议
      // let protocol = process.env.NODE_ENV === 'development' ? 'https:' : location.protocol
      return new Promise((resolve, reject) => {
        co(function* (): any {
          const result = yield client.multipartUpload(filePath, fileOSS)
          resolve(`https://${res.bucket}.${res.endpoint}/${result.name}`)
        }).catch(function (err) {
          reject(err)
        })
      })
    },
    toBlobURL2File(blodurl: string) {
      return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest()
        http.open('GET', blodurl, true)
        http.responseType = 'blob'
        http.onload = function (e) {
          if (this.status == 200 || this.status === 0) {
            // console.log('blod数据',this.response);
            // 在将blod数据转为file
            // let files = new window.File([this.response], 'file.name', { type: 'image' })
            // console.log('blod数据转换file',files);
            resolve(this.response)
          }
        }
        http.send()
      })
    }
  }
})
