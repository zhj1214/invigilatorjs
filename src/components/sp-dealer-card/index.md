#### 作者

张明

#### 组件介绍

经销商卡片

#### 组件缩略图

![缩略图](./dealer-card.png)

#### 使用

```html
<sp-dealer-card :dealer="{}"></sp-dealer-card>
```

```ts
interface DealerInfo {
  name: string
  address: string
  image: string
  cide: string
}
```

#### Props

| 参数   | 类型       | 默认值 | 可选项 | 备注       |
| ------ | ---------- | ------ | ------ | ---------- |
| dealer | DealerInfo | -      | -      | 经销商信息 |
