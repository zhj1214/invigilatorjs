/** 购物车类型声明 **/
declare namespace Cart {
  /**
   * 购物车商品信息
   * @property itemId 商品id
   * @property itemName 商品名称
   * @property itemType 商品类型
   * @property quantity 购买的商品数量
   * @property limitQuantity 商品限制数量
   * @property stockQuantity 商品库存数量
   * @property skuId skuId
   * @property skuAttr sku属性信息
   * @property activitySkuVos 活动中sku信息
   * @property dealerId 经销商id
   */
  interface Goods {
    id: string
    activityId: string | null
    vmId: number
    quantity: number
    skuId: string
    itemId: number
    itemName: string
    thumbnail: string
    itemType: number
    shopId: number
    dealerId: number | null
    purchaserId: number
    limitQuantity: number | null
    stockQuantity: number
    pointPrice: number | null
    minPointPrice: number
    maxPointPrice: number
    snapshotPrice: number
    payType: number
    status: number // 0:已失效 1:正常 -1:已删除
    activitySkuVos: Goods.Activity.Sku[]
    skuAttr: Goods.SkuAttributeValueVOList[]
    extra: {
      guidePrice: string
      originPrice: string
    }
    shopCode: string
  }

  /**
   * 加入购物车入参
   */
  interface AddCartParams {
    activityId?: string
    quantity: number
    skuId: string
    itemId: string
    snapshotPrice: number
    shopCode: string //店铺编码   现在默认:1
    itemType: number //商品类型（0-整车,1-实体,2-虚拟）
    itemName: string
    thumbnail: string
  }

  /**
   * 加入购物车接口
   */
  type AddCart = (data: AddCartParams) => Promise<Boolean>
}
