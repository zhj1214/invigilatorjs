import test from './test'

/**
 * @description 去除空格
 * @param String str 需要去除空格的字符串
 * @param String pos both(左右)|left|right|all 默认both
 */
export const trim = function (str, pos = 'both') {
  str = String(str)
  if (pos == 'both') {
    return str.replace(/^\s+|\s+$/g, '')
  }
  if (pos == 'left') {
    return str.replace(/^\s*/, '')
  }
  if (pos == 'right') {
    return str.replace(/(\s*$)/g, '')
  }
  if (pos == 'all') {
    return str.replace(/\s+/g, '')
  }
  return str
}

export const props = {
  // 滑块的移动过渡时间，单位ms
  duration: {
    type: Number,
    default: 300
  },
  // tabs标签数组
  list: {
    type: Array,
    default: () => []
  },
  // 滑块颜色
  lineColor: {
    type: String,
    default: '#3c9cff'
  },
  // 菜单选择中时的样式
  activeStyle: {
    type: [String, Object],
    default: () => ({
      color: '#303133'
    })
  },
  // 菜单非选中时的样式
  inactiveStyle: {
    type: [String, Object],
    default: () => ({
      color: '#606266'
    })
  },
  // 滑块长度
  lineWidth: {
    type: [String, Number],
    default: 20
  },
  // 滑块高度
  lineHeight: {
    type: [String, Number],
    default: 3
  },
  // 滑块背景显示大小，当滑块背景设置为图片时使用
  lineBgSize: {
    type: String,
    default: 'cover'
  },
  // 菜单item的样式
  itemStyle: {
    type: [String, Object],
    default: () => ({
      height: '44px'
    })
  },
  // 菜单是否可滚动
  scrollable: {
    type: Boolean,
    default: true
  },
  // 当前选中标签的索引
  current: {
    type: [Number, String],
    default: 0
  },
  // 默认读取的键名
  keyName: {
    type: String,
    default: 'name'
  }
}

/**
 * @description 样式转换
 * 对象转字符串，或者字符串转对象
 * @param {object | string} customStyle 需要转换的目标
 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
 * @returns {object|string}
 */
export const addStyle = function (customStyle, target = 'object') {
  // 字符串转字符串，对象转对象情形，直接返回
  if (test.empty(customStyle) || (typeof customStyle === 'object' && target === 'object') || (target === 'string' && typeof customStyle === 'string')) {
    return customStyle
  }
  // 字符串转对象
  if (target === 'object') {
    // 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
    customStyle = trim(customStyle)
    // 根据";"将字符串转为数组形式
    const styleArray = customStyle.split(';')
    const style = {}
    // 历遍数组，拼接成对象
    for (let i = 0; i < styleArray.length; i++) {
      // 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
      if (styleArray[i]) {
        const item = styleArray[i].split(':')
        style[trim(item[0])] = trim(item[1])
      }
    }
    return style
  }
  // 这里为对象转字符串形式
  let string = ''
  for (const i in customStyle) {
    // 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
    const key = i.replace(/([A-Z])/g, '-$1').toLowerCase()
    string += `${key}:${customStyle[i]};`
  }
  // 去除两端空格
  return trim(string)
}

/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
export const addUnit = function (value = 'auto', unit = uni?.$u?.config?.unit ?? 'px') {
  value = String(value)
  // 用uView内置验证规则中的number判断是否为数值
  return test.number(value) ? `${value}${unit}` : value
}

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
export const deepClone = function (obj) {
  // 对常见的“非”值，直接返回原来值
  if ([null, undefined, NaN, false].includes(obj)) {
    return obj
  }
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    // 原始类型直接返回
    return obj
  }
  const o = test.array(obj) ? [] : {}
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
    }
  }
  return o
}

/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
export const deepMerge = function (target = {}, source = {}) {
  target = deepClone(target)
  if (typeof target !== 'object' || typeof source !== 'object') {
    return false
  }
  for (const prop in source) {
    if (!source.hasOwnProperty(prop)) {
      continue
    }
    if (prop in target) {
      if (typeof target[prop] !== 'object') {
        target[prop] = source[prop]
      } else if (typeof source[prop] !== 'object') {
        target[prop] = source[prop]
      } else if (target[prop].concat && source[prop].concat) {
        target[prop] = target[prop].concat(source[prop])
      } else {
        target[prop] = deepMerge(target[prop], source[prop])
      }
    } else {
      target[prop] = source[prop]
    }
  }
  return target
}

/**
 * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换
 * @param {number|string} value 用户传递值的px值
 * @param {boolean} unit
 * @returns {number|string}
 */
export const getPx = function (value, unit = false) {
  if (test.number(value)) {
    return unit ? `${value}px` : Number(value)
  }
  // 如果带有rpx，先取出其数值部分，再转为px值
  if (/(rpx|upx)$/.test(value)) {
    return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
  }
  return unit ? `${parseInt(value)}px` : parseInt(value)
}

/**
 * @description 获取系统信息同步接口
 * @link 获取系统信息同步接口 https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync
 */
export const sys = function () {
  return uni.getSystemInfoSync()
}

/**
 * @description 进行延时，以达到可以简写代码的目的 比如: await sleep(20)将会阻塞20ms
 * @param {number} value 堵塞时间 单位ms 毫秒
 * @returns {Promise} 返回promise
 */
export const sleep = function (value = 30) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, value)
  })
}
