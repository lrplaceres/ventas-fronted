import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { Avatar } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default async function SignIn() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  /*const csrfToken = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/csrf`,
    {
      headers: headers(),
    }
  )
    .then((res) => res.json())
    .then((csrfTokenObject) => csrfTokenObject?.csrfToken)
    .catch(error => {console.log(error), console.log(process.env.NEXTAUTH_URL)});
    */
    const csrfToken = cookies() //Might be empty before the first submit
    .getAll()
    .find( cookie => cookie.name == "authjs.csrf-token")?.value
    .split('|')[0]; 

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        
          <Avatar sx={{mb:3, backgroundColor: "secondary.main"}}>
          <LockIcon />
        </Avatar>


        <form method="post" action="/api/auth/callback/credentials">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <TextField
            id="username"
            name="username"
            label="Usuario"
            fullWidth
            sx={{ mb: 3 }}
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

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Acceder
          </Button>
        </form>
      </Container>
    </>
  );
}
