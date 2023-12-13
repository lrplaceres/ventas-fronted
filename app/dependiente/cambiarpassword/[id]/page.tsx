"use client";
import React, { FormEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { Box, Button, Typography, Container } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { useParams } from "next/navigation";

function Page() {
  const router = useRouter();

  const params = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const { data: session, update } = useSession();

  const [contrasenna, setContrasenna] = useState({
    contrasenna_nueva: "",
    repite_contrasenna_nueva: "",
  });

  const handleChange = ({ target: { name, value } } : any) => {
    setContrasenna({ ...contrasenna, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (contrasenna.contrasenna_nueva != contrasenna.repite_contrasenna_nueva) {
      return notificacion("Las contraseñas deben coincidir", "error");
    }

    try {
      fetch(`${process.env.MI_API_BACKEND}/dependiente-cambiar-contrasenna-propietario/${params?.id}`, {
        method: "PUT",
        body: JSON.stringify(contrasenna),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            notificacion(`Se ha cambiado la contraseña`, "info");

            setTimeout(() => router.push("/dependiente"), 300);
          } else {
            response.json().then((data) => {
              notificacion(`${data.detail}`);
            });
          }
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    } catch (error) {
      return notificacion(error);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" color="primary" align="center">
            CAMBIAR CONTRASEÑA
          </Typography>

          
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
              onClick={() => router.push("/dependiente")}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="info"
              type="submit"
              startIcon={<DoneIcon />}
            >
              Aceptar
            </Button>
          </Box>
        </form>
      </Container>
    </>
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
