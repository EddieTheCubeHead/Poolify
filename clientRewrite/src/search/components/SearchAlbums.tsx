import { useSpotifyResourceQuery } from "../hooks/useSpotifyResourceQuery.ts"
import { SearchCategoryTitleCard } from "./cards/SearchCategoryTitleCard.tsx"
import { useSearchStore } from "../../common/stores/searchStore.ts"
import { SpotifyAlbum } from "../types/SpotifyAlbum.ts"
import { SearchSpotifyAlbumCard } from "./cards/SearchSpotifyAlbumCard.tsx"
import { Album } from "../../common/icons/Album.tsx"

export const SearchAlbums = () => {
    const { data } = useSpotifyResourceQuery<SpotifyAlbum>("albums")
    const searchStore = useSearchStore()
    return (
        <div className="flex-col space-y-1 px-2">
            <SearchCategoryTitleCard
                title="Albums"
                icon={<Album />}
                isOpen={searchStore.isAlbumsOpened}
                setIsOpen={searchStore.setIsAlbumsOpened}
            />
            {searchStore.isAlbumsOpened ? (
                <div className="flex-col space-y-1 pl-8 pr-1">
                    {data?.items.map((album) => <SearchSpotifyAlbumCard key={album.uri} album={album} />)}
                </div>
            ) : (
                <div className="flex-col pl-8 pr-1 relative -top-1">
                    <div className="bg-elementBackground-1 h-1 -top-2 rounded-b-md"></div>
                </div>
            )}
        </div>
    )
}
