import request from '@/http/request'
import request2 from '@/http/request2'

export const stepn = (params) => {
  return request({
    url: '/stepn',
    method: 'get',
    params: params
  })
}
 
export const stepnFlow = (params) => {
  return request({
    url: 'stepn_flow',
    method: 'get',
    params: params
  })
}

 
export const stepnPriceMarketcap = (params) => {
  return request({
    url: 'stepn_price_marketcap',
    method: 'get',
    data: params
  })
}

export const stepn_holders = (params) => {
  return request({
    url: 'stepn_holders',
    method: 'get',
    data: params
  })
}

export const getTwitter = (params) => {
  return request2({
    url: 'getTrends/getTwitter?coin=GMT',
    method: 'get',
    data: params
  })
}

 



export default {
  stepn,
  stepnFlow,
  stepnPriceMarketcap,
  stepn_holders,
  getTwitter
}
