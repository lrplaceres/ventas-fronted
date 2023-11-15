import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Image from "next/image";
import puntoventa from "../../public/punto-de-venta.webp";
import Head from "next/head";

function login() {
  return (
    <>
      <Head>
        <title>SIMPLE_TPV</title>
      </Head>

      <Container
        maxWidth="sm"
        sx={{
          minHeight: "95vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Image
              src={puntoventa}
              alt="imagen"
              width={700}
              height={475}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <form>
              <TextField
                id="usuario"
                label="Usuario"
                //onChange={}
                fullWidth
                sx={{ mb: ".5rem" }}
              />

              <TextField
                id="password"
                label="Contraseña"
                //onChange={}
                fullWidth
                sx={{ mb: ".5rem" }}
                type="password"
              />

              <Button variant="contained" color="success">
                Acceder {process.env.MI_API_BACKEND}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default login;
