"use client";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Container from "@mui/material/Container";

function Perfil() {
  const { data: session, update } = useSession();

  const [usuario, setUsuario] = useState({
    usuario: "",
    nombre: "",
    email: "",
    rol: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerUsuario = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.token_type} ${session.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuario(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h6" color="primary" align="center">
          MI PERFIL
        </Typography>

        <TextField
          id="usuario"
          label="Usuario"
          value={usuario.usuario}
          fullWidth
          sx={{ mb: 1 }}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          id="nombre"
          label="Nombre"
          value={usuario.nombre}
          fullWidth
          sx={{ mb: 1 }}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          id="email"
          label="Correo electrónico"
          value={usuario.email}
          fullWidth
          sx={{ mb: 1 }}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          id="rol"
          label="Rol"
          value={usuario.rol}
          fullWidth
          sx={{ mb: 1 }}
          InputProps={{
            readOnly: true,
          }}
        />
      </Container>
    </>
  );
}

function PagePerfil() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Perfil />
    </SnackbarProvider>
  );
}

export default PagePerfil;
