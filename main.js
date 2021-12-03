import fetch from 'node-fetch'
import { appendFile } from 'fs/promises'

import itemList from './itemList.js'

const getItemInfo = async ({ id, targetPrice }) => {
  const response = await fetch(
    `https://ecapi.pchome.com.tw/ecshop/prodapi/v2/prod/${id}&_callback=json`,
    { "method": "GET" },
  )
  const data = await response.text()
  const itemInfo = JSON.parse(data.split('json(')[1].split(');}')[0])[id]
  console.log(itemInfo.Name)
  return ({
    inPrice: itemInfo.Price.P <= targetPrice,
    isEnough: itemInfo.Qty !== 0,
    currentPrice: itemInfo.Price.P,
  })
}

const prepareMessage = async (itemInfo) => {
  await appendFile('./message.txt', `${JSON.stringify(itemInfo)}\n`)
}


for (const item of itemList) {
  const { inPrice, isEnough, currentPrice } = await getItemInfo(item)
  if (inPrice && isEnough) prepareMessage({ ...item, currentPrice })
}
