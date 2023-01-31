#### 作者

山而

#### 组件介绍

用户头像组件

#### 组件缩略图

![缩略图](./sp-avatar-info.png)

#### 使用

```html
<sp-avatar-info></sp-avatar-info>
```

#### Props

| 参数     | 类型   | 默认值  | 可选项          | 备注               |
| -------- | ------ | ------- | --------------- | ------------------ |
| src      | String |         |                 | 头像地址           |
| title    | String |         |                 | 显示文字信息       |
| subtitle | String |         |                 | 显示副标题文字信息 |
| shape    | String | circle  | circle / square | 头像形状           |
| size     | String | default | default / large | 尺寸               |

#### Slot

| name     | 说明               | 默认值 |
| -------- | ------------------ | ------ |
| subtitle | 副标题显示内容     |        |
| btn      | 右侧按钮区显示信息 |        |
