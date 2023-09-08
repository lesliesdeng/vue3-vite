import iRequest from '../../index'

enum AnalysisAPI {
  amountList = '/goods/amount/list',
  categoryGoodsCount = '/goods/category/count',
  categoryGoodsSale = '/goods/category/sale',
  categoryGoodsFavor = '/goods/category/favor',
  goodsSaleTop10 = '/goods/sale/top10',
  goodsAddressSale = '/goods/address/sale'
}

export function getAmountList() {
  return iRequest.get({
    url: AnalysisAPI.amountList
  })
}

export function getCategoryGoodsCount() {
  return iRequest.get({
    url: AnalysisAPI.categoryGoodsCount
  })
}

export function getCategoryGoodsSale() {
  return iRequest.get({
    url: AnalysisAPI.categoryGoodsSale
  })
}

export function getCategoryGoodsFavor() {
  return iRequest.get({
    url: AnalysisAPI.categoryGoodsFavor
  })
}

export function getGoodsSaleTop10() {
  return iRequest.get({
    url: AnalysisAPI.goodsSaleTop10
  })
}

export function getGoodsAddressSale() {
  return iRequest.get({
    url: AnalysisAPI.goodsAddressSale
  })
}
