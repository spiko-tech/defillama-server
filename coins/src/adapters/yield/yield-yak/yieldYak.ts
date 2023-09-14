import { Write, } from "../../utils/dbInterfaces";
import { getApi } from "../../utils/sdk";
import getWrites from "../../utils/getWrites";

export const config = {
  avax: {
    tokens: {
      "YY_AAVE_AVAX": "0xaAc0F2d0630d1D09ab2B5A400412a4840B866d95",
      "YY_PTP_sAVAX": "0xb8f531c0d3c53B1760bcb7F57d87762Fd25c4977",
      "YY_PNG_AVAX_USDC_LP": "0xC0cd58661b68e10b49D3Bec4bC5E44e7A7c20656",
      "YY_PNG_AVAX_ETH_LP": "0xFCD2050E213cC54db2c9c99632AC870574FbC261",
      "YY_TJ_AVAX_USDC_LP": "0xDEf94a13fF31FB6363f1e03bF18fe0F59Db83BBC",
      "YY_TJ_AVAX_ETH_LP": "0x5219558ee591b030E075892acc41334A1694fd8A",
      "YY_TJ_AVAX_sAVAX_LP": "0x22EDe03f1115666CF05a4bAfafaEe8F43D42cD56",
      "YY_fsGLP": "0x9f637540149f922145c06e1aa3f38dcDc32Aff5C",
    }
  },
  arbitrum: {
    tokens: {
      "YY_WOMAT-LP-DAI": "0x1817fe376740b53cae73224b7f0a57f23dd4c9b5",
      "YY_WOMAT-LP-USDT": "0x8bc6968b7a9eed1dd0a259efa85dc2325b923dd2",
      "YY GMX sGLP-": "0x28f37fa106aa2159c91c769f7ae415952d28b6ac",
      "YY_WOMAT-LP-USDC.e": "0x4649c7c3316b27c4a3db5f3b47f87c687776eb8c",
    }
  },
} as any

export default async function getTokenPrices(chain: string, timestamp: number) {
  const writes: Write[] = [];
  const api = await getApi(chain, timestamp)
  const calls = Object.values(config[chain].tokens) as string[]

  const totalDeposits = await api.multiCall({ abi: 'uint256:totalDeposits', calls, })
  const totalSupply = await api.multiCall({ abi: 'uint256:totalSupply', calls, })
  const depositToken = await api.multiCall({ abi: 'address:depositToken', calls, })

  const pricesObject: any = {}
  calls.forEach((vault: any, i: any) => { pricesObject[vault] = { underlying: depositToken[i], price: totalDeposits[i] / totalSupply[i]  } })

  return getWrites({ chain, timestamp, writes, pricesObject, projectName: 'yield-yak' })
}
