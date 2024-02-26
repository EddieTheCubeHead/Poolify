'use client'

import Footer from '@/app/components/layout/Footer'
import Search from '@/app/components/layout/Search'
import SideMenu from '@/app/components/layout/SideMenu'
import stagnumDarkTheme from '@/theme/stagnumTheme'
import theme from '@/theme/stagnumTheme'
import { Box, CssBaseline, Grid, TextField, ThemeProvider } from '@mui/material'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [token, setToken] = useState('')
  const queryParams = useSearchParams()
  const code = queryParams.get('code')
  const state = queryParams.get('state')
  const client_redirect_uri = 'http://localhost:80'

  useEffect(() => {
    if (code && state) {
      handleTokenRequest(code, state)
    }
  }, [])

  const handleTokenRequest = (code: string, state: string) => {
    console.log('Sending play request')

    axios.get('http://localhost:8080/auth/login/callback',
      { params: { state, code, client_redirect_uri } })
      .then(function (response) {
        console.log(response)
        setToken(response.data.access_token)
      }).catch((error) => {
        console.log('Request failed', error)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        margin: 1
      }}>
        <Grid container spacing={1} sx={{}}>

          <Grid item xs={3}>
            <SideMenu setShowSearchBar={setShowSearchBar} showSearchBar={showSearchBar} />
          </Grid>

          {showSearchBar == true &&
            <Search token={token} />
          }
        </Grid>
      </Box>
      <Footer />
    </ThemeProvider >
  )
}
