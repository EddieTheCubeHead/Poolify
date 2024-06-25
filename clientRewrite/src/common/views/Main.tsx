import { useTokenStore } from "../stores/tokenStore.ts"
import { fetchToken } from "../../api/fetchToken.ts"
import { TopBar } from "../components/TopBar.tsx"
import { useEffect } from "react"
import { EnsureLoginWrapper } from "../components/EnsureLoginWrapper.tsx"
import { Home } from "./Home.tsx"
import { ToolBar } from "../components/toolbar/ToolBar.tsx"
import { SearchSkeleton } from "../../search/components/SearchSkeleton.tsx"

export const Main = () => {
    const query = new URLSearchParams(window.location.search)
    const code = query.get("code")
    const state = query.get("state")
    const tokenStore = useTokenStore()
    useEffect(() => {
        if (code !== null && state !== null) {
            fetchToken(code, state).then((tokenData) => {
                tokenStore.setToken(tokenData.access_token)
                window.history.replaceState(null, "", window.location.pathname)
            })
        }
    }, [code, state])
    return (
        <div className="bg-background text-text min-h-screen font-default flex flex-col">
            <TopBar />
            {code === null || state === null ? <EnsureLoginWrapper view={<Home />} /> : <SearchSkeleton />}
            <ToolBar />
        </div>
    )
}
