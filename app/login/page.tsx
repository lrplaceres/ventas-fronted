import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Image from "next/image";
import puntoventa from "../../public/punto-de-venta.webp";
import { headers } from "next/headers";

export default async function SignIn() {

  const csrfToken = await fetch(`${process.env.MI_API_FRONTEND}/api/auth/csrf`,{
    headers: headers(),
  })
    .then( res => res.json() )
    .then( csrfTokenObject => csrfTokenObject?.csrfToken );

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "90vh",
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
            <form method="post" action="/api/auth/callback/credentials">

              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              
              <TextField
                id="username"
                name="username"
                label="Usuario"
                fullWidth
                sx={{ mb: 1 }}
                required
              />

              <TextField
                id="password"
                name="password"
                label="Contraseña"
                fullWidth
                sx={{ mb: 1 }}
                type="password"
                required
              />

              <Button variant="contained" color="success" type="submit">
                Acceder
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

