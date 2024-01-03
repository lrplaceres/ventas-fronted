"use client";
import DenseAppBar from "./components/appMenuBar";
import { useSession } from "next-auth/react";
import ViewKiokoPropietario from "./negocio/_components/ViewNegocioPropietario";
import GraficoVentas7Dias from "./venta/_components/GraficoVentas7Dias";
import GraficoInversion7Dias from "./inventario/_components/GraficoInversion7dias";
import Container from "@mui/material/Container";
import Existencia from "./vender/_components/ExistenciaPunto";
import UsoGeneral from "./components/UsoGeneral";
import { Box, Grid, Typography } from "@mui/material";
import VentasDia from "./venta/_components/VentasDia";
import InversionDia from "./inventario/_components/InversionDia";
import UtilidadesDia from "./venta/_components/UtilidadesDia";

export default function Home() {
  const { data: session, update } = useSession();

  return (
    <main>
      <DenseAppBar />
      <Container maxWidth="lg">
        {session?.rol == "propietario" && (
          <>
            <ViewKiokoPropietario/>

            <Box sx={{ flexGrow: 1, mb: 4 }}>
              <Typography variant="h5" color="primary" align="center">ESTADÍSTICAS DEL DÍA</Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <VentasDia />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InversionDia />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <UtilidadesDia />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <GraficoVentas7Dias />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <GraficoInversion7Dias />
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
