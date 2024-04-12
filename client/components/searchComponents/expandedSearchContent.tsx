import { Box, LinearProgress, Stack } from '@mui/material'
import { Header2 } from '../textComponents'
import AlbumCard from './cards/albumCard'
import TrackCard from './cards/trackCard'
import PlaylistCard from './cards/playlistCard'
import ArtistCard from './cards/artistCard'
import { Album, Artist, Playlist, Pool, Track } from '../types'

interface ExpandedSearchContentProps {
    trackList: Track[]
    albumList: Album[]
    playlistList: Playlist[]
    artistList: Artist[]
    // eslint-disable-next-line no-unused-vars
    updatePool: (pool: Pool) => void
    disabled: boolean
    enableAddButton: () => void
    // eslint-disable-next-line no-unused-vars
    setErrorAlert: (message: string) => void
    ongoingSearch: boolean
}

const ExpandedSearchContent: React.FC<ExpandedSearchContentProps> = ({
    trackList,
    albumList,
    playlistList,
    artistList,
    updatePool,
    disabled,
    enableAddButton,
    setErrorAlert,
    ongoingSearch,
}) => {
    return (
        <Box sx={{ width: 1 }}>
            {ongoingSearch ? (
                <Box sx={{ width: '100%', padding: 2 }}>
                    <LinearProgress />
                </Box>
            ) : (
                <Stack sx={{ padding: 1, width: 1 }}>
                    <Header2 text={'Tracks'} sx={{ color: 'white' }} />
                    <Box
                        sx={{
                            margin: 1,
                            marginLeft: 2,
                            display: 'flex',
                            '& > *': {
                                marginRight: 4,
                                width: '20%',
                            },
                        }}
                    >
                        {trackList.slice(0, 2).map((track, key) => (
                            <TrackCard
                                key={key}
                                track={track}
                                updatePool={updatePool}
                                disabled={disabled}
                                enableAddButton={enableAddButton}
                                setErrorAlert={setErrorAlert}
                            />
                        ))}
                    </Box>
                    <Box
                        sx={{
                            margin: 1,
                            marginLeft: 2,
                            display: 'flex',
                            '& > *': {
                                marginRight: 4,
                                width: '20%',
                            },
                        }}
                    >
                        {trackList.slice(2, 4).map((track, key) => (
                            <TrackCard
                                key={key}
                                track={track}
                                updatePool={updatePool}
                                disabled={disabled}
                                enableAddButton={enableAddButton}
                                setErrorAlert={setErrorAlert}
                            />
                        ))}
                    </Box>
                    <Header2 text={'Albums'} sx={{ color: 'white' }} />
                    <Box
                        sx={{
                            margin: 1,
                            marginLeft: 2,
                            display: 'flex',
                            '& > *': {
                                marginRight: 4,
                            },
                        }}
                    >
                        {albumList.slice(0, 2).map((album, key) => (
                            <AlbumCard
                                key={key}
                                album={album}
                                updatePool={updatePool}
                                disabled={disabled}
                                enableAddButton={enableAddButton}
                                setErrorAlert={setErrorAlert}
                            />
                        ))}
                    </Box>
                    <Box
                        sx={{
                            margin: 1,
                            marginLeft: 2,
                            display: 'flex',
                            '& > *': {
                                marginRight: 4,
                            },
                        }}
                    >
                        {albumList.slice(2, 4).map((album, key) => (
                            <AlbumCard
                                key={key}
                                album={album}
                                updatePool={updatePool}
                                disabled={disabled}
                                enableAddButton={enableAddButton}
                                setErrorAlert={setErrorAlert}
                            />
                        ))}
                    </Box>
                    <Header2 text={'Playlists'} sx={{ color: 'white' }} />
                    <Box
                        sx={{
                            margin: 1,
                            marginLeft: 2,
                            display: 'flex',
                            '& > *': {
                                marginRight: 4,
                            },
                        }}
                    >
                        {playlistList.slice(0, 2).map((playlist, key) => (
                            <PlaylistCard
                                key={key}
                                playlist={playlist}
                                updatePool={updatePool}
                                disabled={disabled}
                                enableAddButton={enableAddButton}
                                setErrorAlert={setErrorAlert}
                            />
                        ))}
                    </Box>
                    <Box
                        sx={{
                            margin: 1,
                            marginLeft: 2,
                            display: 'flex',
                            '& > *': {
                                marginRight: 4,
                            },
                        }}
                    >
                        {playlistList.slice(2, 4).map((playlist, key) => (
                            <PlaylistCard
                                key={key}
                                playlist={playlist}
                                updatePool={updatePool}
                                disabled={disabled}
                                enableAddButton={enableAddButton}
                                setErrorAlert={setErrorAlert}
                            />
                        ))}
                    </Box>
                    <Header2 text={'Artists'} sx={{ color: 'white' }} />
                    <Box
                        sx={{
                            margin: 1,
                            marginLeft: 2,
                            display: 'flex',
                            '& > *': {
                                marginRight: 4,
                            },
                        }}
                    >
                        {artistList.slice(0, 2).map((artist, key) => (
                            <ArtistCard
                                key={key}
                                artist={artist}
                                updatePool={updatePool}
                                disabled={disabled}
                                enableAddButton={enableAddButton}
                                setErrorAlert={setErrorAlert}
                            />
                        ))}
                    </Box>
                    <Box
                        sx={{
                            margin: 1,
                            marginLeft: 2,
                            display: 'flex',
                            '& > *': {
                                marginRight: 4,
                            },
                        }}
                    >
                        {artistList.slice(2, 4).map((artist, key) => (
                            <ArtistCard
                                key={key}
                                artist={artist}
                                updatePool={updatePool}
                                disabled={disabled}
                                enableAddButton={enableAddButton}
                                setErrorAlert={setErrorAlert}
                            />
                        ))}
                    </Box>
                </Stack>
            )}
        </Box>
    )
}

export default ExpandedSearchContent
