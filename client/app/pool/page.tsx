"use client";
import PoolList from "@/components/lists/PoolList";
import { Header1, Text } from "@/components/textComponents";
import theme from "@/utils/theme";
import {
  Box,
  CssBaseline,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import Image from "next/image";
import React from "react";

const Pool = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          margin: 2,
        }}
      >
        <Stack flexDirection={"row"}>
          <Image
            src={require("@/public/Stagnum_Logo.png")}
            height={45}
            alt={"Home background"}
            style={{ objectFit: "contain", margin: 10 }}
          />
          <Stack
            bgcolor={theme.palette.secondary.dark}
            flex={1}
            flexDirection={"row"}
            alignItems={"center"}
            px={2}
            gap={2}
            sx={{ ml: 2 }}
          >
            <Text
              text="V"
              color={theme.palette.secondary.contrastText}
              fontSize={28}
            />
            <TextField
              sx={{
                bgcolor: theme.palette.secondary.light,
                display: "flex",
                margin: 1,
                width: "30%",
              }}
              id="standard-search"
              label="Search field"
              onChange={() => {}}
            />
          </Stack>
        </Stack>

        <Stack
          sx={{
            bgcolor: theme.palette.secondary.dark,
            mt: 5,
            px: 5,
            borderRadius: 2,
          }}
        >
          <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
            <Header1
              text="Your Pool"
              sx={{
                color: theme.palette.secondary.contrastText,
                py: 2,
                flex: 1,
              }}
            />
            <Text
              text="ID: 2139800"
              sx={{
                color: theme.palette.secondary.contrastText,
                fontSize: "18px",
              }}
            />
            <Box
              sx={{
                bgcolor: theme.palette.secondary.light,
                p: 3,
                borderRadius: 30,
              }}
            />
            <Box
              sx={{
                bgcolor: theme.palette.secondary.light,
                p: 3,
                borderRadius: 30,
              }}
            />
            <Box
              sx={{
                bgcolor: theme.palette.secondary.light,
                p: 3,
                borderRadius: 30,
              }}
            />
          </Stack>
          <PoolList />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default Pool;
