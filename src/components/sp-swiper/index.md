#### 作者

张明

#### 组件介绍

全局轮播组件

#### 组件缩略图

![缩略图](./swiper.png)

#### 使用

```html
<sp-swiper :img-list="[]" :control-bottom="20"></sp-swiper>
```

#### props

| 参数          | 类型     | 默认值 | 可选项     | 说明                   |
| ------------- | -------- | ------ | ---------- | ---------------------- |
| imgList       | String[] | []     | -          | 轮播图片列表           |
| controlBottom | Number   | 20     | -          | 指示点与轮播底边的距离 |
| autoplay      | Boolean  | false  | true/false | 是否自动切换           |

#### events

| 事件名 | 参数  | 参数类型 | 说明                             |
| ------ | ----- | -------- | -------------------------------- |
| change | index | number   | current 改变时会触发 change 事件 |
| click  | index | number   | 点击滑块时会触发 click 事件      |
