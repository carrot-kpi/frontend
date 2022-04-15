import { useEffect, useState } from 'react'
import { Amount, Currency, Token } from '@carrot-kpi/sdk-core'
import { gql } from '@apollo/client'
import { Decimal } from 'decimal.js-light'
import { parseUnits } from '@ethersproject/units'
import { useHoneyswapSubgraphClient } from './useHoneyswapSubgraphClient'

const PRICE_QUERY = gql`
  query getPricesFragments($tokenIds: [ID!]!) {
    bundle(id: "1") {
      nativeCurrencyPrice
    }
    tokens(where: { id_in: $tokenIds }) {
      id
      derivedNativeCurrency
    }
  }
`

interface PriceQueryResponse {
  bundle?: { nativeCurrencyPrice: string }
  tokens?: { id: string; derivedNativeCurrency: string }[]
}

export function useHoneyswapTokensPriceUSD(tokens?: Token[]): {
  loading: boolean
  prices: { [address: string]: Amount<Currency> }
} {
  const honeySwapSubgraphClient = useHoneyswapSubgraphClient()
  const [loading, setLoading] = useState(true)
  const [prices, setPrices] = useState<{ [address: string]: Amount<Currency> }>({})

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!tokens || tokens.length === 0 || !honeySwapSubgraphClient) {
        setLoading(false)
        return
      }
      if (!cancelled) setLoading(true)
      try {
        const { data: response } = await honeySwapSubgraphClient.query<PriceQueryResponse>({
          query: PRICE_QUERY,
          variables: {
            tokenIds: tokens.map((token) => token.address.toLowerCase()),
          },
        })
        if (!response.bundle || !response.tokens || response.tokens.length === 0) {
          if (!cancelled) setPrices({})
          return
        }
        const usdDecimals = Currency.USD.decimals
        const nativeCurrencyPrice = response.bundle.nativeCurrencyPrice
        const prices = response.tokens.reduce((accumulator: { [address: string]: Amount<Currency> }, price) => {
          accumulator[price.id] = new Amount(
            Currency.USD,
            parseUnits(
              new Decimal(price.derivedNativeCurrency).mul(nativeCurrencyPrice).toFixed(usdDecimals),
              usdDecimals
            )
          )
          return accumulator
        }, {})

        if (!cancelled) setPrices(prices)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [honeySwapSubgraphClient, tokens])

  return { loading, prices }
}