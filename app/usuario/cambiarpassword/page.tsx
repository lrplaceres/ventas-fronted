"use client";
import React, { FormEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { Box, Button, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

function Page() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { data: session, update } = useSession();

  const [contrasenna, setContrasenna] = useState({
    contrasenna_nueva: "",
    repite_contrasenna_nueva: "",
    contrasenna_actual: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setContrasenna({ ...usuario, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (contrasenna.contrasenna_nueva != contrasenna.repite_contrasenna_nueva) {
        return notificacion("Las contraseñas deben coincidir", "error");
      }
    } catch (error) {
      return notificacion(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" color="primary" align="center">
        CAMBIAR CONTRASEÑA
      </Typography>

      <TextField
        id="contrasenna_actual"
        name="contrasenna_actual"
        label="Contraseña actual"
        fullWidth
        value={contrasenna.contrasenna_actual}
        onChange={handleChange}
        sx={{ mb: 1 }}
        type="password"
        required
      />
      <TextField
        id="contrasenna_nueva"
        name="contrasenna_nueva"
        label="Contraseña nueva"
        fullWidth
        value={contrasenna.contrasenna_nueva}
        onChange={handleChange}
        sx={{ mb: 1 }}
        type="password"
        required
      />
      <TextField
        id="repite_contrasenna_nueva"
        name="repite_contrasenna_nueva"
        label="Repite contraseña nueva"
        fullWidth
        value={contrasenna.repite_contrasenna_nueva}
        onChange={handleChange}
        sx={{ mb: 1 }}
        type="password"
        required
      />

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="inherit"
          sx={{ mr: 1 }}
          onClick={() => router.back()}
          startIcon={<CancelIcon />}
        >
          Cancelar
        </Button>
        <Button variant="contained" color="info" type="submit" startIcon={<DoneIcon />}>
          Aceptar
        </Button>
      </Box>
    </form>
  );
}

function FormCambiarcontrasenna() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default FormCambiarcontrasenna;
