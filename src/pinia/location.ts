import { defineStore } from 'pinia'
import { useConfigStore } from './config'
// #ifdef MP-WEIXIN
import QQMapWX from '@src/lib/qqmap-wx-jssdk'
// #endif
// #ifdef H5
import { toLoadMapsScript } from '@src/util/map'
// #endif

interface Location {
  latitude: number
  longitude: number
}

interface LocationCity {
  province: string
  city: string
  district: string
  cityCode: string
}

/**
 * 位置定位
 */
export const useLocationStore = defineStore({
  id: 'location',
  state: () => {
    return {
      longitude: 120.153576,
      latitude: 30.287459,
      cityInfo: {
        province: '',
        city: '',
        cityCode: '',
        district: ''
      }
    }
  },
  actions: {
    /**
     * 获取当前位置
     * @returns 经纬度
     */
    getLocation(): Promise<Location> {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            this.latitude = res.latitude
            this.longitude = res.longitude
            resolve({
              latitude: res.latitude,
              longitude: res.longitude
            })
          },
          fail: () => {
            resolve({
              latitude: this.latitude,
              longitude: this.longitude
            })
            // reject()
          }
        })
      })
    },
    /**
     * 根据经纬度逆地址解析
     * @returns
     */
    getCityCode(): Promise<LocationCity> {
      return new Promise(async (resolve, reject) => {
        const feConfig = await useConfigStore().feConfig
        const { latitude, longitude } = await this.getLocation()
        // #ifdef H5
        toLoadMapsScript(feConfig.amap)
          .then(async () => {
            const map = new TMap.service.Geocoder()
            const currentLocation = new TMap.LatLng(Number(latitude), Number(longitude))
            const res = await map.getAddress({
              location: currentLocation,
              getPoi: 1
            })
            const { adcode, city, province, district } = res.result.ad_info
            const cityInfo = {
              province,
              cityCode: adcode.substring(0, 4) + '00',
              city,
              district: district
            }
            Object.assign(this.cityInfo, cityInfo)
            resolve(cityInfo)
          })
          .catch(() => {
            reject()
          })
        // #endif
        //#ifdef MP-WEIXIN
        const mapKey = feConfig.amap.web_api_key
        const qqmapsdk = new QQMapWX({ key: mapKey })
        qqmapsdk.reverseGeocoder({
          location: `${latitude},${longitude}`,
          get_poi: 1,
          success: (res: AnyObject) => {
            const { adcode, city, province, district } = res.result.ad_info
            const cityInfo = {
              province,
              cityCode: adcode.substring(0, 4) + '00',
              city,
              district: district
            }
            Object.assign(this.cityInfo, cityInfo)
            resolve(cityInfo)
          },
          fail: () => {
            reject()
          }
        })
        // #endif
      })
    }
  }
})
