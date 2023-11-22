"use client";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";

function perfil() {

  const { data: session, update } = useSession();

  const [usuario, setUsuario] = useState({
    usuario: "",
    nombre: "",
    email: "",
    rol: "",
  });

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const obtenerUsuario = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${session.token_type} ${session.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuario(data);
      });
  };

  return (
    <>
      <Typography variant="h6" color="primary" align="center">
        MI PERFIL
      </Typography>

      <TextField
        id="usuario"
        label="Usuario"
        value={usuario.usuario}
        fullWidth
        sx={{mb: 1}}
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        id="nombre"
        label="Nombre"
        value={usuario.nombre}
        fullWidth
        sx={{mb: 1}}
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        id="email"
        label="Correo electrónico"
        value={usuario.email}
        fullWidth
        sx={{mb: 1}}
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        id="rol"
        label="Rol"
        value={usuario.rol}
        fullWidth
        sx={{mb: 1}}
        InputProps={{
          readOnly: true,
        }}
      />
    </>
  );
}

export default perfil;
