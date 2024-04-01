import { Box, Card } from "@mui/material";
import { Header3 } from "../../textComponents";
import DefaultButton from "../../buttons/defaulButton";
import theme from "@/utils/theme";
import Artist from "@/types/artistTypes";
import Track from "@/types/trackTypes";
import Album from "@/types/albumTypes";
import Playlist from "@/types/playlistTypes";
import AddToPoolButton from "@/components/buttons/iconButtons/addToPoolButton";
import ShowMoreIconButton from "@/components/buttons/iconButtons/showMoreIconButton";

export default function ArtistCard(props: {
    artist: Artist,
    updatePool: (pool: Pool) => void
    token: string
    disabled: boolean
    enableAddButton: () => void
}) {

    return (
        <Card sx={{ bgcolor: 'secondary.main', width: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {props.artist.icon_link && (
                        <Box
                            sx={{
                                width: 50,
                                height: 50,
                                backgroundImage: `url(${props.artist.icon_link})`,
                                backgroundSize: 'cover',
                                margin: 1,
                            }}
                        />
                    )}
                    <Header3 text={props.artist.name} />
                </Box>
                <Box>
                    <AddToPoolButton newAdd={props.artist} updatePool={props.updatePool} token={props.token} disabled={props.disabled} />
                    <ShowMoreIconButton token={props.token} item={props.artist} updatePool={props.updatePool} enableAddButton={props.enableAddButton} />
                </Box>
            </Box>
        </Card>
    )
}
