#### 作者

山而

#### 组件介绍

全局标签页

#### 组件缩略图

![缩略图](./sp-tabs.png)

#### 使用

```html
<sp-tabs id="tab" underline carListHeader fixed :menus="tabs" :activeTab="activeTab" @onClick="handleTabChange" />
```

#### props

| 参数           | 类型     | 默认值 | 可选项     | 说明               |
| -------------- | -------- | ------ | ---------- | ------------------ |
| menus          | String[] | []     | -          | 标签列表           |
| activeTab      | Number   | 0      | -          | 当前激活的 tab     |
| underline      | Boolean  | false  | true/false | 是否需要下划线     |
| carListHeader  | Boolean  | false  | true/false |                    |
| fixed          | Boolean  | false  | true/false | -                  |
| initScrollPage | Boolean  | false  | true/false | 滚动到最左边       |
| assessStyle    | Boolean  | false  | true/false | 评价列表特有的样式 |

#### events

| 事件名   | 参数 | 参数类型 | 说明             |
| -------- | ---- | -------- | ---------------- |
| on-click | -    | -        | tab 被选中时触发 |
