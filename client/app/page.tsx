"use client";

import Footer from "@/components/layout/footer";
import { Box, CssBaseline, Grid, Stack } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "@emotion/react";
import theme from "../utils/theme";
import MainHeaderCard from "@/components/layout/mainHeaderCard";
import CreatePool from "@/components/layout/CreatePool";
import Album from "@/types/albumTypes";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedCollections, setSellectedCollections] = useState<Array<Album>>(
    []
  );
  const [token, setToken] = useState("");
  const queryParams = useSearchParams();
  const code = queryParams.get("code");
  const state = queryParams.get("state");
  const client_redirect_uri = "http://localhost:80";

  useEffect(() => {
    if (code && state) {
      handleTokenRequest(code, state);
    }
  }, []);

  const handleTokenRequest = (code: string, state: string) => {
    console.log("Sending play request");

    axios
      .get("http://localhost:8080/auth/login/callback", {
        params: { state, code, client_redirect_uri },
      })
      .then(function (response) {
        setToken(response.data.access_token);
      })
      .catch((error) => {
        console.log("Request failed", error);
      });
  };

  const handleAdd = (newAdd: Album) => {
    setSellectedCollections((curCollections) => [...curCollections, newAdd]);
  };

  const handleDelete = (itemToDelete: Album) => {
    setSellectedCollections((curCollections) =>
      curCollections.filter((collection) => collection !== itemToDelete)
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          border: 'dashed grey',
          width: '30%',
          float: 'left',
          padding: 1,
        }}
      >
        <MainHeaderCard />
        <Box sx={{
          border: 'dashed grey',
          width: '70%',
          float: 'right',
          padding: 1
        }}>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider >
  );
}
