import React from "react";
import Dashboard from "@/public/inicio.png";
import lista_puntos from "@/public/puntos.png";
import ventas_brutas from "@/public/ventas.png";
import Image from "next/image";
import { Box, Grid, Typography } from "@mui/material";

function Vistas() {
  return (
    <>
    <Typography variant="h4" color="primary" textAlign="center" mt={4}>
          ¿Conoce nuestro producto?
        </Typography>

      <Box sx={{ flexGrow: 1 }}>
       
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Image
                src={Dashboard}
                alt="imagen"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Grid>                

            <Grid item xs={12} sm={4}>
              <Image
                src={lista_puntos}
                alt="imagen"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Image
                src={ventas_brutas}
                alt="imagen"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Grid>
          </Grid>
 
          </Box>

    </>
  );
}

export default Vistas;
