import { Box, Flex, Text } from 'rebass'
import { DateTime } from 'luxon'
import { ButtonMedium } from '../button'
import styled, { useTheme } from 'styled-components'
import { TokenAmount } from 'carrot-sdk'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { Card } from '../card'
import { Countdown } from '../countdown'

const KpiExpiredText = styled(Text)`
  color: ${(props) => props.theme.error};
`

interface CampaignCardProps {
  loading?: boolean
  kpiId?: string
  creator?: string
  expiresAt?: DateTime
  goal?: string
  collateral?: TokenAmount
  onClick?: () => void
}

export function CampaignCard({ loading, creator, expiresAt, goal, collateral, onClick }: CampaignCardProps) {
  const theme = useTheme()
  const { priceUSD: collateralPriceUSD } = useTokenPriceUSD(collateral?.token)

  return (
    <Card p="24px 32px" flexDirection="column" maxWidth="300px">
      <Flex width="100%" justifyContent="space-between" mb="16px">
        <Text fontSize="20px" fontWeight="700" lineHeight="30px" color={theme.primary}>
          {loading ? <Skeleton width="40px" /> : creator}
        </Text>
      </Flex>
      <Flex mb="20px">
        <Text fontSize="20px" fontWeight="800" lineHeight="20px">
          {loading ? <Skeleton width="160px" /> : goal}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="4px">
        <Text>Rewards:</Text>
        <Text textAlign="center" fontSize="20px" fontWeight="800" color={theme.primary}>
          ${loading || !collateral ? <Skeleton width="60px" /> : collateral.multiply(collateralPriceUSD).toFixed(2)}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text>Time left:</Text>
        {!expiresAt ? (
          <Skeleton width="80px" />
        ) : expiresAt.toJSDate().getTime() < Date.now() ? (
          <KpiExpiredText fontWeight="700">KPI expired</KpiExpiredText>
        ) : (
          <Countdown fontSize="12px" fontWeight="600" to={expiresAt} />
        )}
      </Flex>
      <Box>
        <ButtonMedium onClick={onClick} width="100%">
          See campaign
        </ButtonMedium>
      </Box>
    </Card>
  )
}
