/**
 * 普通商品模块声明
 */
declare namespace Goods {
  /**
   * 商品前台类目
   */
  interface FrontCategory {
    code: string
    description: null | string
    hasChildren: null | Boolean
    id: string
    level: number
    logo: null | string
    name: string
    parentId: string
    shopCode: string
    status: number
    terminal: number
  }
  interface Item {
    itemContentVO: ItemContentVO
    itemActivityVO?: Activity.BaseInfo[]
    itemBasicVO: BaseInfo
    itemDetailVOList: ItemDetailList[]
    itemPriceVO: ItemPriceVO
    skuVOList: Sku[]
    itemAttributeVOList: ItemAttributeVOList[] | null
  }
  interface ItemAttributeVOList {
    attributeId: string
    attributeName: string
    /*
    attributeType为2是销售属性,3是普通属性
    */
    attributeType: number
    attributeValueList: string[]
  }
  // 商品活动    暂时看不到数据结构，10月份版本在改
  interface ItemActivityVO {
    activityType: any
    itemActivityStatus: any
    activitySkuVos: any
    lowPrice: number
  }
  // 商品价格
  interface ItemPriceVO {
    maxPointPrice: number | null
    maxPrice: number | null
    minPointPrice: number | null
    minPrice: number | null
  }
  // 商品基本信息
  interface ItemBasicVO {
    id: string
    name: string
    /**
     * 商品类型
     * 整车 0
     * 配送商品 1
     * 虚拟商品 2
     */
    type: number
    /**
     * 商品主图地址
     */
    mainImage: string | null
    /**
     * 商品主视频地址
     */
    mainVideo: string | null
    /**
     * 广告语
     */
    advertise: string
    /**
     * 支付类型
     */
    payType: number
    /**
     * 销量
     */
    saleQuantity: number | null
    /**
     * 渠道id
     */
    vmId: VmId
    /**
     * 商品状态
     * 在售商品 1
     */
    status: number
    /**
     * 运费模板
     */
    shipTemplateId: string
    activityVos: Activity.BaseInfo[]
  }

  /**
   * 二级类目及其商品
   */
  interface CategoryItems {
    /**
     * id
     */
    id: string
    /**
     * 商品列表
     */
    itemDTOList: Item[]
    /**
     * 是否是叶子类目标识
     */
    leafFlag: boolean
    /**
     * 父级Id
     */
    parentId: string
    /**
     * 类目编码
     */
    code: string
    /**
     * 类目名称
     */
    name: string
    /**
     * 终端类型
     */
    terminal: Terminal | null
    /**
     * 排序
     */
    position: number
    /**
     * 类目层级
     */
    level: number
    children: ItemChildren[]
  }
  interface ItemChildren extends CategoryItems {}

  /**
   * 获取一级前台类目
   */
  type GetFrontCategory = () => Promise<FrontCategory[]>

  /**
   * 根据前台类目id获取商品
   */
  type GetCategoryItems = (frontCategoryId: string) => Promise<CategoryItems[]>

  /**
   * 获取货币积分兑换比例 1元 = ${pointRatio}积分
   */
  type GetPointRatio = () => Promise<number>

  /**
   * 商品推荐算法
   * @enum 2 用户协同过滤（生活首页过滤）
   * @enum 3 流行度推荐（默认商品推荐方式）
   * @enum 4 物品协同过滤（订单根据商品进行过滤，商品详情进行过滤）
   */
  type RecommendType = 2 | 3 | 4

  interface RecommendItemsQuery {
    pageNo?: number
    pageSize?: number
    /**
     * 商品推荐算法
     */
    recType?: RecommendType
    /**
     * 推荐商品类型（现在只有推荐生活商品的场景）
     * {@link Enum.Item.Type} 多种商品逗号隔开
     */
    recItemTypes?: string
    /**
     * 需要去重的前台类目id（生活首页需要传入）
     */
    excludeFontCategoryId?: number | string
    /**
     * 要去重的商品id（生活首页不需要去重，订单详情、商品详情页需要将商品id传入）
     */
    excludeItemIds?: number | string
    /**
     * 终端类型
     */
    terminal?: number
  }

  /**
   * 获取推荐商品
   */
  type GetRecommendItems = (params: RecommendItemsQuery) => Promise<PageListInfo<Item>>

