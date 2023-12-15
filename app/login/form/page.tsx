import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { headers } from "next/headers";
import { Avatar } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default async function SignIn() {
  const csrfToken = await fetch(
    `${process.env.NEXT_PUBLIC_MI_API_FRONTEND}/api/auth/csrf`,
    {
      headers: headers(),
    }
  )
    .then((res) => res.json())
    .then((csrfTokenObject) => csrfTokenObject?.csrfToken);

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
