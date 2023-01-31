import { defineStore } from 'pinia'
import { getConfig } from '@api/config'

type ConfigResolveFn = (value: ConfigInfo | PromiseLike<ConfigInfo>) => void

interface ConfigInfo {
  [key: string]: string | AnyObject
  amap: MapConfig
  deaultTanent: {
    tenantId: string
    tenantName: string
  }
}

let isConfigLoading = false
const configPromiseArray: ConfigResolveFn[] = []

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      feConfig: {} as ConfigInfo
    }
  },
  actions: {
    async getFeConfig(): Promise<ConfigInfo> {
      return new Promise(async (resolve) => {
        // 获取当前租户的域名数据
        const domainKey = uni.getStorageSync('currentTenant').tenantId as string
        if (this.feConfig[domainKey] && Object.keys(this.feConfig[domainKey]).length) {
          resolve(this.feConfig)
          return
        }
        if (isConfigLoading) {
          configPromiseArray.push(resolve)
        } else {
          isConfigLoading = true
          const config = (await getConfig()) as ConfigInfo
          Object.assign(this.feConfig, config as ConfigInfo)
          resolve(this.feConfig)
          configPromiseArray.forEach((resolveFn) => {
            resolveFn(this.feConfig)
          })
          isConfigLoading = false
        }
      })
    }
  }
})
