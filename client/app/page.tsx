'use client'

import Footer from '@/components/layout/footer'
import Search from '@/components/layout/search'
import SideMenu from '@/components/layout/sideMenu'
import { Box, CssBaseline, Grid, Stack, TextField } from '@mui/material'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { ThemeProvider } from "@emotion/react";
import theme from "../utils/theme";
import MainHeaderCard from '@/components/layout/mainHeaderCard'



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
            <Stack spacing={1}>
              <MainHeaderCard />
              <SideMenu setShowSearchBar={setShowSearchBar} showSearchBar={showSearchBar} />
            </Stack>
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
