import { getTheme } from '../../theme'
import { useIsDarkMode } from '../../state/user/hooks'
import { Footer } from '../../components/footer'
import { Header } from '../../components/header'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { Flex, Box } from 'rebass'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '../../theme'
import { SkeletonTheme } from 'react-loading-skeleton'
import { lazy, Suspense, useEffect } from 'react'
import useLocation from 'react-use/lib/useLocation'
import { TransactionsStateUpdater } from '../../state/transactions/updater'
import { NetworkWarningModal } from '../../components/network-warning-modal'

export function App() {
  const darkMode = useIsDarkMode()
  const theme = getTheme(darkMode)
  const location = useLocation()

  const Home = lazy(() => import('../home'))
  const Campaign = lazy(() => import('../campaign'))
  const Campaigns = lazy(() => import('../campaigns'))

  // resets scroll on body after every change of route
  useEffect(() => {
    document.getElementsByTagName('body')[0].scrollTo(0, 0)
  }, [location])

  return (
    <>
      <ThemeProvider theme={theme}>
        <TransactionsStateUpdater />
        <GlobalStyle />
        <SkeletonTheme baseColor={theme.border} highlightColor={theme.surfaceInteractive}>
          <Header />
          <Flex alignItems="center" flexDirection="column" pt="94px" height="100%">
            <Flex flexDirection="column" flex="1" width="100%">
              <Box flexGrow={1}>
                <Suspense fallback={<div />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/campaigns/:kpiId" element={<Campaign />} />
                  </Routes>
                </Suspense>
              </Box>
            </Flex>
            <Box width={['100%', '85%', '75%', '60%']}>
              <Footer />
            </Box>
          </Flex>
        </SkeletonTheme>
        <NetworkWarningModal />
      </ThemeProvider>
      <ToastContainer
        className="custom-toast-root"
        toastClassName="custom-toast-container"
        bodyClassName="custom-toast-body"
        position="top-right"
        closeButton={false}
        transition={Slide}
      />
    </>
  )
}
