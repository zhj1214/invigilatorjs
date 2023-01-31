import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import providers from '@util/providers'
// 定义promise原型链
// #ifdef MP-WEIXIN
// Promise.prototype.finally = function (callback) {
//   let P = this.constructor
//   return this.then(
//     (value) => P.resolve(callback()).then(() => value),
//     (reason) =>
//       P.resolve(callback()).then(() => {
//         throw reason
//       })
//   )
// }
// #endif
console.log('AppAppAppAppApp', App)

const app = createApp(App)
app.use(createPinia())
app.use(providers)
app.mount('#app')
