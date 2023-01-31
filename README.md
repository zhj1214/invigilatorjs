# 数字商城

支持 `微信小程序` 、`H5` 双版本。

`node@14.17.5` `yarn@1.x`

# 指令

```
yarn dev
yarn dev:weixin
```

```
yarn sit
yarn sit:weixin
```

```
yarn uat
yarn uat:weixin
```

```
yarn build:dev
yarn build:dev:weixin
```

```
yarn build:sit
yarn build:sit:weixin
```

```
yarn build:uat
yarn build:uat:weixin
```

# 目录结构

```
├── .husky                        操作git钩子的工具
├── public                        放置的为公共文件
├── script                        项目配置文件
├── src
│   ├── api                       接口请求
│   ├── components                全局公共组件(跨包使用的组件)
│   ├── lib                       函数工具包(lodash、decimal等)
│   ├── package-card              购车分包
│   ├── package-community         社区分包
│   ├── package-life              生活分包
│   ├── package-mine              我的分包
│   ├── page                      项目页面
│   ├── static                    静态文件
│   ├── store
│   ├── style                     公共样式文件
│   ├── types                     TS类型声明
│   ├── util                      全局工具类函数(不包含业务)
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json
│   ├── pages.json
│   └── uni.scss                   uni-app内置的常用样式变量
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tsconfig.json
├── vite.config.js
└── yarn.lock
```

## 接口文档

UAA: https://yapi.public.supaur.top/project/2086/interface/api  
用户：https://yapi.public.supaur.top/project/1891/interface/api  
商城：https://yapi.public.supaur.top/project/2931/interface/api  
社群：https://yapi.public.supaur.top/project/2722/interface/api  
资讯：https://yapi.public.supaur.top/project/2738/interface/api  
推荐：https://yapi.public.supaur.top/project/2842/interface/api  
线索：https://yapi.public.supaur.top/project/2660/interface/api  
权益：https://yapi.public.supaur.top/project/2790/interface/api  
事件：暂无  
成就：https://yapi.public.supaur.top/project/2949/interface/api  
任务：https://yapi.public.supaur.top/project/2950/interface/api  
多租户：暂无

## OSS

### dev:

ak: LTAI4Fi6sm8A8o5rsBdkTptU

sk: wn5tvkA98vzC3MKFOQ43wV3KvwYwFJ

bucket: arena-alpha

### sit:

ak: LTAI4FjZG9MwC8gsG9oKrxNx

sk: gZVQaNyti4AjsNO38VKX40SIJ3Nx5O

bucket: alpha-sit

## UI 设计稿

[蓝湖设计稿](https://lanhuapp.com/web/#/item/project/stage?tid=1cb52064-c86e-4629-8134-cdd19aa5ab46&pid=803b0551-0bc2-4273-9ea0-3838d4b419a9)

## 工程部署

ks:

## 测试环境

登录注意事项：

1. dev 验证码需要查看后端 ks 项目 c-biz-user-ser 的日志;

2. sit/uat 验证码需要在 SCRM 平台消息中心内添加该手机号为白名单;

3. 如果还没有，则咨询 `@涵英` ，帮忙查看该手机号是否屏蔽了短信发送平台

### dev

- H5 地址：[fe-mall-h5.alpha-dev.supaur.tech](https://fe-mall-h5.alpha-dev.supaur.tech)

- 无小程序

### sit

- H5 地址：[fe-mall-h5.alpha-sit.supaur.tech](https://fe-mall-h5.alpha-sit.supaur.tech)

- 小程序二维码：

  <img src="https://fe-front.alpha-sit.supaur.tech/fe-mall-2c/trial-code/sit.png" alt="sit小程序" width="150" height="150"/>

### uat

- H5 地址：[h5-lab.alpha-uat.supaur.tech](https://h5-lab.alpha-uat.supaur.tech)

- 小程序二维码：

  <img src="https://fe-front.alpha-sit.supaur.tech/fe-mall-2c/trial-code/uat.png" alt="uat小程序" width="150" height="150"/>
