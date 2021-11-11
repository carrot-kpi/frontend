import { Box, Flex, Text } from 'rebass'
import { DateTime } from 'luxon'
import { Button } from '../button'
import styled, { useTheme } from 'styled-components'
import { Amount, Token } from '@carrot-kpi/sdk'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { Card } from '../card'
import { Countdown } from '../countdown'
import { UndecoratedInternalLink } from '../undecorated-link'
import { Title } from '../title'
import { useEffect, useState } from 'react'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { useKpiToken } from '../../hooks/useKpiToken'
import { useKpiTokenBalance } from '../../hooks/useKpiTokenBalance'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const KpiExpiredText = styled(Text)`
  color: ${(props) => props.theme.negativeSurfaceContent};
`

const GoalText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
`

interface CampaignCardProps {
  loading?: boolean
  kpiId?: string
  creator?: string
  expiresAt?: DateTime
  goal?: string
  collateral?: Amount<Token>
}

export function CampaignCard({ loading, kpiId, creator, expiresAt, goal, collateral }: CampaignCardProps) {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const collateralPriceUSD = useTokenPriceUSD(collateral?.currency)
  const [question, setQuestion] = useState('')
  const { kpiToken, loading: loadingKpiToken } = useKpiToken(kpiId ? kpiId : '')
  const { balance: kpiTokenBalance, loading: loadingKpiTokenBalance } = useKpiTokenBalance(kpiToken, account)

  useEffect(() => {
    let cancelled = false
    const stripMarkdown = async () => {
      if (!goal) return
      try {
        const file = await remark().use(strip).process(goal)
        const content = file?.toString()
        if (content && !cancelled) setQuestion(content)
      } catch (error) {
        console.error('error stripping markdown', error)
      }
    }
    stripMarkdown()
    return () => {
      cancelled = false
    }
  }, [goal])

  return (
    <Card mx={['16px', '0px']} flexDirection="column" maxWidth={['auto', '300px']} height="100%" display="flex">
      <Flex justifyContent={'space-between'}>
        <Text fontSize="16px" mb="8px" fontWeight="700" color={theme.accent}>
          {loading ? <Skeleton width="40px" /> : creator}
        </Text>
        <Text fontSize="16px" mb="8px" fontWeight="700" color={theme.accent}>
          {loadingKpiToken && loadingKpiTokenBalance ? (
            <Skeleton width="40px" />
          ) : kpiTokenBalance && !kpiTokenBalance.isZero() ? (
            `${kpiTokenBalance.toFixed(4)} ${kpiTokenBalance.currency.symbol}`
          ) : (
            ''
          )}
        </Text>
      </Flex>

      <Box mb="20px" flexGrow={1}>
        <GoalText fontSize="20px">
          {loading || !goal ? (
            <Flex flexDirection="column">
              <Box mb="8px">
                <Skeleton width="100%" />
              </Box>
              <Box mb="8px">
                <Skeleton width="100%" />
              </Box>
              <Box mb="8px">
                <Skeleton width="100px" />
              </Box>
            </Flex>
          ) : (
            question
          )}
        </GoalText>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4px">
        <Title>Rewards:</Title>
        <Text textAlign="right" fontFamily="Overpass Mono" fontWeight="700">
          {loading || !collateral ? (
            <Skeleton width="100px" />
          ) : (
            `${collateral?.toFixed(4)} ${collateral?.currency.symbol} ($${
              collateralPriceUSD.isZero() ? '-' : collateral.multiply(collateralPriceUSD).toFixed(2)
            })`
          )}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Title>Time left:</Title>
        {!expiresAt ? (
          <Skeleton width="80px" />
        ) : expiresAt.toJSDate().getTime() < Date.now() ? (
          <KpiExpiredText fontFamily="Overpass Mono" fontWeight="700">
            KPI expired
          </KpiExpiredText>
        ) : (
          <Countdown fontSize="14px" fontWeight="600" to={expiresAt} />
        )}
      </Flex>
      <Box>
        <UndecoratedInternalLink to={`/campaigns/${kpiId}`}>
          <Button primary medium>
            See campaign
          </Button>
        </UndecoratedInternalLink>
      </Box>
    </Card>
  )
}
