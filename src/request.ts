import Fly from 'flyio/dist/npm/wx'
var fly = new Fly()

// const service = Axios.create({
//   baseURL: 'http://localhost:7001/api'
// })

//定义公共headers
// fly.config.headers={xx:5,bb:6,dd:7}
// //设置超时
// fly.config.timeout=10000;
// //设置请求基地址
// fly.config.baseURL="https://wendux.github.io/"

// 请求拦截
fly.interceptors.request.use((config) => {
  return config
})
// 响应拦截
fly.interceptors.response.use(
  async (response) => {
    const { data } = response
    return data
  },
  (err) => {
    return Promise.reject(err)
  }
)

export const http = fly
