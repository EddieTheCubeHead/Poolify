import { IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Album from "@/types/albumTypes";
import Artist from "@/types/artistTypes";
import Playlist from "@/types/playlistTypes";
import Track from "@/types/trackTypes";
import axios from "axios";

interface Props {
    newAdd: Track | Album | Playlist | Artist,
    handleAdding: (newAdd: Track | Album | Playlist | Artist) => void
    token: string
}

export default function AddToPoolButton({ newAdd, handleAdding, token }: Props) {

    const backend_uri = process.env.NEXT_PUBLIC_BACKEND_URI

    const handleClick = () => {
        handleAdding(newAdd)

        axios
            .get(`${backend_uri}/pool/content`, {
                headers: { token },
            })
            .then(function () {
                console.log(newAdd.name, 'deleted')
            })
            .catch((error) => {
                console.log("Request failed", error);
            });
    };

    return (
        <Tooltip title='Add to pool'>
            <IconButton
                aria-label=""
                onClick={handleClick}
                sx={{
                    "&:hover": {
                        color: 'white',
                    },
                    color: 'black',
                    margin: 1
                }}
            >
                <AddIcon />
            </IconButton>
        </Tooltip >
    )
}