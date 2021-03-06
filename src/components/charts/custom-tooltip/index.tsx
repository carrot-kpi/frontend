import { Text } from 'rebass'
import { TooltipProps } from 'recharts'
import { DateTime } from 'luxon'
import { commify } from '@ethersproject/units'
import { Card } from '../../card'
import Decimal from 'decimal.js-light'

export const CustomTooltip = ({ payload }: TooltipProps<string, string>) => {
  const unwrappedPayload = payload?.[0]?.payload

  return (
    <Card flexDirection="column" pb="16px">
      <Text mb="6px">
        {unwrappedPayload?.x &&
          DateTime.fromMillis(parseInt(unwrappedPayload.x.toString())).toLocaleString(DateTime.DATETIME_MED)}
      </Text>
      <Text fontFamily="Overpass Mono" lineHeight="20px">
        ${unwrappedPayload?.y && commify(new Decimal(unwrappedPayload.y).toFixed(4))}
      </Text>
    </Card>
  )
}
