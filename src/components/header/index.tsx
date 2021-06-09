import { useWeb3React } from '@web3-react/core'
import { ReactElement, useCallback } from 'react'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { injected } from '../../connectors'
import { shortenAddress } from '../../utils'
import { ButtonMedium } from '../button'
import logo from '../../assets/logo.svg'
import { UndecoratedInternalLink } from '../undecorated-link'
import { Sun, Moon } from 'react-feather'
import { useIsDarkMode, useToggleDarkMode } from '../../state/user/hooks'

const FlexContainer = styled(Flex)`
  position: fixed;
  z-index: 4;
  background-color: ${(props) => props.theme.background};
  border-bottom: solid 1px ${(props) => props.theme.divider};
`

const Logo = styled.img`
  height: 30px;
`

const AddressContainer = styled.div`
  height: 36px;
  color: ${(props) => props.theme.primary};
  border: solid 1px ${(props) => props.theme.primary};
  border-radius: 20px;
  padding: 0 16px;
  display: flex;
  align-items: center;
`

export const Header = (): ReactElement => {
  const { activate, account } = useWeb3React()
  const darkMode = useIsDarkMode()
  const toggleDarkMode = useToggleDarkMode()

  const handleClick = useCallback(() => {
    activate(injected)
  }, [activate])

  return (
    <>
      <FlexContainer width="100%" height="70px" justifyContent="center" alignItems="center" px="24px">
        <Flex width={['100%', '80%', '60%', '60%', '40%']} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Box>
              <UndecoratedInternalLink to="/">
                <Logo src={logo} alt="logo" />
              </UndecoratedInternalLink>
            </Box>
          </Flex>
          <Flex alignItems="center">
            <Box mr="20px">
              {!!account ? (
                <AddressContainer>{shortenAddress(account)}</AddressContainer>
              ) : (
                <ButtonMedium onClick={handleClick}>Connect wallet</ButtonMedium>
              )}
            </Box>
            <Box>
              {darkMode ? (
                <Sun size="20px" cursor="pointer" onClick={toggleDarkMode} />
              ) : (
                <Moon size="20px" cursor="pointer" onClick={toggleDarkMode} />
              )}
            </Box>
          </Flex>
        </Flex>
      </FlexContainer>
    </>
  )
}