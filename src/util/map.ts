const EARTH_RADIUS = 6378137.0 //单位M

function getRad(d: number) {
  return (d * Math.PI) / 180.0
}

/**
 * 参数：两地的经纬度数值
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 * @returns
 */
export function getFlatternDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radLat1 = getRad(lat1)
  const radLat2 = getRad(lat2)
  const a = radLat1 - radLat2
  const b = getRad(lng1) - getRad(lng2)
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * EARTH_RADIUS // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000 //输出为米
  return s
}

/**
 * 动态加载地图script
 */
let isLoadedScript = false
export const toLoadMapsScript = (amap: MapConfig) => {
  const mapKey = amap.web_api_key
  const scriptUrl = `https://map.qq.com/api/gljs?v=1.exp&key=${mapKey}&libraries=service`
  return new Promise((resolve, reject) => {
    if (isLoadedScript) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = scriptUrl
    document.body.appendChild(script)
    script.onload = function (e) {
      isLoadedScript = true
      resolve(true)
    }
  })
}
