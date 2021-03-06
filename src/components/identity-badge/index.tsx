import { ReactElement } from 'react'
import styled from 'styled-components'
import { shortenAddress } from '../../utils'
import makeBlockie from 'ethereum-blockies-base64'
import { Flex, Text } from 'rebass'
import { useIsMobile } from '../../hooks/useIsMobile'
import { getAddress } from '@ethersproject/address'
import { useEnsName } from '../../hooks/useEnsName'
import Skeleton from 'react-loading-skeleton'
import { useEnsAvatarUrl } from '../../hooks/useEnsAvatar'

const FlexContainer = styled(Flex)<{ onClick?: any; mobile: boolean }>`
  position: relative;
  align-items: center;
  height: 28px;
  width: fit-content;
  border: ${(props) => `solid 1px ${props.theme.border}`};
  border-radius: 8px !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px;
  background-color: ${(props) => props.theme.surface};
  transition: background-color 0.2s ease, border 0.2s ease;
  padding: ${(props) => (props.mobile ? '0px' : '0px 8px 0px 0px')};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'auto')};
`

const AvatarBackground = styled.div<{ mobile: boolean }>`
  position: relative;
  height: 26px;
  width: 26px;
  border-radius: 6px;
  margin-right: ${(props) => (props.mobile ? 0 : '8px')};
  background: ${(props) => props.theme.surfaceContentSecondary};
`

const Avatar = styled.div<{ mobile: boolean; backgroundUrl: string }>`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 26px;
  width: 26px;
  border-radius: 6px;
  background-image: url('${(props) => props.backgroundUrl}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

const AvatarSkeleton = styled(Skeleton)<{ mobile: boolean }>`
  margin-bottom: 3px;
  border-radius: 6px;
  margin-right: ${(props) => (props.mobile ? 0 : '8px')};
`

const ConnectedDot = styled.div`
  border-radius: 50%;
  border: solid 3px ${(props) => props.theme.background};
  transition: border 0.2s ease;
  width: 8px;
  height: 8px;
  background-color: ${(props) => props.theme.positive};
  position: absolute;
  bottom: -6px;
  left: -6px;
`

export const IdentityBadge = ({ account, onClick }: { account: string; onClick?: () => void }): ReactElement => {
  const isMobile = useIsMobile()
  const { loading: loadingEnsName, name: ensName } = useEnsName(account)
  const { loading: loadingEnsAvatar, avatarUrl: ensAvatarUrl } = useEnsAvatarUrl(ensName)

  return (
    <>
      <FlexContainer mobile={isMobile} onClick={onClick}>
        {loadingEnsAvatar ? (
          <AvatarSkeleton mobile={isMobile} width="26px" height="26px" />
        ) : (
          <AvatarBackground mobile={isMobile}>
            <Avatar mobile={isMobile} backgroundUrl={ensAvatarUrl || makeBlockie(getAddress(account))} />
          </AvatarBackground>
        )}
        {!isMobile &&
          (loadingEnsName ? (
            <Skeleton width="140px" />
          ) : (
            <Text fontFamily="Overpass Mono" marginTop="2px">
              {ensName || shortenAddress(account)}
            </Text>
          ))}
        {isMobile && <ConnectedDot />}
      </FlexContainer>
    </>
  )
}
