declare module 'UniApp' {
  interface EventHandle {
    detail: { current: number; source?: any }
    [key: string]: any
  }
}

/**
 * 重写UniApp类型声明
 */
declare namespace UniNamespace {
  interface UserInfo {
    /**
     * 用户昵称
     */
    nickName: string
    /**
     * 该服务商唯一用户标识
     */
    openId: string
    /**
     * 用户头像
     */
    avatarUrl: string
    /**
     * 性别
     */
    gender: number
  }
}

import { PluginOption, Plugin } from 'vite'

declare function vitePluginTemplate(): Plugin

export { vitePluginTemplate as default }
