import { Box, Card } from "@mui/material";
import { Header3 } from "../../textComponents";
import DefaultButton from "../../buttons/defaulButton";
import Track from "@/types/trackTypes";
import Album from "@/types/albumTypes";
import Playlist from "@/types/playlistTypes";
import Artist from "@/types/artistTypes";
import ShowMoreIconButton from "@/components/buttons/iconButtons/showMoreIconButton";
import AddToPoolButton from "@/components/buttons/iconButtons/addToPoolButton";

export default function TrackCard(props: {
    track: Track,
    handleAdding: (newAdd: Track | Album | Playlist | Artist) => void
    token: string
    disabled: boolean
    enableAddButton: () => void
}) {

    const truncatedName = props.track.name.length > 25 ? props.track.name.slice(0, 25) + "..." : props.track.name;


    return (
        <Card sx={{ bgcolor: 'secondary.light', width: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {props.track.album.link && (
                        <Box
                            sx={{
                                width: 50,
                                height: 50,
                                backgroundImage: `url(${props.track.album.link})`,
                                backgroundSize: 'cover',
                                margin: 1,
                            }}
                        />
                    )}
                    <Header3 text={truncatedName} sx={{ margin: 1 }} />
                </Box>
                <Box>
                    <AddToPoolButton handleAdding={props.handleAdding} newAdd={props.track} token={props.token} disabled={props.disabled} />
                    <ShowMoreIconButton token={props.token} item={props.track} handleAdding={props.handleAdding} enableAddButton={props.enableAddButton} />
                </Box>
            </Box>
        </Card>
    )
}