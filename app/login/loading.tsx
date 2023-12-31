import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export default function LinearIndeterminate() {
  return (
    <>      
      <Box
        sx={{
          width: "100%",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" color="primary">
          SIMPLE
          <LinearProgress color="primary" />
        </Typography>
      </Box>
    </>
  );
}
