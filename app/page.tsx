"use client";
import DenseAppBar from "./components/appMenuBar";
import { useSession } from "next-auth/react";
import ViewKiokoPropietario from "./negocio/_components/ViewNegocioPropietario";
import GraficoVentas7Dias from "./venta/_components/GraficoVentas7Dias";
import Container from "@mui/material/Container";
import Existencia from "./vender/_components/ExistenciaPunto";
import UsoGeneral from "./components/UsoGeneral";
import { Box, Grid, Typography } from "@mui/material";

export default function Home() {
  const { data: session, update } = useSession();

  return (
    <main>
      <DenseAppBar />
      <Container maxWidth="lg">
        {session?.rol == "propietario" && (
          <>
            <ViewKiokoPropietario/>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                  <GraficoVentas7Dias />
                </Grid>              
              </Grid>
            </Box>
          </>
        )}
      </Container>

      {session?.rol == "superadmin" && <UsoGeneral />}

      {session?.rol == "dependiente" && <Existencia />}
    </main>
  );
}
