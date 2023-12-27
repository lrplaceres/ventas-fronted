"use client";
import React, { FormEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { useParams } from "next/navigation";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Contrasenna {
  contrasenna_nueva: string;
  repite_contrasenna_nueva: string;
}

function Page() {
  const router = useRouter();

  const params = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const { data: session, update } = useSession();

  const [contrasenna, setContrasenna] = useState<Contrasenna>({
    contrasenna_nueva: "",
    repite_contrasenna_nueva: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword: any = () => setShowPassword((show) => !show);

  const handleChange = ({ target: { name, value } }: any) => {
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
      fetch(
        `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/dependiente-cambiar-contrasenna-propietario/${params?.id}`,
        {
          method: "PUT",
          body: JSON.stringify(contrasenna),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )
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
        .catch(function (error: any) {
          notificacion("Se ha producido un error");
        });
    } catch (error: any) {
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
            type={showPassword ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="repite_contrasenna_nueva"
            name="repite_contrasenna_nueva"
            label="Repite contraseña nueva"
            fullWidth
            value={contrasenna.repite_contrasenna_nueva}
            onChange={handleChange}
            sx={{ mb: 1 }}
            type={showPassword ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
