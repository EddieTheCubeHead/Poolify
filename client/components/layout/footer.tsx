import React from 'react'
import { Link, Box, Grid } from '@mui/material'
import theme from '@/components/theme'
import SkipButton from '../buttons/skipButton'
import { Text } from '../textComponents'
import { Playlist } from '../types'

interface FooterProps {
    token: string
}

const Footer: React.FC<FooterProps> = ({ token }) => {
    const backend_uri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const WS_URI = `${backend_uri?.replace("http", "ws")}/pool/playback/register_listener?token=${token}`;
    console.log(WS_URI)
    const playlist: Playlist = {
        name: '90s Ambient Techno Mix',
        uri: 'spotify:playlist:37i9dQZF1EIfMxLinpTxdB',
        link: '',
        icon_link:
            'https://seed-mix-image.spotifycdn.com/v6/img/desc/90s%20Ambient%20Techno/en/large',
    }

    if(token.length > 0) {
        const socket = new WebSocket(WS_URI)

        // Connection opened
        socket.addEventListener("open", event => {
            socket.send("Connection established")
        });

        // Listen for messages
        socket.addEventListener("message", event => {
            console.log("Message from server ", event.data)
        });
    }

    return (
        <Box
            sx={{
                bgcolor: theme.palette.secondary.dark,
                flexGrow: 1,
                height: 60,
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
            }}
        >
            <Grid container>
                <Grid
                    item
                    xs={9}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                >
                    {/*Image size fixed only for demo. Change when addressing first comment*/}
                    <img
                        src={playlist.icon_link}
                        style={{ width: 50, height: 50, padding: 0, margin: 0 }}
                        alt="Track image"
                    />
                    <Text
                        text={playlist.name}
                        fontWeight={'bold'}
                        color={'white'}
                    />
                    <SkipButton token={token} />
                </Grid>
                <Grid
                    item
                    xs={3}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Link
                        sx={{
                            color: theme.palette.primary.contrastText,
                            paddingRight: 2,
                        }}
                        href="/about"
                    >
                        About Stagnum
                    </Link>
                    <Link
                        sx={{
                            color: theme.palette.secondary.main,
                        }}
                        href="https://github.com/EddieTheCubeHead/Stagnum/discussions"
                        target="_blank"
                    >
                        Contact Us
                    </Link>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Footer
