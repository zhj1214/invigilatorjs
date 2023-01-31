import { ref } from 'vue'
import { getCartGoodsNumber, addGoodsToCart } from '@api/cart'

export function useCart() {
  const cartGoodsNumber = ref(0)
  /**
   * 获取购物车商品数量
   */
  async function getCartNumber() {
    try {
      cartGoodsNumber.value = await getCartGoodsNumber()
    } catch (error) {}
  }

  /**
   * 商品加入购物车
   * @param items
   */
  async function addCart(items: Cart.AddCartParams) {
    try {
      const res = await addGoodsToCart(items)
      if (res) {
        getCartNumber()
        uni.showToast({ icon: 'success', title: '加入购物车成功' })
      } else {
        uni.showToast({ icon: 'none', title: '加入购物车失败' })
      }
    } catch (error) {}
  }

  return {
    cartGoodsNumber,
    getCartNumber,
    addCart
  }
}
