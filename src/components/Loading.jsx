import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ text = "Cargando..." }) => {
  return (
    <Box
      sx={{
        minHeight: "30vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
};

export default Loading;
