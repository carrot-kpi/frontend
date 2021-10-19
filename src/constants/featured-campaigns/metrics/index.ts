import { ChainId, Token } from '@carrot-kpi/sdk'
import { ChartDataPoint, DexPlatform, TokenMarketCapPlatform, TokenPricePlatform, TvlPlatform } from '../platforms'
import { DateTime } from 'luxon'

export abstract class Metric {
  protected readonly from: DateTime
  protected readonly to: DateTime
  protected readonly granularity: number

  constructor(from: DateTime, to: DateTime, granularity: number) {
    this.from = from
    this.to = to
    this.granularity = granularity
  }

  abstract chartData(): Promise<ChartDataPoint[]>

  abstract get name(): string
}

export class TvlMetric extends Metric {
  private readonly chainId: ChainId
  private readonly pricingPlatform: TokenPricePlatform
  private readonly platform: TvlPlatform

  constructor(
    chainId: ChainId,
    pricingPlatform: TokenPricePlatform,
    platform: TvlPlatform,
    from: DateTime,
    to: DateTime,
    granularity: number
  ) {
    super(from, to, granularity)
    this.chainId = chainId
    this.pricingPlatform = pricingPlatform
    this.platform = platform
  }

  get name(): string {
    return `${this.platform.name} TVL`
  }

  public async chartData(): Promise<ChartDataPoint[]> {
    return this.platform.dailyOverallTvl(this.chainId, this.pricingPlatform, this.from, this.to, this.granularity)
  }
}

export class TokenPriceMetric extends Metric {
  private readonly token: Token
  private readonly platform: TokenPricePlatform

  constructor(token: Token, platform: TokenPricePlatform, from: DateTime, to: DateTime, granularity: number) {
    super(from, to, granularity)
    this.token = token
    this.platform = platform
  }

  get name(): string {
    return `${this.token.symbol} USD price on ${this.platform.name}`
  }

  public async chartData(): Promise<ChartDataPoint[]> {
    return this.platform.dailyTokenPrice(this.token, this.from, this.to, this.granularity)
  }
}

export class PairLiquidityMetric extends Metric {
  private readonly tokenA: Token
  private readonly tokenB: Token
  private readonly platform: DexPlatform

  constructor(tokenA: Token, tokenB: Token, platform: DexPlatform, from: DateTime, to: DateTime, granularity: number) {
    super(from, to, granularity)
    this.tokenA = tokenA
    this.tokenB = tokenB
    this.platform = platform
  }

  get name(): string {
    return `${this.tokenA.symbol}/${this.tokenB.symbol} USD liquidity on ${this.platform.name}`
  }

  public async chartData(): Promise<ChartDataPoint[]> {
    return this.platform.pairDailyTvl(this.tokenA, this.tokenB, this.from, this.to, this.granularity)
  }
}

export class TokenMarketCapMetric extends Metric {
  private readonly token: Token
  private readonly platform: TokenMarketCapPlatform

  constructor(token: Token, platform: TokenMarketCapPlatform, from: DateTime, to: DateTime, granularity: number) {
    super(from, to, granularity)
    this.token = token
    this.platform = platform
  }

  get name(): string {
    return `${this.token.symbol} market cap on ${this.platform.name}`
  }

  public async chartData(): Promise<ChartDataPoint[]> {
    return this.platform.dailyTokenMarketCap(this.token, this.from, this.to, this.granularity)
  }
}