  /**
   * 门店信息
   */
  interface StoreInfo {
    id: string
    latitude: string
    longitude: string
    mobile: string
    storeAddress: string
    storeName: string
    name: string
    address: string
  }
  /**
   * 商品基础信息
   */
  interface BaseInfo extends ItemBasicVO {
    extra: {
      /**
       * 门店信息
       */
      storeInfo: StoreInfo[]
      /**
       * 客户需预留信息
       */
      customerInfo?: AnyObject
    } | null
  }

  /**
   * 销售属性
   */
  interface Attribute {
    attrKey: string
    attrVal: string
  }
  /* 
   商品sku信息
   */
  interface Sku {
    activityVO: any
    skuBasicVO: SkuBasicVO
    stockVO: { availableQuantity: number }
  }
  /**
   * sku属性信息
   */
  interface SkuAttributeValueVOList {
    skuId: string
    attributeId: string
    attributeName: string
    attributeValue: string
  }
  interface SkuBasicVO {
    /**
     * skuId
     */
    id: string
    /**
     * 是否参加活动
     */
    activityFlag: null | boolean
    /**
     * sku编码
     */

    code: string
    /**
     * sku图片信息
     */
    image: string
    /**
     * 商品id
     */
    itemId: string
    /**
     * 是否限购
     */
    limitFlag: null | boolean
    /**
     * 限购数量
     */
    limitQuantity: number
    /**
     * 最大积分价格
     */
    maxPointPrice: null
    /**
     * 最小积分价格
     */
    minPointPrice: null
    /**
     * 商品名称
     */
    name: null
    /**
     * 积分价格
     */
    pointPrice: null
    /**
     * 商品价格
     */
    price: number
    /**
     * sku属性
     */
    skuAttributeValueVOList: SkuAttributeValueVOList[]
  }

  /**
   * 商品详情，富文本信息
   */
  interface RichText {
    terminal: number
    details: {
      type: number
      text: string
    }[]
  }

  /**
   * 商品详情页评论信息
   */
  interface GoodsEvaluations {
    applauseRate: number
    defaultNum: number
    itemEvaluationConsumer: ItemEvaluationConsumer[]
    totalNum: number
  }
  interface ItemEvaluationConsumer {
    anonymousFlag: number
    businessId: string
    content: string
    createTime: string
    defaultFlag: number
    eventId: string
    eventType: number
    id: string
    mediaFlag: number
    mediaUrlList: AnyObject[]
    replyFlag: number
    replyNum: number
    score: number
    showFlag: number
    status: number
    thumbsUpNum: thumbsUpFlag
    topFlag: thumbsUpFlag
    userAvatar: string
    userId: string
    userName: string
  }
  /**
   * 评论信息
   */
  interface CommentInfo {
    id: string
    userName: string
    userAvatar: string
    createTime: string
    content: string
    mediaUrlList: string[]
  }
  interface ItemContentVO {
    categoryId: string
    categoryName: string
    shipTemplateId: string
    shipTemplateName: string
    shopCode: string
    shopName: string
    supplierCode: string
    supplierName: string
  }

  /**
   * 完整的商品详情
   */
  interface ItemDetailList {
    details: RichText[]
    imageList: string[]
    terminal: number
  }

  /**
   * 获取商品详情
   */
  type GetGoodsDetail = (itemId: string | number) => Promise<Detail>

  declare namespace Activity {
    interface Sku {
      id: string
      activityType: number
      activtyStatus: number
      itemActivityStatus: number
      startTime: number
      endTime: number
      /**
       * skuid
       */
      skuId: string
      /**
       * sku可用活动库存数
       */
      skuQuantity: number
      /**
       * sku价格
       */
      skuPrice: number
      /**
       * sku活动价格
       */
      activityPrice: number
      /**
       * sku活动限购数量
       */
      skuBuyLimit: number
    }

    interface BaseInfo {
      /**
       * 活动id
       */
      id: string
      /**
       * 活动名称
       */
      activityName: string
      /**
       * 活动类型
       */
      activityType: number | null
      /**
       * 活动状态
       */
      activtyStatus: number | null
      lowPrice: number
      itemActivityStatus: number
      /**
       * 活动开始时间
       */
      startTime: string | number
      /**
       * 活动结束时间
       */
      endTime: string | number
      activitySkuVos: Sku[]
    }
  }
}
